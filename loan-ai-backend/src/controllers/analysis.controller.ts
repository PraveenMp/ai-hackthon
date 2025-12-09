import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { extractDocumentData } from '../services/extraction.service.js';
import { evaluateRules } from '../services/rules.service.js';
import { generateUnderwritingSummary } from '../services/summary.service.js';
import { encrypt } from '../utils/encryption.js';
import type { ExtractedDataMap } from '../types/index.js';

const prisma = new PrismaClient();

export async function runAnalysis(req: Request, res: Response) {
    try {
        const { applicantId } = req.body;

        if (!applicantId) {
            return res.status(400).json({
                success: false,
                error: 'Applicant ID is required'
            });
        }

        // Fetch all documents for the applicant
        const documents = await prisma.document.findMany({
            where: { applicantId },
        });

        if (documents.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No documents found for this applicant'
            });
        }

        // Initialize extracted data structure
        const extractedData: ExtractedDataMap = {
            salarySlips: [],
            bankStatement: null,
            pan: null,
            aadhaar: null,
            form16: null,
            addressProof: null,
            officeId: null,
        };

        // Extract data from each document
        for (const doc of documents) {
            if (!doc.extractedText) continue;

            const data = await extractDocumentData(doc.extractedText, doc.documentType);

            if (data) {
                switch (doc.documentType) {
                    case 'SALARY_SLIP':
                        extractedData.salarySlips.push(data);
                        break;
                    case 'BANK_STATEMENT':
                        extractedData.bankStatement = data;
                        break;
                    case 'PAN':
                        extractedData.pan = data;
                        // Encrypt PAN number
                        if (data.panNumber) {
                            extractedData.pan.panNumber = encrypt(data.panNumber);
                        }
                        break;
                    case 'AADHAAR':
                        extractedData.aadhaar = data;
                        // Encrypt Aadhaar number
                        if (data.aadhaarNumber) {
                            extractedData.aadhaar.aadhaarNumber = encrypt(data.aadhaarNumber);
                        }
                        break;
                    case 'FORM_16':
                        extractedData.form16 = data;
                        break;
                    case 'ADDRESS_PROOF':
                        extractedData.addressProof = data;
                        break;
                    case 'OFFICE_ID':
                        extractedData.officeId = data;
                        break;
                }
            }
        }

        // Sort salary slips by date (most recent first)
        extractedData.salarySlips.sort((a, b) => {
            return new Date(b.month).getTime() - new Date(a.month).getTime();
        });

        // Apply business rules
        const ruleResults = evaluateRules(extractedData);

        // Generate AI summary
        const aiSummary = await generateUnderwritingSummary(extractedData, ruleResults);

        // Save analysis to database
        const analysis = await prisma.analysis.create({
            data: {
                applicantId,
                extractedData: JSON.stringify(extractedData),
                ruleResults: JSON.stringify(ruleResults),
                riskScore: ruleResults.riskScore,
                riskLevel: ruleResults.riskLevel,
                aiSummary,
            },
        });

        res.json({
            success: true,
            data: {
                id: analysis.id,
                applicantId: analysis.applicantId,
                extractedData,
                ruleResults,
                riskScore: analysis.riskScore,
                riskLevel: analysis.riskLevel,
                aiSummary: analysis.aiSummary,
                createdAt: analysis.createdAt,
            },
            message: 'Analysis completed successfully'
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to run analysis'
        });
    }
}

export async function getAnalysisByApplicant(req: Request, res: Response) {
    try {
        const { applicantId } = req.params;

        const analyses = await prisma.analysis.findMany({
            where: { applicantId },
            orderBy: { createdAt: 'desc' },
        });

        const formattedAnalyses = analyses.map(analysis => ({
            id: analysis.id,
            applicantId: analysis.applicantId,
            extractedData: JSON.parse(analysis.extractedData),
            ruleResults: JSON.parse(analysis.ruleResults),
            riskScore: analysis.riskScore,
            riskLevel: analysis.riskLevel,
            aiSummary: analysis.aiSummary,
            createdAt: analysis.createdAt,
        }));

        res.json({
            success: true,
            data: formattedAnalyses
        });
    } catch (error) {
        console.error('Get analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch analysis'
        });
    }
}

export async function getAnalysisById(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const analysis = await prisma.analysis.findUnique({
            where: { id },
            include: {
                applicant: true,
            },
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                error: 'Analysis not found'
            });
        }

        res.json({
            success: true,
            data: {
                id: analysis.id,
                applicantId: analysis.applicantId,
                applicant: analysis.applicant,
                extractedData: JSON.parse(analysis.extractedData),
                ruleResults: JSON.parse(analysis.ruleResults),
                riskScore: analysis.riskScore,
                riskLevel: analysis.riskLevel,
                aiSummary: analysis.aiSummary,
                createdAt: analysis.createdAt,
            }
        });
    } catch (error) {
        console.error('Get analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch analysis'
        });
    }
}
