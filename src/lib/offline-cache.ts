/**
 * Utility para manejar cacheo offline de datos usando IndexedDB
 */

const DB_NAME = 'jujuy25-offline-cache';
const DB_VERSION = 2; // Incrementar versión para forzar actualización
const STORE_NAME = 'sheets-data';

interface CachedData {
  url: string;
  data: string;
  timestamp: number;
}

let dbInstance: IDBDatabase | null = null;

/**
 * Normaliza la URL eliminando parámetros de cache busting (t=timestamp)
 * para que siempre se use la misma clave en el cache
 */
function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Eliminar parámetros de cache busting
    urlObj.searchParams.delete('t');
    urlObj.searchParams.delete('_');
    urlObj.searchParams.delete('cache');
    urlObj.searchParams.delete('timestamp');
    return urlObj.toString();
  } catch {
    // Si no es una URL válida, intentar eliminar manualmente
    return url
      .replace(/[&?]t=\d+/g, '')
      .replace(/[&?]_=\d+/g, '')
      .replace(/[&?]cache=\d+/g, '')
      .replace(/[&?]timestamp=\d+/g, '');
  }
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'url' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

/**
 * Guarda datos en el cache offline
 * Normaliza la URL para que siempre se use la misma clave
 */
export async function saveToCache(url: string, data: string): Promise<void> {
  try {
    const normalizedUrl = normalizeUrl(url);
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const cachedData: CachedData = {
      url: normalizedUrl,
      data,
      timestamp: Date.now(),
    };
    
    store.put(cachedData);
    console.log('💾 Datos guardados en cache para:', normalizedUrl.substring(0, 80) + '...');
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
}

/**
 * Obtiene datos del cache offline
 * Normaliza la URL para buscar con la misma clave con que se guardó
 */
export async function getFromCache(url: string): Promise<string | null> {
  try {
    const normalizedUrl = normalizeUrl(url);
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.get(normalizedUrl);
    
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const result = request.result as CachedData | undefined;
        if (result) {
          // Verificar que el cache no sea muy viejo (máximo 7 días)
          const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días en ms
          const age = Date.now() - result.timestamp;
          
          if (age < maxAge) {
            console.log('📦 Datos recuperados del cache para:', normalizedUrl.substring(0, 80) + '...');
            resolve(result.data);
          } else {
            // Cache expirado, eliminarlo
            console.log('⏰ Cache expirado para:', normalizedUrl.substring(0, 80) + '...');
            deleteFromCache(normalizedUrl);
            resolve(null);
          }
        } else {
          console.log('❌ No hay datos en cache para:', normalizedUrl.substring(0, 80) + '...');
          resolve(null);
        }
      };
      
      request.onerror = () => resolve(null);
    });
  } catch (error) {
    console.error('Error getting from cache:', error);
    return null;
  }
}

/**
 * Elimina datos del cache
 */
export async function deleteFromCache(url: string): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    await store.delete(url);
  } catch (error) {
    console.error('Error deleting from cache:', error);
  }
}

/**
 * Verifica si hay conexión a internet
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

/**
 * Obtiene datos con fallback a cache offline
 */
export async function fetchWithOfflineFallback(
  url: string,
  options?: RequestInit
): Promise<string> {
  // Si hay conexión, intentar fetch y cachear
  if (isOnline()) {
    try {
      const response = await fetch(url, {
        ...options,
        cache: 'no-cache',
      });
      
      if (response.ok) {
        const data = await response.text();
        // Cachear la respuesta
        await saveToCache(url, data);
        return data;
      } else {
        // Si falla pero hay conexión, intentar cache
        const cached = await getFromCache(url);
        if (cached) {
          console.warn('Network request failed, using cached data');
          return cached;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // Error de red, intentar cache
      console.warn('Network error, trying cache:', error);
      const cached = await getFromCache(url);
      if (cached) {
        return cached;
      }
      throw error;
    }
  } else {
    // Sin conexión, usar cache
    const cached = await getFromCache(url);
    if (cached) {
      console.log('Offline mode: using cached data');
      return cached;
    }
    throw new Error('No internet connection and no cached data available');
  }
}

/**
 * Limpia el cache expirado (más de 7 días)
 */
export async function cleanExpiredCache(): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('timestamp');
    
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días
    const cutoff = Date.now() - maxAge;
    
    const range = IDBKeyRange.upperBound(cutoff);
    const request = index.openCursor(range);
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  } catch (error) {
    console.error('Error cleaning expired cache:', error);
  }
}

