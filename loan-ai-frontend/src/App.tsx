import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ApplicantList from './pages/ApplicantList';
import ApplicantDetail from './pages/ApplicantDetail';
import './index.css';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold text-primary-600">🏦 Loan AI</h1>
                                <span className="ml-3 text-sm text-gray-500">
                                    AI-Powered Loan Underwriting Assistant
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<ApplicantList />} />
                    <Route path="/applicant/:id" element={<ApplicantDetail />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
