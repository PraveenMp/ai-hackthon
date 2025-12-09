import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicantAPI } from '../api/client';
import type { Applicant } from '../types';

export default function ApplicantList() {
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {
        try {
            const response = await applicantAPI.getAll();
            setApplicants(response.data.data);
        } catch (error) {
            console.error('Error fetching applicants:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await applicantAPI.create(formData);
            setShowModal(false);
            setFormData({ name: '', email: '', phone: '' });
            fetchApplicants();
        } catch (error) {
            console.error('Error creating applicant:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this applicant?')) return;

        try {
            await applicantAPI.delete(id);
            fetchApplicants();
        } catch (error) {
            console.error('Error deleting applicant:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Loan Applicants</h1>
                        <p className="mt-2 text-gray-600">Manage and review loan applications</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        + New Applicant
                    </button>
                </div>

                {/* Applicants Grid */}
                {applicants.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-500 text-lg">No applicants yet. Create your first applicant to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applicants.map((applicant) => {
                            const latestAnalysis = applicant.analyses?.[0];

                            return (
                                <div key={applicant.id} className="card hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{applicant.name}</h3>
                                            {applicant.email && (
                                                <p className="text-sm text-gray-600 mt-1">{applicant.email}</p>
                                            )}
                                            {applicant.phone && (
                                                <p className="text-sm text-gray-600">{applicant.phone}</p>
                                            )}
                                        </div>
                                        {latestAnalysis && (
                                            <span className={`badge badge-${latestAnalysis.riskLevel.toLowerCase()}`}>
                                                {latestAnalysis.riskLevel}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Documents:</span>
                                            <span className="font-medium">{applicant.documents?.length || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Analyses:</span>
                                            <span className="font-medium">{applicant.analyses?.length || 0}</span>
                                        </div>
                                        {latestAnalysis && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Risk Score:</span>
                                                <span className="font-medium">{latestAnalysis.riskScore}/100</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            to={`/applicant/${applicant.id}`}
                                            className="flex-1 btn-primary text-center"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(applicant.id)}
                                            className="btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Create Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h2 className="text-2xl font-bold mb-4">Create New Applicant</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="input"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        className="input"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <button type="submit" className="flex-1 btn-primary">
                                        Create
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
