import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js';
import { verifyToken } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure uploads directory exists - use /tmp for Vercel
const uploadDir = '/tmp/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

// Route
router.post('/', verifyToken, upload.single('image'), uploadImage);

export default router;
