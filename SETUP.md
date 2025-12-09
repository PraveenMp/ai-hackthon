# 🚀 Quick Setup Guide

## Step 1: Backend Setup

### 1.1 Install Dependencies
```bash
cd loan-ai-backend
npm install
```

### 1.2 Configure Environment
Create a `.env` file in `loan-ai-backend/` with:
```env
PORT=3001
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=my-super-secret-jwt-key-change-in-production
ENCRYPTION_KEY=my-32-char-encryption-key-here
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
CORS_ORIGIN=http://localhost:5173
```

**IMPORTANT**: Replace `your_openai_api_key_here` with your actual OpenAI API key!

### 1.3 Setup Database
```bash
npm run prisma:generate
npm run prisma:migrate
```

When prompted for migration name, enter: `init`

### 1.4 Start Backend Server
```bash
npm run dev
```

✅ Backend should be running on `http://localhost:3001`

Test it: Open `http://localhost:3001/health` in your browser

---

## Step 2: Frontend Setup

### 2.1 Install Dependencies
```bash
cd loan-ai-frontend
npm install
```

### 2.2 Start Frontend Server
```bash
npm run dev
```

✅ Frontend should be running on `http://localhost:5173`

---

## Step 3: Test the Application

1. Open `http://localhost:5173` in your browser
2. Click "+ New Applicant"
3. Enter applicant details (name, email, phone)
4. Click on the applicant card
5. Upload sample documents (PDFs or images):
   - Salary slips
   - Bank statement
   - PAN card
   - Aadhaar card
6. Click "🤖 Run AI Analysis"
7. View the results:
   - Risk score and level
   - AI underwriting summary
   - Rule evaluation results

---

## 📋 Troubleshooting

### Backend won't start
- Check if `.env` file exists with valid `OPENAI_API_KEY`
- Run `npm run prisma:generate` again
- Delete `prisma/dev.db` and run `npm run prisma:migrate` again

### Frontend won't start
- Make sure backend is running first
- Check if port 5173 is available
- Clear npm cache: `npm cache clean --force`

### Upload fails
- Check if `uploads/` directory exists in backend
- Verify file size is under 10MB
- Only PDF and image files (PNG, JPG, JPEG) are allowed

### Analysis fails
- Verify OpenAI API key is valid
- Check backend console for error messages
- Ensure at least one document is uploaded

---

## 🎯 Sample Test Data

### Create Test Applicant
- Name: Rajesh Kumar
- Email: rajesh.kumar@example.com
- Phone: +91 9876543210

### Upload Sample Documents
You can create sample PDFs with:
- **Salary Slip**: Employee name, company name, month, net salary ₹50,000
- **Bank Statement**: Monthly salary credits, EMI debits, no bounces
- **PAN Card**: PAN number ABCDE1234F, name
- **Aadhaar**: 12-digit number, name, address

---

## 🔑 Getting OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create new secret key
5. Copy and paste into `.env` file

---

## ✅ Success Indicators

Backend is working when you see:
```
🚀 Loan AI Backend running on port 3001
📝 Environment: development
🔗 CORS enabled for: http://localhost:5173
```

Frontend is working when you see:
```
VITE v6.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

---

## 📞 Need Help?

Check the detailed READMEs:
- [Main README](./README.md)
- [Backend README](./loan-ai-backend/README.md)
- [Frontend README](./loan-ai-frontend/README.md)
