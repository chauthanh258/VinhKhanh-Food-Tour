import { Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service';
import * as auditService from '../services/audit.service';
import { sendResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const getAllCategories = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const result = await categoryService.getAllCategories(includeInactive);
    sendResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return sendResponse(res, 404, null, 'Category not found');
    }
    sendResponse(res, 200, category);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = req.user!.userId;
    const { isActive, translations } = req.body;

    if (!translations || !Array.isArray(translations) || translations.length === 0) {
      return sendResponse(res, 400, null, 'At least one translation is required');
    }

    const category = await categoryService.createCategory(adminId, {
      isActive,
      translations,
    });

    try {
      await auditService.logAdminAction(adminId, 'CREATE_CATEGORY', category.id, {
        name: translations[0]?.name,
        language: translations[0]?.language,
      });
    } catch (auditError) {
      console.error('Failed to log audit action:', auditError);
    }

    sendResponse(res, 201, category, 'Category created successfully');
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = req.user!.userId;
    const { isActive, translations } = req.body;

    const category = await categoryService.updateCategory(adminId, req.params.id, {
      isActive,
      translations,
    });

    try {
      await auditService.logAdminAction(adminId, 'UPDATE_CATEGORY', req.params.id, {
        name: translations?.[0]?.name,
      });
    } catch (auditError) {
      console.error('Failed to log audit action:', auditError);
    }

    sendResponse(res, 200, category, 'Category updated successfully');
  } catch (error: any) {
    if (error.message === 'Category not found') {
      return sendResponse(res, 404, null, 'Category not found');
    }
    next(error);
  }
};

export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = req.user!.userId;
    const category = await categoryService.deleteCategory(adminId, req.params.id);

    try {
      const categoryName = category?.translations?.[0]?.name || category?.id || 'category';
      await auditService.logAdminAction(adminId, 'DELETE_CATEGORY', req.params.id, { name: categoryName });
    } catch (auditError) {
      console.error('Failed to log audit action:', auditError);
    }

    sendResponse(res, 200, category, 'Category deleted successfully');
  } catch (error: any) {
    if (error.message === 'Category not found') {
      return sendResponse(res, 404, null, 'Category not found');
    }
    next(error);
  }
};

export const restoreCategory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = req.user!.userId;
    const category = await categoryService.restoreCategory(adminId, req.params.id);

    try {
      const categoryName = category.translations?.[0]?.name || category.id;
      await auditService.logAdminAction(adminId, 'RESTORE_CATEGORY', req.params.id, { name: categoryName });
    } catch (auditError) {
      console.error('Failed to log audit action:', auditError);
    }

    sendResponse(res, 200, category, 'Category restored successfully');
  } catch (error: any) {
    if (error.message === 'Category not found') {
      return sendResponse(res, 404, null, 'Category not found');
    }
    next(error);
  }
};
