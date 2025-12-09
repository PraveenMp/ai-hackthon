export type DocumentType =
    | 'UNKNOWN'
    | 'SALARY_SLIP'
    | 'BANK_STATEMENT'
    | 'AADHAAR'
    | 'PAN'
    | 'ADDRESS_PROOF'
    | 'FORM_16'
    | 'OFFICE_ID';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type RuleStatus = 'PASS' | 'FAIL' | 'WARNING';

export type RuleSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Applicant {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
    documents?: Document[];
    analyses?: Analysis[];
}

export interface Document {
    id: string;
    applicantId: string;
    originalName: string;
    fileName: string;
    filePath: string;
    mimeType: string;
    size: number;
    documentType: DocumentType;
    extractedText?: string;
    classifiedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface RuleFinding {
    rule: string;
    status: RuleStatus;
    severity: RuleSeverity;
    message: string;
    value?: any;
}

export interface RuleEngineResult {
    riskScore: number;
    riskLevel: RiskLevel;
    findings: RuleFinding[];
}

export interface Analysis {
    id: string;
    applicantId: string;
    extractedData: any;
    ruleResults: RuleEngineResult;
    riskScore: number;
    riskLevel: RiskLevel;
    aiSummary: string;
    createdAt: string;
    updatedAt?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
