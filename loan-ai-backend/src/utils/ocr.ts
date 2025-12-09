import Tesseract from 'tesseract.js';

export async function performOCR(imagePath: string): Promise<string> {
    try {
        const { data: { text } } = await Tesseract.recognize(
            imagePath,
            'eng',
            {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
                    }
                }
            }
        );

        return text;
    } catch (error) {
        console.error('OCR error:', error);
        throw new Error('Failed to perform OCR on image');
    }
}
