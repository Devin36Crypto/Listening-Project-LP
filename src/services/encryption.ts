export async function encryptData(data: any, keyString: string): Promise<{ id: string; encrypted: string; iv: string }> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(keyString),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    
    const key = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode("salt"), // In production, use random salt
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = enc.encode(JSON.stringify(data));
    
    const encryptedContent = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encodedData
    );

    return {
        id: data.id,
        encrypted: btoa(String.fromCharCode(...new Uint8Array(encryptedContent))),
        iv: btoa(String.fromCharCode(...iv))
    };
}

export async function decryptData(encryptedObj: { encrypted: string; iv: string }, keyString: string): Promise<any> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(keyString),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    
    const key = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode("salt"),
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    const iv = Uint8Array.from(atob(encryptedObj.iv), c => c.charCodeAt(0));
    const encryptedData = Uint8Array.from(atob(encryptedObj.encrypted), c => c.charCodeAt(0));

    const decryptedContent = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encryptedData
    );

    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decryptedContent));
}
