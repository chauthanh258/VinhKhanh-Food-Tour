import prisma from '../utils/prisma';

export const getAllCategories = async (includeInactive: boolean = false) => {
  const where = includeInactive ? {} : { deletedAt: null, isActive: true };

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      include: {
        translations: true,
        _count: {
          select: { pois: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.count({ where }),
  ]);

  return { categories, total };
};

export const getCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      translations: true,
      _count: {
        select: { pois: true },
      },
    },
  });
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

  return category;
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
      const existingTranslation = existingCategory.translations.find(
        (t) => t.language === translation.language
      );

      if (existingTranslation) {
        await prisma.categoryTranslation.update({
          where: { id: existingTranslation.id },
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

  return prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      translations: true,
      _count: { select: { pois: true } },
    },
  });
};

export const deleteCategory = async (adminId: string, categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return prisma.category.update({
    where: { id: categoryId },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  });
};

export const restoreCategory = async (adminId: string, categoryId: string) => {
  return prisma.category.update({
    where: { id: categoryId },
    data: {
      deletedAt: null,
      isActive: true,
    },
    include: {
      translations: true,
      _count: { select: { pois: true } },
    },
  });
};
