import e from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const DIR = 'uploads/image';
const MAX_SIZE_LIMIT = 1024 * 1024 * 5;
const ALLOW_EXT = ['.png', '.jpeg', '.PNG', '.JPEG', '.jpg', '.JPG'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Jika folder belum dibuat sebelumnya
    if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
    cb(null, DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ext);
  },
});

function fileFilter(req: e.Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
  const ext = path.extname(file.originalname);
  const ind = ALLOW_EXT.findIndex((e) => e === ext);
  if (ind < 0) {
    callback(new Error('Diluar nurul'));
  } else callback(null, true);
}

const UploadImageMulter = multer({ storage: storage, fileFilter, limits: { fileSize: MAX_SIZE_LIMIT } });
export default UploadImageMulter;
