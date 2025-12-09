// AI Prompts for Document Processing

export const AI_PROMPTS = {
    DOCUMENT_CLASSIFICATION: `You are a document classifier for Indian loan processing. Given document text, classify strictly into one of these categories:
- SALARY_SLIP
- BANK_STATEMENT
- PAN
- AADHAAR
- FORM_16
- ADDRESS_PROOF
- OFFICE_ID
- UNKNOWN

Return ONLY one label from the above list. No explanation needed.`,

    SALARY_SLIP_EXTRACTION: `Extract salary information from this Indian salary slip and return ONLY a valid JSON object with this exact structure:
{
  "employeeName": "string",
  "employerName": "string",
  "month": "string (format: YYYY-MM or MMM YYYY)",
  "netSalary": number,
  "grossSalary": number or null,
  "pf": number or null
}

If any field is not found, use null for numbers or empty string for text. Ensure all amounts are numbers without currency symbols.`,

    BANK_STATEMENT_EXTRACTION: `Extract financial transactions from this Indian bank statement and return ONLY a valid JSON object with this exact structure:
{
  "salaryCredits": [
    {
      "date": "YYYY-MM-DD",
      "amount": number,
      "description": "string"
    }
  ],
  "emiDebits": [
    {
      "date": "YYYY-MM-DD",
      "amount": number,
      "description": "string"
    }
  ],
  "bounces": [
    {
      "date": "YYYY-MM-DD",
      "description": "string"
    }
  ],
  "summary": {
    "avgNetMonthlyIncome": number,
    "avgMonthlyEmi": number
  }
}

Identify salary credits by looking for keywords like "SALARY", "SAL", "CREDIT", "NEFT", "IMPS" with regular monthly patterns.
Identify EMI debits by looking for keywords like "EMI", "LOAN", "INSTALLMENT", "REPAYMENT".
Identify bounces by looking for "BOUNCE", "RETURN", "DISHONOUR", "INSUFFICIENT FUNDS".`,

    PAN_EXTRACTION: `Extract PAN card information and return ONLY a valid JSON object:
{
  "panNumber": "string (10 characters)",
  "name": "string"
}

PAN format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)`,

    AADHAAR_EXTRACTION: `Extract Aadhaar card information and return ONLY a valid JSON object:
{
  "aadhaarNumber": "string (12 digits)",
  "name": "string",
  "address": "string"
}

Aadhaar is a 12-digit number. Extract the complete address if available.`,

    UNDERWRITING_SUMMARY: `You are a professional loan underwriting assistant for an Indian bank. Using the provided applicant data and rule evaluation results, generate a comprehensive loan underwriting summary for a bank officer.

Include:
1. Overall Risk Assessment (LOW/MEDIUM/HIGH)
2. Key Financial Metrics:
   - Average monthly income
   - Total monthly EMI obligations
   - FOIR (Fixed Obligation to Income Ratio)
3. Document Verification Status
4. Red Flags or Concerns (if any):
   - Cheque bounces
   - High FOIR
   - Irregular income
   - Missing documents
5. Recommendation (Approve/Review/Reject with reasoning)

Provide a clear, professional summary in 150-250 words that a bank officer can quickly understand.`,
};

// Rule Engine Constants
export const LOAN_RULES = {
    MAX_FOIR: 0.5, // 50% - Maximum Fixed Obligation to Income Ratio
    MIN_NET_SALARY: 25000, // ₹25,000 minimum monthly salary
    MIN_SALARY_MONTHS: 6, // Minimum 6 months salary history
    MAX_BOUNCES_ALLOWED: 0, // No bounces allowed in last 6 months
};

// Risk Score Thresholds
export const RISK_THRESHOLDS = {
    LOW: 30, // 0-30: Low risk
    MEDIUM: 60, // 31-60: Medium risk
    HIGH: 100, // 61-100: High risk
};
