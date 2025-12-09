import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicantAPI, uploadAPI, analysisAPI } from '../api/client';
import type { Applicant, Document, Analysis } from '../types';

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
    UNKNOWN: 'Unknown',
    SALARY_SLIP: 'Salary Slip',
    BANK_STATEMENT: 'Bank Statement',
    AADHAAR: 'Aadhaar Card',
    PAN: 'PAN Card',
    ADDRESS_PROOF: 'Address Proof',
    FORM_16: 'Form 16',
    OFFICE_ID: 'Office ID Card',
};

export default function ApplicantDetail() {
    const { id } = useParams<{ id: string }>();
    const [applicant, setApplicant] = useState<Applicant | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [analyses, setAnalyses] = useState<Analysis[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            const [applicantRes, documentsRes, analysesRes] = await Promise.all([
                applicantAPI.getById(id!),
                uploadAPI.getByApplicant(id!),
                analysisAPI.getByApplicant(id!),
            ]);

            setApplicant(applicantRes.data.data);
            setDocuments(documentsRes.data.data);
            setAnalyses(analysesRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('document', file);
        formData.append('applicantId', id!);

        try {
            await uploadAPI.uploadDocument(formData);
            fetchData();
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    const handleRunAnalysis = async () => {
        if (!confirm('Run AI analysis on all uploaded documents?')) return;

        setAnalyzing(true);
        try {
            await analysisAPI.run(id!);
            fetchData();
        } catch (error) {
            console.error('Error running analysis:', error);
            alert('Failed to run analysis');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleDeleteDocument = async (docId: string) => {
        if (!confirm('Delete this document?')) return;

        try {
            await uploadAPI.delete(docId);
            fetchData();
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    if (!applicant) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">Applicant not found</div>
            </div>
        );
    }

    const latestAnalysis = analyses[0];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
                        ← Back to Applicants
                    </Link>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{applicant.name}</h1>
                            {applicant.email && <p className="text-gray-600 mt-1">{applicant.email}</p>}
                            {applicant.phone && <p className="text-gray-600">{applicant.phone}</p>}
                        </div>
                        {latestAnalysis && (
                            <div className="text-right">
                                <span className={`badge badge-${latestAnalysis.riskLevel.toLowerCase()} text-lg`}>
                                    {latestAnalysis.riskLevel} RISK
                                </span>
                                <p className="text-sm text-gray-600 mt-2">
                                    Risk Score: {latestAnalysis.riskScore}/100
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Documents Section */}
                <div className="card mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
                        <div className="flex gap-2">
                            <label className="btn-primary cursor-pointer">
                                {uploading ? 'Uploading...' : '+ Upload Document'}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                            </label>
                            <button
                                onClick={handleRunAnalysis}
                                disabled={analyzing || documents.length === 0}
                                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {analyzing ? 'Analyzing...' : '🤖 Run AI Analysis'}
                            </button>
                        </div>
                    </div>

                    {documents.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Document Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Size
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Uploaded
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {documents.map((doc) => (
                                        <tr key={doc.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {doc.originalName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`badge ${doc.documentType === 'UNKNOWN' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {DOCUMENT_TYPE_LABELS[doc.documentType]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {(doc.size / 1024).toFixed(2)} KB
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(doc.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Analysis Results */}
                {latestAnalysis && (
                    <>
                        {/* AI Summary */}
                        <div className="card mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Underwriting Summary</h2>
                            <div className="bg-gray-50 rounded-lg p-6">
                                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                    {latestAnalysis.aiSummary}
                                </p>
                            </div>
                        </div>

                        {/* Rule Results Table */}
                        <div className="card">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rule Evaluation Results</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rule
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Severity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Comment
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {latestAnalysis.ruleResults?.findings?.map((finding: any, index: number) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {finding.rule.replace(/_/g, ' ')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`badge ${finding.status === 'PASS' ? 'bg-green-100 text-green-800' :
                                                            finding.status === 'FAIL' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {finding.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`badge ${finding.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                                                            finding.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                                                                finding.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {finding.severity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {finding.message}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* No Analysis Message */}
                {!latestAnalysis && documents.length > 0 && (
                    <div className="card text-center py-12">
                        <p className="text-gray-500 text-lg mb-4">
                            No analysis has been run yet. Upload all required documents and click "Run AI Analysis".
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
