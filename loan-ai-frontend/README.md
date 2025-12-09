# Loan AI Frontend

React + TypeScript + Tailwind CSS frontend for the AI-powered Loan Underwriting Assistant

## 🚀 Features

- **Applicant Management**: Create and manage loan applicants
- **Document Upload**: Upload and auto-classify loan documents
- **AI Analysis Dashboard**: View risk scores, rule results, and AI summaries
- **Responsive Design**: Clean, modern UI with Tailwind CSS v3
- **Real-time Updates**: Instant feedback on document classification

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:3001`

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
src/
├── api/
│   └── client.ts           # Axios API client
├── pages/
│   ├── ApplicantList.tsx   # List all applicants
│   └── ApplicantDetail.tsx # Applicant details & analysis
├── types/
│   └── index.ts            # TypeScript types
├── App.tsx                 # Main app component
├── main.tsx                # Entry point
└── index.css               # Tailwind styles
```

## 🎨 UI Components

### Applicant List Page
- Grid view of all applicants
- Create new applicant modal
- Risk level badges
- Document and analysis counts

### Applicant Detail Page
- Document upload with drag-and-drop
- Auto-detected document types
- Run AI analysis button
- Risk assessment dashboard
- AI underwriting summary
- Rule evaluation results table

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **Success**: Green
- **Warning**: Yellow
- **Danger**: Red

### Risk Badges
- **Low Risk**: Green badge
- **Medium Risk**: Yellow badge
- **High Risk**: Red badge

### Components
- Buttons: Primary, Secondary, Danger
- Cards: White background with shadow
- Tables: Striped rows with hover effects
- Badges: Rounded pills for status

## 📦 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Routing**: React Router v7
- **HTTP Client**: Axios

## 🔌 API Integration

The frontend connects to the backend API at `http://localhost:3001/api`

Endpoints used:
- `/applicant` - Applicant CRUD
- `/upload` - Document upload
- `/analysis` - AI analysis

## 🚀 Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

## 📝 Usage Flow

1. **Create Applicant**: Click "+ New Applicant" and fill in details
2. **Upload Documents**: Click on applicant → Upload required documents
3. **Run Analysis**: Click "Run AI Analysis" after uploading all documents
4. **Review Results**: View risk score, rule results, and AI summary

## 📋 Required Documents

- Salary Slips (last 6 months)
- Bank Statement (last 12 months)
- PAN Card
- Aadhaar Card
- Address Proof
- Form 16
- Office ID Card

## 🎯 Key Features

### Auto-Classification
Documents are automatically classified using AI when uploaded.

### Real-time Feedback
See document type detection immediately after upload.

### Comprehensive Analysis
View detailed breakdown of:
- Financial metrics (FOIR, income, EMI)
- Rule evaluation results
- Risk assessment
- AI-generated summary

## 📝 License

ISC
