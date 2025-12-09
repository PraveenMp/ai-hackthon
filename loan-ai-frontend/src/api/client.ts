import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Applicant APIs
export const applicantAPI = {
    create: (data: { name: string; email?: string; phone?: string }) =>
        api.post('/applicant', data),

    getAll: () => api.get('/applicant'),

    getById: (id: string) => api.get(`/applicant/${id}`),

    delete: (id: string) => api.delete(`/applicant/${id}`),
};

// Upload APIs
export const uploadAPI = {
    uploadDocument: (formData: FormData) =>
        api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),

    getByApplicant: (applicantId: string) =>
        api.get(`/upload/applicant/${applicantId}`),

    delete: (id: string) => api.delete(`/upload/${id}`),
};

// Analysis APIs
export const analysisAPI = {
    run: (applicantId: string) =>
        api.post('/analysis/run', { applicantId }),

    getByApplicant: (applicantId: string) =>
        api.get(`/analysis/applicant/${applicantId}`),

    getById: (id: string) => api.get(`/analysis/${id}`),
};

export default api;
