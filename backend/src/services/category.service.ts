import prisma from '../utils/prisma';

export const getAllCategories = async (includeInactive: boolean = false) => {
  const where = includeInactive ? {} : { deletedAt: null, isActive: true };

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      include: {
        translations: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.count({ where }),
  ]);

  const activePoiCounts = await prisma.pOI.groupBy({
    by: ['categoryId'],
    where: {
      categoryId: { in: categories.map((category) => category.id) },
      isActive: true,
    },
    _count: { _all: true },
  });

  const countsByCategoryId = new Map(activePoiCounts.map((item) => [item.categoryId, item._count._all]));

  return { 
    categories: categories.map(cat => ({
      ...cat,
      translations: cat.translations ? [cat.translations] : [],
      _count: { pois: countsByCategoryId.get(cat.id) ?? 0 }
    })), 
    total 
  };
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      translations: true,
    },
  });

  if (!category) return null;

  const activePoiCount = await prisma.pOI.count({
    where: { categoryId: id, isActive: true },
  });

  return {
    ...category,
    translations: category.translations ? [category.translations] : [],
    _count: { pois: activePoiCount },
  };
};

export const createCategory = async (
  adminId: string,
  data: {
    isActive?: boolean;
    translations: Array<{
      name: string;
      description?: string;
      language: string;
    }>;
  }
) => {
  const category = await prisma.category.create({
    data: {
      isActive: data.isActive ?? true,
      translations: {
        create: data.translations,
      },
    },
    include: {
      translations: true,
    },
  });

  return {
    ...category,
    translations: category.translations ? [category.translations] : []
  };
};

export const updateCategory = async (
  adminId: string,
  categoryId: string,
  data: {
    isActive?: boolean;
    translations?: Array<{
      name: string;
      description?: string;
      language: string;
    }>;
  }
) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { translations: true },
  });

  if (!existingCategory) {
    throw new Error('Category not found');
  }

  const updateData: any = {};
  if (data.isActive !== undefined) {
    updateData.isActive = data.isActive;
  }

  if (data.translations) {
    for (const translation of data.translations) {
      const transObj = existingCategory.translations;
      const existingTranslation = transObj && (transObj as any).language === translation.language ? transObj : null;

      if (existingTranslation) {
        await prisma.categoryTranslation.update({
          where: { id: (existingTranslation as any).id },
          data: {
            name: translation.name,
            description: translation.description,
          },
        });
      } else {
        await prisma.categoryTranslation.create({
          data: {
            categoryId,
            name: translation.name,
            description: translation.description,
            language: translation.language,
          },
        });
      }
    }
  }

  const updatedCategory = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      translations: true,
    },
  });

  // Tính lại số lượng POI hoạt động sau khi cập nhật
  const activePoiCount = await prisma.pOI.count({
    where: { categoryId: categoryId, isActive: true },
  });

  return {
    ...updatedCategory,
    translations: updatedCategory?.translations ? [updatedCategory.translations] : [],
    _count: { pois: activePoiCount },
  };
};

export const deleteCategory = async (adminId: string, categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { translations: true },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  // Chỉ kiểm tra POI đang hoạt động, POI tạm ngưng không ngăn cản xóa danh mục
  const activePoiCount = await prisma.pOI.count({
    where: {
      categoryId: categoryId,
      isActive: true,
      deletedAt: null,
    },
  });

  if (activePoiCount > 0) {
    throw new Error(`Không thể xóa danh mục vì còn ${activePoiCount} POI hoạt động thuộc danh mục này. Vui lòng chuyển POI sang danh mục khác hoặc tạm ngưng POI trước.`);
  }

  const result = await prisma.category.update({
    where: { id: categoryId },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
    include: { translations: true },
  });
  
  return {
    ...result,
    translations: result.translations ? [result.translations] : []
  };
};

export const restoreCategory = async (adminId: string, categoryId: string) => {
  const restoredCategory = await prisma.category.update({
    where: { id: categoryId },
    data: {
      deletedAt: null,
      isActive: true,
    },
    include: {
      translations: true,
    },
  });

  // Tính lại số lượng POI hoạt động sau khi khôi phục
  const activePoiCount = await prisma.pOI.count({
    where: { categoryId: categoryId, isActive: true },
  });

  return {
    ...restoredCategory,
    translations: restoredCategory.translations ? [restoredCategory.translations] : [],
    _count: { pois: activePoiCount },
  };
};
