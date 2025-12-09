import { DocumentType } from '@prisma/client';
import { openaiClient } from '../utils/openaiClient.js';
import { AI_PROMPTS } from '../config/prompts.js';

export async function classifyDocument(text: string): Promise<DocumentType> {
    try {
        const response = await openaiClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: AI_PROMPTS.DOCUMENT_CLASSIFICATION
                },
                {
                    role: 'user',
                    content: `Classify this document:\n\n${text.substring(0, 3000)}`
                }
            ],
            temperature: 0.1,
            max_tokens: 20,
        });

        const classification = response.choices[0]?.message?.content?.trim().toUpperCase() || 'UNKNOWN';

        // Map to DocumentType enum
        const validTypes: DocumentType[] = [
            'SALARY_SLIP',
            'BANK_STATEMENT',
            'PAN',
            'AADHAAR',
            'FORM_16',
            'ADDRESS_PROOF',
            'OFFICE_ID',
            'UNKNOWN'
        ];

        if (validTypes.includes(classification as DocumentType)) {
            return classification as DocumentType;
        }

        return 'UNKNOWN';
    } catch (error) {
        console.error('Document classification error:', error);
        return 'UNKNOWN';
    }
}
