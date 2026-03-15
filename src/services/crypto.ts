// Military-grade encryption service using Web Crypto API (AES-GCM 256-bit)

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;

// Generate a secure random key for the session
// In a real app, this might be derived from a user password or managed via a key management system
let sessionKey: CryptoKey | null = null;

export async function initSessionKey(): Promise<CryptoKey> {
  if (sessionKey) return sessionKey;
  
  sessionKey = await window.crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true,
    ["encrypt", "decrypt"]
  );
  return sessionKey;
}

// Encrypt text data
export async function encryptData(text: string): Promise<{ cipherText: string; iv: string }> {
  const key = await initSessionKey();
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Generate a random initialization vector (IV)
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv,
    },
    key,
    data
  );

  // Convert buffers to base64 for storage
  const cipherText = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
  const ivString = btoa(String.fromCharCode(...iv));

  return { cipherText, iv: ivString };
}

// Decrypt text data
export async function decryptData(cipherText: string, ivString: string): Promise<string> {
  const key = await initSessionKey();
  const decoder = new TextDecoder();
  
  // Convert base64 back to buffers
  const encryptedData = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(ivString), c => c.charCodeAt(0));
  
  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      encryptedData
    );
    
    return decoder.decode(decryptedBuffer);
  } catch (e) {
    console.error("Decryption failed:", e);
    throw new Error("Failed to decrypt data. Integrity check failed.");
  }
}

// Secure Storage Wrapper
export const SecureStorage = {
  async setItem(key: string, value: any) {
    const jsonString = JSON.stringify(value);
    const { cipherText, iv } = await encryptData(jsonString);
    sessionStorage.setItem(key, JSON.stringify({ cipherText, iv }));
  },

  async getItem(key: string) {
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    
    try {
      const { cipherText, iv } = JSON.parse(item);
      const jsonString = await decryptData(cipherText, iv);
      return JSON.parse(jsonString);
    } catch (e) {
      console.warn("Could not decrypt item from storage", e);
      return null;
    }
  },

  removeItem(key: string) {
    sessionStorage.removeItem(key);
  }
};
