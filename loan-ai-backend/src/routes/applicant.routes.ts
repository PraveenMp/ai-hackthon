import { Router } from 'express';
import {
    createApplicant,
    getAllApplicants,
    getApplicantById,
    deleteApplicant,
} from '../controllers/applicant.controller.js';

const router = Router();

router.post('/', createApplicant);
router.get('/', getAllApplicants);
router.get('/:id', getApplicantById);
router.delete('/:id', deleteApplicant);

export default router;
