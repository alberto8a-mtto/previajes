# Iconos para PWA - PreViajes

## Iconos Requeridos

La aplicación necesita los siguientes iconos para funcionar correctamente como PWA:

### Lista de Iconos
1. **icon-72.png** - 72x72 píxeles
2. **icon-96.png** - 96x96 píxeles
3. **icon-128.png** - 128x128 píxeles
4. **icon-144.png** - 144x144 píxeles
5. **icon-152.png** - 152x152 píxeles
6. **icon-192.png** - 192x192 píxeles (recomendado)
7. **icon-384.png** - 384x384 píxeles
8. **icon-512.png** - 512x512 píxeles (requerido)

### Apple Touch Icon
- **apple-touch-icon.png** - 180x180 píxeles

## Recomendaciones de Diseño

### Concepto Visual
- **Tema**: Inspección vehicular Alberto Ochoa, buses, transporte
- **Símbolos sugeridos**: 
  - Logo corporativo de Alberto Ochoa
  - Icono de bus 🚍
  - Clipboard con checklist ✓
  - Llave inglesa 🔧
  - Combinación de bus + checklist

### Especificaciones Técnicas
- **Formato**: PNG con transparencia
- **Colores**: ROJO como color principal #dc2626, naranja #f97316 para acentos
- **Background**: 
  - Para iconos normales: Fondo transparente O fondo rojo corporativo
  - Para maskable icons: Agregar safe zone de 10% alrededor del icono
- **Estilo**: Flat design, moderno, simple, legible en tamaños pequeños, identidad roja fuerte de Alberto Ochoa

### Colores de la Marca (ROJO Predominante)
```css
Rojo Principal: #dc2626
Rojo Oscuro: #991b1b
Naranja Cálido: #f97316
Blanco: #ffffff
Gris: #64748b
```

## Herramientas para Crear Iconos

### Online (Gratis)
1. **Canva** - https://www.canva.com/
   - Plantillas de iconos de aplicación
   - Herramientas de diseño fáciles
   - Exportar en PNG

2. **Favicon.io** - https://favicon.io/
   - Generador de favicon desde texto/emoji
   - Genera múltiples tamaños automáticamente

3. **PWA Asset Generator** - https://progressier.com/pwa-icons-generator
   - Sube un icono base (512x512)
   - Genera todos los tamaños necesarios automáticamente

4. **RealFaviconGenerator** - https://realfavicongenerator.net/
   - Genera iconos para todas las plataformas
   - Preview en diferentes dispositivos

### Software de Diseño
1. **GIMP** (Gratis) - https://www.gimp.org/
2. **Inkscape** (Gratis, vectorial) - https://inkscape.org/
3. **Figma** (Gratis para uso personal) - https://www.figma.com/
4. **Adobe Illustrator** (Pago)

## Proceso Rápido con PWA Asset Generator

1. Crear o encontrar un icono cuadrado de 512x512 px
2. Ir a https://progressier.com/pwa-icons-generator
3. Subir el icono
4. Descargar el paquete completo con todos los tamaños
5. Copiar todos los archivos PNG a la carpeta del proyecto

## Uso de Emoji como Icono Temporal

Si necesitas iconos temporales rápidamente:

1. Ir a https://favicon.io/emoji-favicons/bus/
2. Seleccionar el emoji de bus 🚍
3. Descargar el paquete
4. Renombrar los archivos según la lista de arriba

## Ubicación de los Archivos

Todos los iconos deben estar en la raíz del proyecto:
```
PREVIAJES/
├── index.html
├── styles.css
├── app.js
├── manifest.json
├── service-worker.js
├── icon-72.png
├── icon-96.png
├── icon-128.png
├── icon-144.png
├── icon-152.png
├── icon-192.png
├── icon-384.png
├── icon-512.png
└── apple-touch-icon.png
```

## Verificación

Después de crear los iconos:

1. Verifica que todos los archivos estén en la carpeta correcta
2. Abre Chrome DevTools → Application → Manifest
3. Revisa que se muestren todos los iconos
4. Prueba la instalación de la PWA en un dispositivo móvil

## Maskable Icons (Opcional pero Recomendado)

Para Android 13+ y mejor integración:

1. Crear versiones "maskable" de los iconos
2. El contenido importante debe estar en el 80% central
3. El 20% exterior puede ser cortado por diferentes formas de iconos
4. Actualizar manifest.json:
```json
{
  "src": "icon-maskable-512.png",
  "sizes": "512x512",
  "type": "image/png",
  "purpose": "maskable"
}
```

## Recursos Adicionales

- **Google PWA Icons Guide**: https://web.dev/add-manifest/
- **Apple Icon Guidelines**: https://developer.apple.com/design/human-interface-guidelines/app-icons
- **Maskable.app Editor**: https://maskable.app/editor

---

**Nota**: Los iconos son esenciales para que la PWA se vea profesional al instalarse. Dedica tiempo a crear buenos iconos que representen la aplicación.
