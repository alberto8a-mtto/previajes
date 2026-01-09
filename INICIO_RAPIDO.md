# 🚀 INICIO RÁPIDO - PreViajes PWA

## ⚡ 3 Pasos Para Empezar

### 1️⃣ Generar Iconos (1 minuto)

```
1. Abre: generar-iconos.html en tu navegador
2. Click: "Generar y Descargar Todos los Iconos"
3. Guarda todos los archivos .png en la carpeta PREVIAJES
```

### 2️⃣ Probar Localmente (30 segundos)

```powershell
# Abre PowerShell en la carpeta PREVIAJES y ejecuta:
python -m http.server 8000

# Luego abre en Chrome:
http://localhost:8000
```

### 3️⃣ Instalar la App

- **Chrome**: Click en el ícono ➕ en la barra de direcciones
- **Móvil**: Aparecerá banner "Instalar PreViajes"

---

## ✅ ¿Qué Incluye?

📱 **Progressive Web App (PWA)**
- Se instala como app nativa
- Funciona sin internet (offline)
- Icono en pantalla de inicio

🚍 **6 Módulos de Inspección**
1. Carrocería y Pintura
2. Sistema Mecánico  
3. Luces y Pitos
4. Neumáticos (24 llantas)
5. Seguridad y Emergencias
6. Vidrios y Espejos

✨ **Validaciones Automáticas**
- Fotos obligatorias para MALO
- Llantas <3mm = rojo + foto obligatoria
- Firma digital
- Consulta de inspecciones anteriores

📱 **100% Responsive**
- Móviles, tablets, computadoras
- Touch-friendly

---

## 📚 Documentación Completa

Cada archivo .md tiene información detallada:

| Archivo | Contenido |
|---------|-----------|
| [INSTALAR.md](INSTALAR.md) | 📲 Guía para usuarios finales (cómo instalar en celular) |
| [README_PWA.md](README_PWA.md) | 📱 Todo sobre la PWA (características, offline, etc.) |
| [TESTING_LOCAL.md](TESTING_LOCAL.md) | 🧪 Cómo probar en local y móviles reales |
| [ICONOS_PWA.md](ICONOS_PWA.md) | 🎨 Guía para crear iconos profesionales |
| [CONSULTA_INSPECCIONES.md](CONSULTA_INSPECCIONES.md) | 🔍 Sistema de consultas |

---

## 🎯 Archivos Principales

```
PREVIAJES/
├── index.html           ← Aplicación principal
├── styles.css           ← Estilos responsive
├── app.js              ← Lógica de la app
├── manifest.json       ← Configuración PWA
├── service-worker.js   ← Funcionalidad offline
├── icon-*.png          ← Iconos (generarlos primero)
└── generar-iconos.html ← Herramienta para iconos
```

---

## 🔧 Configurar Google Apps Script (Opcional)

Para guardar inspecciones en Google Drive:

1. Crea un Google Apps Script en https://script.google.com
2. Implementa como Web App
3. Copia la URL e insértala en `app.js`:
   ```javascript
   const SCRIPT_URL = 'TU_URL_AQUI';
   ```

Ver documentación completa en el README.md original.

---

## 💡 Tips Rápidos

✅ **Iconos obligatorios**: Sin iconos, la PWA no se puede instalar  
✅ **HTTPS requerido**: En producción usa GitHub Pages, Netlify o Vercel  
✅ **Localhost funciona**: Para desarrollo no necesitas HTTPS  
✅ **Chrome DevTools**: F12 → Application → ver estado de PWA  

---

## ⚠️ Problemas Comunes

**No aparece opción de instalar:**
- ¿Creaste los iconos? (paso 1)
- ¿Estás en Chrome? (Firefox no muestra instalación automática)
- ¿Manifest es válido? (F12 → Application → Manifest)

**No funciona offline:**
- Abre la app al menos 1 vez con internet
- Verifica service worker: F12 → Application → Service Workers

**Los cambios no se ven:**
- F12 → Application → Service Workers → "Update on reload"
- O limpia cache del navegador

---

## 🚀 Deploy a Producción

### GitHub Pages (Gratis + HTTPS)

```bash
git init
git add .
git commit -m "PreViajes PWA"
git push -u origin main

# En GitHub: Settings → Pages → Source: main
```

URL final: `https://tu-usuario.github.io/previajes/`

---

## 📞 Necesitas Ayuda?

1. 📖 Lee la documentación específica (.md files)
2. 🔍 Revisa console de Chrome (F12)
3. 🧪 Prueba en modo incógnito
4. ✅ Verifica checklist arriba

---

**¿Listo para empezar? → Paso 1: Abre `generar-iconos.html` 🎨**
