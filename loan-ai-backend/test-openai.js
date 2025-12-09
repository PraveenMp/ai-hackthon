import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

console.log('API Key exists:', !!apiKey);
console.log('API Key starts with sk-:', apiKey?.startsWith('sk-'));
console.log('API Key length:', apiKey?.length);

if (!apiKey) {
    console.error('❌ OPENAI_API_KEY is not set!');
    process.exit(1);
}

const client = new OpenAI({ apiKey });

async function testAPI() {
    try {
        console.log('\n🧪 Testing OpenAI API connection...\n');

        const response = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'user', content: 'Say "API connection successful!"' }
            ],
            max_tokens: 20,
        });

        console.log('✅ SUCCESS!');
        console.log('Response:', response.choices[0]?.message?.content);
    } catch (error: any) {
        console.error('❌ FAILED!');
        console.error('Error:', error.message);
        if (error.status) {
            console.error('Status:', error.status);
        }
        if (error.code) {
            console.error('Code:', error.code);
        }
    }
}

testAPI();
