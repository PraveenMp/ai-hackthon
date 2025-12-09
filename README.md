# 🏦 Loan AI - Indian Bank Loan Underwriting Assistant

A production-grade AI-powered system for automating loan document review and underwriting for Indian banks.

## 🎯 Overview

This system automates the manual loan document review process using AI. It can:
- Auto-detect document types (Salary Slips, Bank Statements, PAN, Aadhaar, etc.)
- Extract structured financial and identity data
- Apply loan eligibility and risk rules
- Generate AI-based underwriting summaries
- Display everything in a clean React + Tailwind UI

## 🏗️ Architecture

```
loan-ai/
├── loan-ai-backend/     # Node.js + Express + TypeScript + Prisma + OpenAI
└── loan-ai-frontend/    # React + Vite + TypeScript + Tailwind CSS v3
```

## ✨ Features

### Backend
- ✅ AI Document Classification (GPT-4o-mini)
- ✅ Structured Data Extraction
- ✅ Business Rules Engine (FOIR, Salary, Bounces)
- ✅ Risk Scoring (0-100)
- ✅ AI Underwriting Summaries
- ✅ PII Encryption (Aadhaar, PAN)
- ✅ Data Masking before AI processing
- ✅ SQLite Database with Prisma ORM
- ✅ RESTful API

### Frontend
- ✅ Applicant Management
- ✅ Document Upload with Auto-Classification
- ✅ AI Analysis Dashboard
- ✅ Risk Level Badges
- ✅ Rule Evaluation Results Table
- ✅ Responsive Design (Tailwind CSS v3)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm
- OpenAI API Key

### 1. Setup Backend

```bash
cd loan-ai-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Setup database
npm run prisma:generate
npm run prisma:migrate

# Start server
npm run dev
```

Backend runs on `http://localhost:3001`

### 2. Setup Frontend

```bash
cd loan-ai-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📚 Documentation

- [Backend README](./loan-ai-backend/README.md) - API documentation, architecture
- [Frontend README](./loan-ai-frontend/README.md) - UI components, usage

## 🎬 Usage Flow

1. **Create Applicant**: Add a new loan applicant with name, email, phone
2. **Upload Documents**: Upload required documents (PDF or images)
   - Salary Slips (last 6 months)
   - Bank Statement (last 12 months)
   - PAN Card
   - Aadhaar Card
   - Address Proof
   - Form 16
   - Office ID Card
3. **Auto-Classification**: Documents are automatically classified using AI
4. **Run Analysis**: Click "Run AI Analysis" to process all documents
5. **Review Results**: View risk score, rule results, and AI summary

## 🤖 AI Capabilities

### Document Classification
Automatically identifies document types with high accuracy.

### Data Extraction
- **Salary Slips**: Employee name, employer, month, net/gross salary, PF
- **Bank Statements**: Salary credits, EMI debits, bounces, monthly averages
- **PAN/Aadhaar**: Identity information (encrypted in database)

### Business Rules
- **FOIR Check**: Fixed Obligation to Income Ratio ≤ 50%
- **Minimum Salary**: ≥ ₹25,000 per month
- **Bounce Check**: No cheque bounces in last 6 months
- **Salary Stability**: 6 months salary history recommended

### Risk Assessment
- **Low Risk (0-30)**: Green badge - Good candidate
- **Medium Risk (31-60)**: Yellow badge - Review required
- **High Risk (61-100)**: Red badge - High risk factors

## 🔒 Security Features

- ✅ Aadhaar and PAN encryption in database
- ✅ PII masking before sending to OpenAI
- ✅ JWT authentication (ready to use)
- ✅ CORS protection
- ✅ File upload validation

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: SQLite + Prisma ORM
- **AI**: OpenAI GPT-4o-mini
- **File Processing**: Multer, pdf-parse, Tesseract.js
- **Security**: crypto-js, jsonwebtoken

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Routing**: React Router v7
- **HTTP Client**: Axios

## 📊 API Endpoints

### Applicants
- `POST /api/applicant` - Create applicant
- `GET /api/applicant` - List all applicants
- `GET /api/applicant/:id` - Get applicant details
- `DELETE /api/applicant/:id` - Delete applicant

### Documents
- `POST /api/upload` - Upload document
- `GET /api/upload/applicant/:applicantId` - Get documents
- `DELETE /api/upload/:id` - Delete document

### Analysis
- `POST /api/analysis/run` - Run AI analysis
- `GET /api/analysis/applicant/:applicantId` - Get analyses
- `GET /api/analysis/:id` - Get analysis details

## 🎯 Hackathon Ready

This project is:
- ✅ Fully functional end-to-end
- ✅ Well-structured and typed
- ✅ Production-grade code quality
- ✅ Ready to demo
- ✅ Easy to extend

## 📝 Environment Variables

### Backend (.env)
```env
PORT=3001
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_32_character_encryption_key
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
CORS_ORIGIN=http://localhost:5173
```

## 🧪 Testing

1. Start both backend and frontend
2. Open `http://localhost:5173`
3. Create a test applicant
4. Upload sample documents
5. Run AI analysis
6. View results

## 📦 Build for Production

### Backend
```bash
cd loan-ai-backend
npm run build
npm start
```

### Frontend
```bash
cd loan-ai-frontend
npm run build
# Serve the dist/ folder
```

## 🤝 Contributing

This is a hackathon MVP. Feel free to extend with:
- More document types
- Additional business rules
- Email notifications
- PDF report generation
- Multi-language support
- Advanced analytics

## 📄 License

ISC

## 🙏 Acknowledgments

Built with:
- OpenAI GPT-4 for AI capabilities
- Prisma for database management
- Tailwind CSS for beautiful UI
- React for frontend framework

---

**Made with ❤️ for Indian Banking Innovation**
