import { Router } from 'express';
import * as categoryService from '../services/category.service';
import { sendResponse } from '../utils/response.util';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories(false);
    sendResponse(res, 200, categories);
  } catch (error) {
    next(error);
  }
});

export default router;
