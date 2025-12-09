# Loan AI Backend

AI-powered Indian Bank Loan Document Review & Underwriting Assistant - Backend API

## 🚀 Features

- **AI Document Classification**: Automatically detect document types (Salary Slip, Bank Statement, PAN, Aadhaar, etc.)
- **Data Extraction**: Extract structured financial data using OpenAI GPT-4
- **Rule Engine**: Apply loan eligibility rules (FOIR, minimum salary, bounces, etc.)
- **AI Underwriting Summary**: Generate professional loan assessment summaries
- **Security**: Encrypt sensitive data (Aadhaar, PAN), mask PII before sending to AI
- **RESTful API**: Clean API endpoints for frontend integration

## 📋 Prerequisites

- Node.js 18+ and npm
- OpenAI API Key

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   JWT_SECRET=your_jwt_secret_here
   ENCRYPTION_KEY=your_32_character_encryption_key
   ```

3. **Setup database:**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:3001`

## 📁 Project Structure

```
src/
├── config/
│   ├── env.ts              # Environment configuration
│   └── prompts.ts          # AI prompts & business rules
├── controllers/
│   ├── applicant.controller.ts
│   ├── upload.controller.ts
│   └── analysis.controller.ts
├── routes/
│   ├── applicant.routes.ts
│   ├── upload.routes.ts
│   └── analysis.routes.ts
├── services/
│   ├── classification.service.ts  # AI document classification
│   ├── extraction.service.ts      # Data extraction
│   ├── rules.service.ts           # Business rules engine
│   └── summary.service.ts         # AI summary generation
├── utils/
│   ├── pdf.ts              # PDF text extraction
│   ├── ocr.ts              # OCR for images
│   ├── encryption.ts       # Data encryption/masking
│   ├── jwt.ts              # JWT utilities
│   └── openaiClient.ts     # OpenAI client
├── types/
│   └── index.ts            # TypeScript types
└── index.ts                # App entry point
```

## 🔌 API Endpoints

### Applicants
- `POST /api/applicant` - Create new applicant
- `GET /api/applicant` - Get all applicants
- `GET /api/applicant/:id` - Get applicant by ID
- `DELETE /api/applicant/:id` - Delete applicant

### Documents
- `POST /api/upload` - Upload document (with auto-classification)
- `GET /api/upload/applicant/:applicantId` - Get documents by applicant
- `DELETE /api/upload/:id` - Delete document

### Analysis
- `POST /api/analysis/run` - Run AI analysis
- `GET /api/analysis/applicant/:applicantId` - Get analyses by applicant
- `GET /api/analysis/:id` - Get analysis by ID

## 🤖 AI Features

### Document Classification
Automatically classifies documents into:
- Salary Slip
- Bank Statement
- PAN Card
- Aadhaar Card
- Form 16
- Address Proof
- Office ID Card

### Data Extraction
Extracts structured data:
- **Salary Slips**: Employee name, employer, month, net/gross salary, PF
- **Bank Statements**: Salary credits, EMI debits, bounces, averages
- **PAN/Aadhaar**: Identity information (encrypted)

### Business Rules
- **FOIR Check**: EMI/Income ratio ≤ 50%
- **Minimum Salary**: ≥ ₹25,000
- **Bounce Check**: No bounces in 6 months
- **Salary Stability**: 6 months history recommended

### Risk Scoring
- **0-30**: Low Risk
- **31-60**: Medium Risk
- **61-100**: High Risk

## 🔒 Security

- Aadhaar and PAN numbers are encrypted in database
- PII is masked before sending to OpenAI
- JWT authentication ready
- CORS protection

## 📦 Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: SQLite + Prisma ORM
- **AI**: OpenAI GPT-4o-mini
- **File Processing**: Multer, pdf-parse, Tesseract.js
- **Security**: crypto-js, jsonwebtoken

## 🧪 Testing

Test the API:
```bash
# Health check
curl http://localhost:3001/health

# Create applicant
curl -X POST http://localhost:3001/api/applicant \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

## 📝 License

ISC
