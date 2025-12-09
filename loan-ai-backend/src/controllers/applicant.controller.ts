import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createApplicant(req: Request, res: Response) {
    try {
        const { name, email, phone } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'Name is required'
            });
        }

        const applicant = await prisma.applicant.create({
            data: {
                name,
                email: email || null,
                phone: phone || null,
            },
        });

        res.status(201).json({
            success: true,
            data: applicant,
            message: 'Applicant created successfully'
        });
    } catch (error) {
        console.error('Create applicant error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create applicant'
        });
    }
}

export async function getAllApplicants(req: Request, res: Response) {
    try {
        const applicants = await prisma.applicant.findMany({
            include: {
                documents: true,
                analyses: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({
            success: true,
            data: applicants
        });
    } catch (error) {
        console.error('Get applicants error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch applicants'
        });
    }
}

export async function getApplicantById(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const applicant = await prisma.applicant.findUnique({
            where: { id },
            include: {
                documents: {
                    orderBy: { createdAt: 'desc' },
                },
                analyses: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!applicant) {
            return res.status(404).json({
                success: false,
                error: 'Applicant not found'
            });
        }

        res.json({
            success: true,
            data: applicant
        });
    } catch (error) {
        console.error('Get applicant error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch applicant'
        });
    }
}

export async function deleteApplicant(req: Request, res: Response) {
    try {
        const { id } = req.params;

        await prisma.applicant.delete({
            where: { id },
        });

        res.json({
            success: true,
            message: 'Applicant deleted successfully'
        });
    } catch (error) {
        console.error('Delete applicant error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete applicant'
        });
    }
}
