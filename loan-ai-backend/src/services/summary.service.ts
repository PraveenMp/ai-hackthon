import { openaiClient } from '../utils/openaiClient.js';
import { AI_PROMPTS } from '../config/prompts.js';
import { maskAadhaar, maskPAN } from '../utils/encryption.js';
import type { ExtractedDataMap, RuleEngineResult } from '../types/index.js';

export async function generateUnderwritingSummary(
    extractedData: ExtractedDataMap,
    ruleResults: RuleEngineResult
): Promise<string> {
    try {
        // Mask sensitive data before sending to AI
        const sanitizedData = {
            ...extractedData,
            pan: extractedData.pan ? {
                ...extractedData.pan,
                panNumber: maskPAN(extractedData.pan.panNumber)
            } : null,
            aadhaar: extractedData.aadhaar ? {
                ...extractedData.aadhaar,
                aadhaarNumber: maskAadhaar(extractedData.aadhaar.aadhaarNumber)
            } : null,
        };

        const dataContext = `
APPLICANT DATA:
${JSON.stringify(sanitizedData, null, 2)}

RULE EVALUATION RESULTS:
Risk Score: ${ruleResults.riskScore}/100
Risk Level: ${ruleResults.riskLevel}

Findings:
${ruleResults.findings.map(f => `- ${f.rule}: ${f.status} (${f.severity}) - ${f.message}`).join('\n')}
`;

        const response = await openaiClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: AI_PROMPTS.UNDERWRITING_SUMMARY
                },
                {
                    role: 'user',
                    content: dataContext
                }
            ],
            temperature: 0.3,
            max_tokens: 500,
        });

        return response.choices[0]?.message?.content || 'Unable to generate summary';
    } catch (error) {
        console.error('Summary generation error:', error);
        return 'Error generating underwriting summary. Please review manually.';
    }
}
