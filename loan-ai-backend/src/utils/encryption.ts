import CryptoJS from 'crypto-js';
import { config } from '../config/env.js';

export function encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, config.encryptionKey).toString();
}

export function decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, config.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export function maskAadhaar(aadhaar: string): string {
    // Mask middle 8 digits: XXXX XXXX 1234
    if (aadhaar.length === 12) {
        return `XXXX XXXX ${aadhaar.slice(-4)}`;
    }
    return aadhaar.replace(/\d(?=\d{4})/g, 'X');
}

export function maskPAN(pan: string): string {
    // Mask middle characters: AB***E1234F
    if (pan.length === 10) {
        return `${pan.slice(0, 2)}***${pan.slice(-5)}`;
    }
    return pan;
}
