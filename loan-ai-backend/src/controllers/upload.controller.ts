import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { extractTextFromPDF } from '../utils/pdf.js';
import { performOCR } from '../utils/ocr.js';
import { classifyDocument } from '../services/classification.service.js';

const prisma = new PrismaClient();

export async function uploadDocument(req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        const { applicantId } = req.body;

        if (!applicantId) {
            return res.status(400).json({
                success: false,
                error: 'Applicant ID is required'
            });
        }

        // Verify applicant exists
        const applicant = await prisma.applicant.findUnique({
            where: { id: applicantId },
        });

        if (!applicant) {
            return res.status(404).json({
                success: false,
                error: 'Applicant not found'
            });
        }

        const { originalname, filename, path, mimetype, size } = req.file;

        // Extract text from document
        let extractedText = '';
        try {
            if (mimetype === 'application/pdf') {
                extractedText = await extractTextFromPDF(path);
            } else if (mimetype.startsWith('image/')) {
                extractedText = await performOCR(path);
            }
        } catch (error) {
            console.error('Text extraction error:', error);
        }

        // Classify document using AI
        let documentType = 'UNKNOWN';
        let classifiedAt = null;

        if (extractedText) {
            try {
                documentType = await classifyDocument(extractedText);
                classifiedAt = new Date();
            } catch (error) {
                console.error('Classification error:', error);
            }
        }

        // Save document to database
        const document = await prisma.document.create({
            data: {
                applicantId,
                originalName: originalname,
                fileName: filename,
                filePath: path,
                mimeType: mimetype,
                size,
                documentType: documentType as any,
                extractedText,
                classifiedAt,
            },
        });

        res.status(201).json({
            success: true,
            data: document,
            message: 'Document uploaded and classified successfully'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload document'
        });
    }
}

export async function getDocumentsByApplicant(req: Request, res: Response) {
    try {
        const { applicantId } = req.params;

        const documents = await prisma.document.findMany({
            where: { applicantId },
            orderBy: { createdAt: 'desc' },
        });

        res.json({
            success: true,
            data: documents
        });
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch documents'
        });
    }
}

export async function deleteDocument(req: Request, res: Response) {
    try {
        const { id } = req.params;

        await prisma.document.delete({
            where: { id },
        });

        res.json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete document'
        });
    }
}
