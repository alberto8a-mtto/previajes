const CACHE_NAME = 'previajes-v3';
const BASE_PATH = '/previajes';
const urlsToCache = [
  BASE_PATH + '/',
  BASE_PATH + '/index.html',
  BASE_PATH + '/styles.css',
  BASE_PATH + '/app.js',
  BASE_PATH + '/manifest.json',
  BASE_PATH + '/icon-192.png',
  BASE_PATH + '/icon-512.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  // Forzar activación inmediata
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Archivos en caché');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Error al cachear archivos:', err);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    Promise.all([
      // Tomar control de todas las páginas inmediatamente
      self.clients.claim(),
      // Limpiar cachés antiguas
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if (cache !== CACHE_NAME) {
              console.log('Service Worker: Limpiando caché antigua:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
    ])
  );
});

// Estrategia: Network First, fallback a Cache
self.addEventListener('fetch', event => {
  // No cachear peticiones POST (como el guardado de inspecciones)
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  // No cachear peticiones a Google Apps Script
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la respuesta es válida, clonarla y guardar en caché
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, buscar en caché
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Si no está en caché y es navegación, mostrar página offline
          if (event.request.mode === 'navigate') {
            return caches.match(BASE_PATH + '/index.html');
          }
          
          return new Response('Contenido no disponible offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// Sincronización en segundo plano
self.addEventListener('sync', event => {
  console.log('Service Worker: Sync event', event.tag);
  if (event.tag === 'sync-inspecciones') {
    event.waitUntil(syncInspecciones());
  }
});

async function syncInspecciones() {
  // Sincronizar inspecciones pendientes cuando vuelva la conexión
  console.log('Sincronizando inspecciones pendientes...');
  
  try {
    const pendientes = await obtenerInspeccionesPendientes();
    if (pendientes && pendientes.length > 0) {
      for (const inspeccion of pendientes) {
        await enviarInspeccion(inspeccion);
      }
    }
  } catch (error) {
    console.error('Error en sincronización:', error);
  }
}

async function obtenerInspeccionesPendientes() {
  // Aquí se obtienen las inspecciones guardadas localmente
  // que no se pudieron enviar por falta de conexión
  return [];
}

async function enviarInspeccion(inspeccion) {
  // Aquí se envía la inspección al servidor
  console.log('Enviando inspección:', inspeccion);
}

// Notificaciones Push
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de PreViajes',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('PreViajes', options)
  );
});

// Click en notificación
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
