## 🔴 SOLUCIÓN RÁPIDA - Errores Actuales

### ❌ Problemas Detectados:

1. **Iconos faltantes (404)** - Los archivos .png no existen
2. **Error 503 del script** - El Google Apps Script necesita actualización

---

## ✅ SOLUCIÓN 1: Generar Iconos (2 minutos)

### Paso 1: Abrir Generador
```
1. Haz doble click en: generar-iconos.html
2. Se abrirá en tu navegador
```

### Paso 2: Generar y Descargar
```
1. Verás preview de iconos ROJOS
2. Click en "🎨 Generar y Descargar Todos los Iconos"
3. Se descargarán 9 archivos PNG automáticamente:
   - icon-72.png
   - icon-96.png
   - icon-128.png
   - icon-144.png
   - icon-152.png
   - icon-192.png
   - icon-384.png
   - icon-512.png
   - apple-touch-icon.png
```

### Paso 3: Guardar en la Carpeta
```
1. Todos los archivos .png descargados
2. Muévelos a la carpeta PREVIAJES (donde está index.html)
3. NO los pongas en subcarpetas, directamente en la raíz
```

### Paso 4: Recargar
```
1. Vuelve a la app (http://127.0.0.1:5500)
2. Presiona F5 para recargar
3. ✅ Error de iconos solucionado
```

---

## ✅ SOLUCIÓN 2: Actualizar Google Apps Script (5 minutos)

### ⚠️ El script actual está incompleto

**El error 503 es porque faltan funciones en el script.**

### Paso 1: Copiar Script Actualizado

1. Abre **google-apps-script.js** (en VS Code)
2. El archivo YA ESTÁ ACTUALIZADO con las nuevas funciones:
   - ✅ `doGet()` - Para peticiones GET
   - ✅ `obtenerBuses()` - Lista de buses
   - ✅ `obtenerConductores()` - Lista de conductores
   - ✅ `consultarInspeccionesGet()` - Consultas

### Paso 2: Reemplazar en Google Apps Script

1. Ve a tu Google Apps Script (donde configuraste el proyecto)
2. **SELECCIONA TODO** el código actual (Ctrl+A)
3. **BORRA TODO** (Delete)
4. **COPIA** el código de `google-apps-script.js` actualizado
5. **PEGA** en el editor (Ctrl+V)
6. **GUARDA** (Ctrl+S)

### Paso 3: Nueva Implementación

**MUY IMPORTANTE:** Debes crear una nueva implementación

```
1. Click en "Implementar" (arriba a la derecha)
2. Click en "Administrar implementaciones"
3. Click en el ícono de ⚙️ engranaje junto a tu implementación actual
4. En "Nueva versión de implementación"
5. Cambia "Versión" a → "Nueva versión"
6. Descripción: "Agregadas funciones GET"
7. Click en "Implementar"
8. ✅ Listo
```

### Paso 4: Verificar URL

```
La URL debe seguir siendo la misma:
https://script.google.com/macros/s/AKfycbwYt7MROn31sfjG9XjnalNWd4fi3fLEGJ-U_c8xUvLw_OVPcexs8p0ulZ6rHzVnGjZf/exec

Si es la misma, NO necesitas cambiar app.js
```

---

## 🧪 PROBAR QUE TODO FUNCIONE

### Test 1: Probar el Script Directamente

Abre esta URL en tu navegador (cambia por tu URL):
```
https://script.google.com/macros/s/TU_URL_AQUI/exec?action=getBuses
```

**Deberías ver:**
```json
{
  "success": true,
  "data": {
    "buses": [...]
  }
}
```

### Test 2: Probar en la App

```
1. Recarga la app (F5)
2. Abre la consola (F12)
3. NO deberías ver errores 503
4. Deberías ver en la consola algo como:
   "Buses cargados: 3"
```

---

## 📋 CHECKLIST COMPLETO

Antes de continuar, verifica:

### Iconos:
- [ ] Generados los 9 archivos .png
- [ ] Guardados en carpeta PREVIAJES (raíz)
- [ ] No hay errores 404 en consola

### Google Apps Script:
- [ ] Script actualizado con doGet y nuevas funciones
- [ ] IDs configurados (SPREADSHEET_ID y FOLDER_ID)
- [ ] Nueva versión implementada
- [ ] URL del script funciona (prueba en navegador)
- [ ] No hay errores 503

### App Funcionando:
- [ ] Live Server corriendo (puerto 5500)
- [ ] App abre en http://127.0.0.1:5500
- [ ] No hay errores en consola (F12)
- [ ] Service Worker registrado
- [ ] Los buses/conductores cargan

---

## 🆘 SI AÚN HAY ERRORES

### Error: "Contenido no válido JSON"

**Causa:** El script está devolviendo HTML en lugar de JSON

**Solución:**
1. Asegúrate de haber creado NUEVA VERSIÓN en implementación
2. Usa la URL que termina en `/exec` (NO `/dev`)
3. Espera 1-2 minutos para que se actualice

### Error: "403 Forbidden"

**Causa:** Permisos del script

**Solución:**
1. En implementación, verifica que diga "Cualquier usuario"
2. Vuelve a autorizar permisos ejecutando `testCrearHojas`

### Error: "Cannot read properties"

**Causa:** IDs incorrectos en CONFIG

**Solución:**
1. Verifica SPREADSHEET_ID (copia de la URL del Sheet)
2. Verifica FOLDER_ID (copia de la URL de Drive)

---

## ✅ CUANDO TODO ESTÉ VERDE

Si ya no hay errores:

```bash
# Listo para Git
git add .
git commit -m "PreViajes completo - iconos y backend funcionando"
```

🎯 **Siguiente paso:** Subir a GitHub Pages para usarlo desde el celular
