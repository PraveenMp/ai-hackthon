import { Router } from 'express';
import {
    runAnalysis,
    getAnalysisByApplicant,
    getAnalysisById,
} from '../controllers/analysis.controller.js';

const router = Router();

router.post('/run', runAnalysis);
router.get('/applicant/:applicantId', getAnalysisByApplicant);
router.get('/:id', getAnalysisById);

export default router;
