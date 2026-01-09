# PreViajes - Progressive Web App (PWA)

## 📱 ¿Qué es una PWA?

PreViajes ahora es una **Progressive Web App (PWA)**, lo que significa que:

✅ **Se instala como una app nativa** en móviles y computadoras
✅ **Funciona sin internet** (modo offline) una vez instalada
✅ **Más rápida** - cachea recursos para carga instantánea
✅ **Pantalla completa** - se abre como app independiente, sin barra del navegador
✅ **Actualizaciones automáticas** - siempre la última versión
✅ **Ocupa poco espacio** - no es necesario descargar desde tiendas de apps

## 📲 Cómo Instalar PreViajes

### En Android (Chrome)

1. Abre **Chrome** en tu celular
2. Ve a la URL de PreViajes
3. Busca el banner que dice **"Instalar PreViajes"** o toca el botón **"Instalar"**
4. O bien, toca el menú ⋮ → **"Agregar a pantalla de inicio"** o **"Instalar app"**
5. La app aparecerá en tu pantalla de inicio como cualquier otra app

### En iPhone/iPad (Safari)

1. Abre **Safari** en tu dispositivo iOS
2. Ve a la URL de PreViajes
3. Toca el botón de **Compartir** (📤)
4. Selecciona **"Agregar a pantalla de inicio"**
5. Dale un nombre (por defecto: "PreViajes")
6. Toca **"Agregar"**
7. El icono aparecerá en tu pantalla de inicio

### En Computadora (Chrome/Edge)

1. Abre el sitio en Chrome o Edge
2. Busca el ícono de **instalación** (➕) en la barra de direcciones
3. O ve al menú → **"Instalar PreViajes"**
4. Haz clic en **"Instalar"**
5. La app se abrirá en una ventana independiente

## 🔧 Características PWA Implementadas

### ✅ Manifest (manifest.json)
- Información de la aplicación
- Iconos en múltiples tamaños
- Accesos directos (shortcuts)
- Configuración de pantalla completa

### ✅ Service Worker (service-worker.js)
- Cache de recursos para uso offline
- Estrategia network-first (siempre intenta red primero)
- Background sync para sincronizar inspecciones offline
- Soporte para notificaciones push (preparado para futuro)

### ✅ Diseño Responsive
- Optimizado para móviles, tablets y desktop
- Inputs de 16px mínimo (evita zoom en iOS)
- Botones con target táctil de 48px mínimo
- Safe areas para dispositivos con notch

### ✅ Optimizaciones Móviles
- Font size 16px en inputs (evita auto-zoom en iOS)
- Touch-action: manipulation (evita zoom en doble-tap)
- Viewport con initial-scale, maximum-scale
- Smooth scrolling

## 🌐 Modo Offline

### ¿Qué funciona sin internet?

✅ **Navegación** - Todos los módulos y formularios
✅ **Interfaz completa** - Estilos, scripts, imágenes
✅ **Datos locales** - Lo que ya cargaste
✅ **Llenado de formularios** - Puedes completar inspecciones

❌ **No funciona sin internet:**
- Envío de datos a Google Sheets
- Consulta de inspecciones anteriores
- Descarga de datos nuevos

### Background Sync (Preparado)

Cuando tengas conexión nuevamente:
- Las inspecciones pendientes se enviarán automáticamente
- Los datos se sincronizarán en segundo plano

## 📁 Estructura de Archivos PWA

```
PREVIAJES/
├── index.html              # Página principal con meta tags PWA
├── styles.css              # Estilos responsive + PWA
├── app.js                  # Lógica de la aplicación
├── manifest.json           # Configuración PWA
├── service-worker.js       # Service worker para offline
├── icon-72.png            # Iconos en múltiples tamaños
├── icon-96.png
├── icon-128.png
├── icon-144.png
├── icon-152.png
├── icon-192.png
├── icon-384.png
├── icon-512.png
└── apple-touch-icon.png   # Icono para iOS
```

## 🎨 Personalización

### Colores del Tema
Edita las variables en `manifest.json`:
```json
{
  "theme_color": "#2563eb",      // Color de la barra superior
  "background_color": "#f8fafc"  // Color de carga
}
```

### Nombre de la App
Edita en `manifest.json`:
```json
{
  "name": "PreViajes - Inspección Vehicular",
  "short_name": "PreViajes"
}
```

### Accesos Directos (Shortcuts)
Ya configurados en `manifest.json`:
1. **Nueva Inspección** - Abre directamente el formulario
2. **Consultar Inspecciones** - Abre el modal de consulta

## 🔄 Actualización de la PWA

### Cómo se Actualiza

1. **Automático**: Cuando cambies archivos, el service worker detecta la nueva versión
2. El service worker descarga los cambios en segundo plano
3. La próxima vez que el usuario abra la app, verá la nueva versión

### Forzar Actualización Manual

```javascript
// En app.js o en la consola del navegador
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.update());
    });
}
```

### Cambiar Versión del Cache

Edita `service-worker.js`:
```javascript
const CACHE_NAME = 'previajes-v2'; // Incrementa el número
```

## 🧪 Pruebas y Debugging

### Chrome DevTools

1. Abre DevTools (F12)
2. Ve a la pestaña **"Application"**
3. Revisa:
   - **Manifest**: Información y iconos
   - **Service Workers**: Estado y actualizaciones
   - **Cache Storage**: Archivos cacheados
   - **Lighthouse**: Auditoría PWA

### Lighthouse (Auditoría PWA)

1. DevTools → **Lighthouse**
2. Selecciona **"Progressive Web App"**
3. Click **"Generate report"**
4. Revisa puntuación y recomendaciones

### Probar Offline

1. DevTools → **Network**
2. Cambia a **"Offline"** en el dropdown
3. Recarga la página
4. Debe seguir funcionando

### Consola de Errores

Revisa la consola para errores del service worker:
```javascript
// Ver estado del service worker
navigator.serviceWorker.getRegistration().then(reg => {
    console.log('Service Worker registrado:', reg);
});
```

## 📊 Métricas y Analytics (Futuro)

Puedes agregar:
- Google Analytics para PWA
- Tracking de instalaciones
- Eventos de uso offline
- Rendimiento de carga

## 🔔 Notificaciones Push (Preparado)

El service worker ya tiene soporte básico para notificaciones. Para implementar:

1. Solicitar permiso:
```javascript
Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
        // Enviar notificaciones
    }
});
```

2. Configurar servidor de push (Firebase Cloud Messaging, OneSignal, etc.)

## 🚀 Despliegue (Hosting)

### Requisitos para PWA
✅ **HTTPS obligatorio** (excepto localhost)
✅ Service worker debe estar en la raíz
✅ Manifest debe ser accesible

### Opciones de Hosting Gratis

1. **GitHub Pages**
   - https://pages.github.com/
   - HTTPS automático
   - Ideal para proyectos estáticos

2. **Netlify**
   - https://www.netlify.com/
   - Deploy automático desde Git
   - HTTPS incluido

3. **Vercel**
   - https://vercel.com/
   - Deploy rápido
   - HTTPS incluido

4. **Firebase Hosting**
   - https://firebase.google.com/docs/hosting
   - Integra bien con Google Apps Script
   - HTTPS incluido

### Pasos para Deploy en GitHub Pages

```bash
# 1. Crear repositorio en GitHub
# 2. Subir archivos
git init
git add .
git commit -m "PWA PreViajes"
git branch -M main
git remote add origin https://github.com/tu-usuario/previajes.git
git push -u origin main

# 3. Configurar GitHub Pages
# Settings → Pages → Source: main branch → Save
```

## 🔐 Seguridad

### Headers Recomendados

Si tienes acceso al servidor, agrega estos headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### HTTPS

⚠️ **Importante**: Las PWA requieren HTTPS en producción.
- En desarrollo: localhost funciona sin HTTPS
- En producción: Usa hosting con HTTPS (GitHub Pages, Netlify, etc.)

## 📱 Compatibilidad

### ✅ Funciona Perfectamente
- Chrome/Edge (Android, Windows, Mac)
- Safari (iOS 11.3+, macOS)
- Firefox (Android, Desktop)
- Samsung Internet

### ⚠️ Limitaciones por Navegador
- **iOS Safari**: No todas las APIs disponibles (push, sync)
- **Safari Desktop**: Soporte básico, instalación limitada
- **Firefox**: No permite instalación automática

## 🐛 Problemas Comunes

### La app no se ofrece para instalar
- ✅ Verifica que manifest.json sea válido
- ✅ Confirma que service worker esté registrado
- ✅ Asegúrate de usar HTTPS (o localhost)
- ✅ Revisa que todos los iconos existan

### Los cambios no se reflejan
- 🔄 Fuerza actualización del service worker
- 🗑️ Limpia cache del navegador
- 🔄 Cambia CACHE_NAME en service-worker.js

### No funciona offline
- 📝 Revisa que service worker esté activo
- 📝 Confirma que los archivos estén en cache
- 📝 Abre DevTools → Application → Cache Storage

### Los iconos no aparecen
- 📁 Verifica rutas en manifest.json
- 📁 Confirma que los archivos PNG existan
- 🎨 Asegúrate de tener icon-192.png y icon-512.png

## 📚 Recursos Adicionales

### Documentación Oficial
- **MDN PWA Guide**: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- **Google Web.dev**: https://web.dev/progressive-web-apps/
- **PWA Builder**: https://www.pwabuilder.com/

### Herramientas
- **Lighthouse**: Auditoría PWA en Chrome DevTools
- **PWA Builder**: Generador y validador de PWA
- **Manifest Generator**: https://app-manifest.firebaseapp.com/

### Testing
- **PWA Test**: https://pwatest.com/
- **Lighthouse CI**: Auditoría automática en CI/CD

---

## 🎉 ¡Listo!

PreViajes es ahora una aplicación web progresiva completa. Los usuarios pueden:

1. ✅ Instalarla como app nativa
2. ✅ Usarla offline
3. ✅ Disfrutar de carga rápida
4. ✅ Acceder desde cualquier dispositivo

**Próximos pasos sugeridos:**
1. 📷 Crear iconos personalizados (ver ICONOS_PWA.md)
2. 🌐 Desplegar en hosting con HTTPS
3. 📊 Agregar analytics
4. 🔔 Implementar notificaciones push (opcional)
5. 🧪 Probar en diferentes dispositivos

---

**Desarrollado con ❤️ para facilitar las inspecciones vehiculares**
