import { openDB, IDBPDatabase } from 'idb';
import { Session } from '../types';
import { encryptData, decryptData } from './encryption';

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
    const dataToSave = key ? await encryptData(session, key) : session;
    await db.put(STORE_NAME, dataToSave);
}

export async function getSessions(key: string | null): Promise<Session[]> {
    const db = await getDB();
    const allData = await db.getAll(STORE_NAME);
    
    if (!key) return allData as Session[];

    const decryptedSessions: Session[] = [];
    for (const item of allData) {
        try {
            const decrypted = await decryptData(item, key);
            decryptedSessions.push(decrypted);
        } catch (e) {
            console.warn('Failed to decrypt session', item.id);
        }
    }
    return decryptedSessions;
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
    
    for (const session of sessions) {
        const dataToSave = key ? await encryptData(session, key) : session;
        await store.put(dataToSave);
    }
    await tx.done;
}

export async function getStorageUsage(key: string | null = null): Promise<number> {
    // Rough estimate
    const sessions = await getSessions(key);
    const json = JSON.stringify(sessions);
    return new Blob([json]).size;
}
