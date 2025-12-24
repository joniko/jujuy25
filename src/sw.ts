import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Cachear Google Sheets con estrategia NetworkFirst (intenta red primero, luego cache)
    {
      matcher: ({ url }) => {
        return url.href.includes('docs.google.com/spreadsheets') || 
               url.href.includes('drive.google.com') ||
               url.href.includes('googleusercontent.com');
      },
      handler: {
        handle: async ({ request }) => {
          const cache = await caches.open('google-sheets-cache');
          try {
            // Intentar fetch primero
            const response = await fetch(request);
            if (response && response.status === 200) {
              // Cachear respuesta exitosa
              await cache.put(request, response.clone());
              return response;
            }
            // Si falla, intentar cache
            const cachedResponse = await cache.match(request);
            if (cachedResponse) {
              return cachedResponse;
            }
            throw new Error('No response available');
          } catch (error) {
            // Si falla el fetch, usar cache
            const cachedResponse = await cache.match(request);
            if (cachedResponse) {
              return cachedResponse;
            }
            throw error;
          }
        },
      },
    },
    // Mantener el cache por defecto para otros recursos
    ...defaultCache,
  ],
});

serwist.addEventListeners();

