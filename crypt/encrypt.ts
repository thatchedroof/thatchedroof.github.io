//ChatGPT
import { Base64 } from 'js-base64';
import * as webcrypto from 'crypto';

async function encryptData(content: string, secretKey: Uint8Array) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    console.log(data);

    const key = await webcrypto.subtle.importKey(
        'raw',
        secretKey,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );

    const iv = webcrypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await webcrypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
    );

    return { iv, encryptedData: new Uint8Array(encryptedData) };
}

// Use this to encrypt your content offline
const secretKey = webcrypto.getRandomValues(new Uint8Array(16));
console.log(secretKey);
encryptData('Your website content here', secretKey)
    .then((encryptedContent) => {
        console.log(JSON.stringify(encryptedContent));
        console.log(Base64.fromUint8Array(secretKey, true));
        console.log(Base64.fromUint8Array(encryptedContent.iv, true));
        console.log(Base64.fromUint8Array(encryptedContent.encryptedData, true)); // No
    })
    .catch((error) => {
        console.error(error);
    });
