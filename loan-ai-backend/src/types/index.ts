import { DocumentType, RiskLevel } from '@prisma/client';

// Extracted Data Types
export interface SalarySlipData {
    employeeName: string;
    employerName: string;
    month: string;
    netSalary: number;
    grossSalary: number | null;
    pf: number | null;
}

export interface BankTransaction {
    date: string;
    amount: number;
    description: string;
}

export interface BankStatementData {
    salaryCredits: BankTransaction[];
    emiDebits: BankTransaction[];
    bounces: BankTransaction[];
    summary: {
        avgNetMonthlyIncome: number;
        avgMonthlyEmi: number;
    };
}

export interface PanData {
    panNumber: string;
    name: string;
}

export interface AadhaarData {
    aadhaarNumber: string;
    name: string;
    address: string;
}

export interface ExtractedDataMap {
    salarySlips: SalarySlipData[];
    bankStatement: BankStatementData | null;
    pan: PanData | null;
    aadhaar: AadhaarData | null;
    form16: any | null;
    addressProof: any | null;
    officeId: any | null;
}

// Rule Engine Types
export type RuleStatus = 'PASS' | 'FAIL' | 'WARNING';
export type RuleSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface RuleFinding {
    rule: string;
    status: RuleStatus;
    severity: RuleSeverity;
    message: string;
    value?: any;
}

export interface RuleEngineResult {
    riskScore: number; // 0-100
    riskLevel: RiskLevel;
    findings: RuleFinding[];
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface AnalysisResponse {
    id: string;
    applicantId: string;
    extractedData: ExtractedDataMap;
    ruleResults: RuleEngineResult;
    riskScore: number;
    riskLevel: RiskLevel;
    aiSummary: string;
    createdAt: Date;
}
