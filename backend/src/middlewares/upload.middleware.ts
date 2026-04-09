import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import multer from 'multer';
import { AppError } from './error.middleware';

const poiImageDir = path.resolve(__dirname, '..', '..', 'img_modules', 'poi');
fs.mkdirSync(poiImageDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, poiImageDir);
  },
  filename: (_req, file, callback) => {
    const ext = path.extname(file.originalname) || '.jpg';
    callback(null, `${Date.now()}-${randomUUID()}${ext}`);
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, callback) => {
  if (!file.mimetype.startsWith('image/')) {
    callback(new AppError(400, 'Only image files are allowed'));
    return;
  }

  callback(null, true);
};

export const poiImageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});