# 🧪 Cómo Probar PreViajes PWA Localmente

## Método 1: Python HTTP Server (Recomendado)

### Windows

1. **Abre PowerShell** en la carpeta del proyecto:
   - Presiona `Shift + Click derecho` en la carpeta PREVIAJES
   - Selecciona "Abrir ventana de PowerShell aquí"

2. **Verifica que tengas Python instalado:**
   ```powershell
   python --version
   ```
   
   Si no lo tienes, descárgalo de: https://www.python.org/downloads/

3. **Inicia el servidor:**
   ```powershell
   # Para Python 3.x
   python -m http.server 8000
   
   # O para Python 2.x
   python -m SimpleHTTPServer 8000
   ```

4. **Abre tu navegador:**
   - Ve a: `http://localhost:8000`
   - O: `http://127.0.0.1:8000`

5. **Prueba la instalación PWA:**
   - Chrome mostrará el ícono de instalación (➕) en la barra de direcciones
   - O usa el menú → "Instalar PreViajes"

---

## Método 2: Node.js con HTTP-Server

### Instalación

1. **Instala Node.js** si no lo tienes:
   - Descarga de: https://nodejs.org/

2. **Instala http-server globalmente:**
   ```powershell
   npm install -g http-server
   ```

3. **Navega a la carpeta del proyecto:**
   ```powershell
   cd "C:\Users\mantenimiento\Desktop\PREVIAJES"
   ```

4. **Inicia el servidor:**
   ```powershell
   http-server -p 8000
   ```

5. **Abre en navegador:**
   - `http://localhost:8000`

---

## Método 3: Live Server (VS Code Extension)

Si usas **Visual Studio Code**:

1. **Instala la extensión "Live Server":**
   - Abre VS Code
   - Ve a Extensions (Ctrl+Shift+X)
   - Busca "Live Server"
   - Instala la de Ritwick Dey

2. **Abre la carpeta del proyecto en VS Code:**
   ```
   File → Open Folder → Selecciona PREVIAJES
   ```

3. **Inicia Live Server:**
   - Click derecho en `index.html`
   - Selecciona "Open with Live Server"
   - O presiona `Alt+L` luego `Alt+O`

4. **Se abrirá automáticamente en:**
   - `http://127.0.0.1:5500` (o el puerto que asigne)

---

## Método 4: XAMPP/WAMP (Si ya lo tienes)

1. **Copia la carpeta PREVIAJES** a:
   - XAMPP: `C:\xampp\htdocs\`
   - WAMP: `C:\wamp64\www\`

2. **Inicia Apache** desde el panel de XAMPP/WAMP

3. **Abre en navegador:**
   - `http://localhost/PREVIAJES/`

---

## ✅ Verificar que la PWA funcione

### 1. Service Worker Registrado

Abre **Chrome DevTools** (F12):
```
Application → Service Workers
```
Debes ver: `"Status: activated and is running"`

### 2. Manifest Válido

En DevTools:
```
Application → Manifest
```
Verifica que se muestren:
- ✅ Nombre: PreViajes
- ✅ Iconos (aunque no existan aún)
- ✅ Theme color
- ✅ Display: standalone

### 3. Probar Instalación

1. En Chrome, busca el ícono de instalación (➕) en la barra de direcciones
2. O ve al menú (⋮) → "Instalar PreViajes"
3. Si aparece, ¡funciona! 🎉

### 4. Probar Modo Offline

1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Cambia el dropdown a **"Offline"**
4. Recarga la página (F5)
5. Debe seguir funcionando ✅

---

## 🐛 Solución de Problemas

### No se registra el Service Worker

**Causa**: Probablemente no estás usando HTTP/HTTPS

**Solución**: 
- No abras `index.html` directamente (file:///)
- Usa uno de los métodos de servidor HTTP de arriba
- `localhost` funciona sin HTTPS para desarrollo

### No aparece opción de instalar

**Verificar**:
1. ✅ ¿Estás en Chrome o Edge? (Firefox no muestra instalación automática)
2. ✅ ¿El manifest.json es válido? (revisa en DevTools)
3. ✅ ¿El service worker está activo?
4. ✅ ¿Los iconos existen? (icon-192.png y icon-512.png son obligatorios)

### Los cambios no se reflejan

**Solución**:
1. Abre DevTools
2. Ve a **Application → Service Workers**
3. Marca **"Update on reload"**
4. O haz click en **"Unregister"** y recarga

### Errores en consola

**Revisa**:
- Rutas de archivos correctas en `service-worker.js`
- Rutas de iconos en `manifest.json`
- Sintaxis JSON válida (sin comas extras)

---

## 📱 Probar en Dispositivo Móvil Real

### Opción A: Ngrok (Túnel HTTPS Gratis)

1. **Descarga Ngrok:**
   - https://ngrok.com/download

2. **Extrae y ejecuta:**
   ```powershell
   # Primero inicia tu servidor local en puerto 8000
   python -m http.server 8000
   
   # En otra terminal, ejecuta ngrok
   ngrok http 8000
   ```

3. **Copia la URL HTTPS que te da:**
   ```
   Forwarding https://abc123.ngrok.io -> http://localhost:8000
   ```

4. **Abre esa URL en tu celular**
   - Tendrás HTTPS real
   - Podrás instalar la PWA como en producción

### Opción B: IP Local (Misma Red WiFi)

1. **Encuentra tu IP local:**
   ```powershell
   ipconfig
   # Busca "Dirección IPv4" (ej: 192.168.1.100)
   ```

2. **Inicia servidor HTTP:**
   ```powershell
   python -m http.server 8000
   ```

3. **En tu celular (conectado a la misma WiFi):**
   - Abre Chrome
   - Ve a: `http://192.168.1.100:8000`
   
   ⚠️ **Limitación**: Sin HTTPS, algunas funciones PWA no funcionarán

### Opción C: Chrome Remote Debugging

1. **Conecta tu celular Android con USB**

2. **Habilita "Depuración USB"** en el celular:
   - Configuración → Acerca del teléfono
   - Toca 7 veces en "Número de compilación"
   - Vuelve → Opciones de desarrollador → Depuración USB

3. **En Chrome de tu PC:**
   - Ve a: `chrome://inspect`
   - Verás tu dispositivo
   - Click en "Inspect" bajo la página

4. **Ahora puedes:**
   - Ver consola del móvil en tu PC
   - Debugging completo
   - Network tab, etc.

---

## 🚀 Tips de Desarrollo

### Auto-reload al guardar

Con **Live Server** (VS Code), los cambios se reflejan automáticamente.

### Cache Busting

Durante desarrollo, marca en DevTools:
```
Application → Service Workers → ✅ Update on reload
```

### Lighthouse Audit

Cada vez que hagas cambios:
1. DevTools → Lighthouse
2. Selecciona "Progressive Web App"
3. Click "Generate report"
4. Revisa puntuación y sugerencias

---

## 📊 Checklist de Testing

Antes de considerar la PWA lista:

- [ ] Service worker se registra correctamente
- [ ] Manifest es válido (sin errores en DevTools)
- [ ] Funciona offline (modo airplane)
- [ ] Se ofrece instalación en Chrome
- [ ] Iconos se ven correctos (después de crearlos)
- [ ] Formularios funcionan normalmente
- [ ] Responsive en móvil, tablet, desktop
- [ ] Lighthouse PWA score > 90
- [ ] Probado en Android (Chrome)
- [ ] Probado en iOS (Safari)
- [ ] Cache se actualiza correctamente

---

## 🎯 Comandos Útiles Resumidos

```powershell
# Iniciar servidor Python
python -m http.server 8000

# Iniciar servidor Node
npx http-server -p 8000

# Ver IP local
ipconfig

# Ngrok tunnel
ngrok http 8000
```

---

## 📚 Recursos de Testing

- **Chrome DevTools**: Herramienta principal de debugging
- **Lighthouse**: Auditoría de PWA
- **Chrome DevTools for Mobile**: chrome://inspect
- **PWA Builder**: https://www.pwabuilder.com/ (validador online)

---

¡Ahora puedes probar tu PWA localmente como un profesional! 🚀
