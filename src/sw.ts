import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist, NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'serwist';

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
  // Desactivar navigationPreload - no funciona bien en Safari/iOS PWA
  navigationPreload: false,
  runtimeCaching: [
    // Cachear las páginas de navegación de la app
    // Usa StaleWhileRevalidate: sirve del cache inmediatamente y actualiza en segundo plano
    {
      matcher: ({ request, url }) => {
        // Solo páginas de navegación de nuestro dominio
        return request.mode === 'navigate' && 
               (url.pathname === '/' ||
                url.pathname === '/cronograma' ||
                url.pathname === '/participantes' ||
                url.pathname === '/destinos' ||
                url.pathname === '/proposito' ||
                url.pathname === '/faq' ||
                url.pathname === '/instalar');
      },
      handler: new StaleWhileRevalidate({
        cacheName: 'pages-cache',
      }),
    },
    // Cachear Google Sheets con estrategia NetworkFirst (intenta red primero, luego cache)
    // Esto asegura que los datos se actualicen cuando hay conexión, pero funcionen offline
    {
      matcher: ({ url }) => {
        return url.href.includes('docs.google.com/spreadsheets') || 
               url.href.includes('drive.google.com') ||
               url.href.includes('googleusercontent.com');
      },
      handler: new NetworkFirst({
        cacheName: 'google-sheets-cache',
        networkTimeoutSeconds: 10,
      }),
    },
    // Cachear las APIs internas con NetworkFirst
    {
      matcher: ({ url }) => {
        return url.pathname.startsWith('/api/');
      },
      handler: new NetworkFirst({
        cacheName: 'api-cache',
        networkTimeoutSeconds: 5,
      }),
    },
    // Cachear imágenes con CacheFirst
    {
      matcher: ({ request }) => {
        return request.destination === 'image';
      },
      handler: new CacheFirst({
        cacheName: 'images-cache',
      }),
    },
    // Mantener el cache por defecto para otros recursos (JS, CSS, etc)
    ...defaultCache,
  ],
});

serwist.addEventListeners();

