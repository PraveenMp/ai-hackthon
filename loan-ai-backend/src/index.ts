import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import applicantRoutes from './routes/applicant.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import analysisRoutes from './routes/analysis.routes.js';

const app = express();

// Middleware
app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/applicant', applicantRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analysis', analysisRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Loan AI Backend'
    });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// Start server
const PORT = config.port || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Loan AI Backend running on port ${PORT}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🔗 CORS enabled for: ${config.corsOrigin}`);
});
