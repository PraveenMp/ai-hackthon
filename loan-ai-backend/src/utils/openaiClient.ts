import OpenAI from 'openai';
import { config } from '../config/env.js';

export const openaiClient = new OpenAI({
    apiKey: config.openaiApiKey,
});
