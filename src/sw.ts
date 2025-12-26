import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist, NetworkFirst, CacheFirst } from 'serwist';

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
    // Esto asegura que los datos se actualicen cuando hay conexión, pero funcionen offline
    {
      matcher: ({ url }) => {
        return url.href.includes('docs.google.com/spreadsheets') || 
               url.href.includes('drive.google.com') ||
               url.href.includes('googleusercontent.com') ||
               url.href.includes('/api/');
      },
      handler: new NetworkFirst({
        cacheName: 'google-sheets-cache',
        networkTimeoutSeconds: 10,
      }),
    },
    // Mantener el cache por defecto para otros recursos
    ...defaultCache,
  ],
});

serwist.addEventListeners();

