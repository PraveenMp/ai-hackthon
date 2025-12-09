import { DocumentType } from '@prisma/client';
import { openaiClient } from '../utils/openaiClient.js';
import { AI_PROMPTS } from '../config/prompts.js';
import { maskAadhaar, maskPAN } from '../utils/encryption.js';
import type {
    SalarySlipData,
    BankStatementData,
    PanData,
    AadhaarData,
} from '../types/index.js';

export async function extractSalarySlipData(text: string): Promise<SalarySlipData | null> {
    try {
        const response = await openaiClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: AI_PROMPTS.SALARY_SLIP_EXTRACTION
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            temperature: 0.1,
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0]?.message?.content;
        if (!content) return null;

        const data = JSON.parse(content);
        return data as SalarySlipData;
    } catch (error) {
        console.error('Salary slip extraction error:', error);
        return null;
    }
}

export async function extractBankStatementData(text: string): Promise<BankStatementData | null> {
    try {
        const response = await openaiClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: AI_PROMPTS.BANK_STATEMENT_EXTRACTION
                },
                {
                    role: 'user',
                    content: text.substring(0, 12000) // Limit text size
                }
            ],
            temperature: 0.1,
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0]?.message?.content;
        if (!content) return null;

        const data = JSON.parse(content);
        return data as BankStatementData;
    } catch (error) {
        console.error('Bank statement extraction error:', error);
        return null;
    }
}

export async function extractPANData(text: string): Promise<PanData | null> {
    try {
        const response = await openaiClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: AI_PROMPTS.PAN_EXTRACTION
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            temperature: 0.1,
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0]?.message?.content;
        if (!content) return null;

        const data = JSON.parse(content) as PanData;

        // Mask PAN before storing
        if (data.panNumber) {
            console.log('Original PAN:', data.panNumber);
            console.log('Masked PAN:', maskPAN(data.panNumber));
        }

        return data;
    } catch (error) {
        console.error('PAN extraction error:', error);
        return null;
    }
}

export async function extractAadhaarData(text: string): Promise<AadhaarData | null> {
    try {
        const response = await openaiClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: AI_PROMPTS.AADHAAR_EXTRACTION
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            temperature: 0.1,
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0]?.message?.content;
        if (!content) return null;

        const data = JSON.parse(content) as AadhaarData;

        // Mask Aadhaar before storing
        if (data.aadhaarNumber) {
            console.log('Original Aadhaar:', data.aadhaarNumber);
            console.log('Masked Aadhaar:', maskAadhaar(data.aadhaarNumber));
        }

        return data;
    } catch (error) {
        console.error('Aadhaar extraction error:', error);
        return null;
    }
}

export async function extractDocumentData(
    text: string,
    documentType: DocumentType
): Promise<any> {
    switch (documentType) {
        case 'SALARY_SLIP':
            return await extractSalarySlipData(text);
        case 'BANK_STATEMENT':
            return await extractBankStatementData(text);
        case 'PAN':
            return await extractPANData(text);
        case 'AADHAAR':
            return await extractAadhaarData(text);
        default:
            return null;
    }
}
