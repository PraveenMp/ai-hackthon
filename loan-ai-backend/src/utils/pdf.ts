import pdf from 'pdf-parse';
import fs from 'fs/promises';

export async function extractTextFromPDF(filePath: string): Promise<string> {
    try {
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdf(dataBuffer);
        return data.text;
    } catch (error) {
        console.error('PDF extraction error:', error);
        throw new Error('Failed to extract text from PDF');
    }
}
