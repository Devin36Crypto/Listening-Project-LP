import { openDB, IDBPDatabase } from 'idb';
import { Session } from '../types';
import { encryptData, decryptData, deriveKeyFromPassword, encryptWithKey, decryptWithKey } from './encryption';

const DB_NAME = 'ListeningProjectDB';
const STORE_NAME = 'sessions';

async function getDB(): Promise<IDBPDatabase> {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        },
    });
}

export async function saveSession(session: Session, key: string | null): Promise<void> {
    const db = await getDB();
    let dataToSave: any = session;
    if (key) {
        dataToSave = await encryptData(session, key);
    }
    await db.put(STORE_NAME, dataToSave);
}

export async function getSessions(key: string | null): Promise<Session[]> {
    const db = await getDB();
    const allData = await db.getAll(STORE_NAME);
    
    if (!key) return allData as Session[];

    try {
        const cryptoKey = await deriveKeyFromPassword(key);
        
        const decryptedSessions = await Promise.all(
            allData.map(async (item) => {
                try {
                    return await decryptWithKey(item, cryptoKey);
                } catch (e) {
                    console.warn('Failed to decrypt session', item.id);
                    return null;
                }
            })
        );

        return decryptedSessions.filter((s): s is Session => s !== null);
    } catch (e) {
        console.error("Error deriving key or decrypting sessions", e);
        return [];
    }
}

export async function deleteSession(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
}

export async function clearAllSessions(): Promise<void> {
    const db = await getDB();
    await db.clear(STORE_NAME);
}

export async function importSessions(sessions: Session[], key: string | null): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    let cryptoKey: CryptoKey | null = null;
    if (key) {
        cryptoKey = await deriveKeyFromPassword(key);
    }
    
    for (const session of sessions) {
        let dataToSave: any = session;
        if (cryptoKey) {
            dataToSave = await encryptWithKey(session, cryptoKey);
        }
        await store.put(dataToSave);
    }
    await tx.done;
}

export async function getStorageUsage(key: string | null = null): Promise<number> {
    try {
        if (navigator.storage && navigator.storage.estimate) {
            const estimate = await navigator.storage.estimate();
            return estimate.usage || 0;
        }
    } catch (e) {
        console.warn('Navigator storage estimate failed, falling back to JSON size', e);
    }
    
    // Fallback: Rough estimate based on JSON size
    const sessions = await getSessions(key);
    const json = JSON.stringify(sessions);
    return new Blob([json]).size;
}
