import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { config } from '../config/env.js';
import {
    uploadDocument,
    getDocumentsByApplicant,
    deleteDocument,
} from '../controllers/upload.controller.js';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: config.maxFileSize },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|png|jpg|jpeg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF and image files (PNG, JPG, JPEG) are allowed'));
        }
    }
});

router.post('/', upload.single('document'), uploadDocument);
router.get('/applicant/:applicantId', getDocumentsByApplicant);
router.delete('/:id', deleteDocument);

export default router;
