# 🚍 Sistema de Inspección de Llantas - PreViajes

Sistema web completo para registrar inspecciones de 24 llantas por vehículo, con almacenamiento automático en Google Drive usando Google Apps Script.

## 📋 Características

✅ Registro de 24 llantas por inspección
✅ 3 mediciones por llanta (Externa, Media, Interna)
✅ Cálculo automático de promedios
✅ Alertas visuales (Crítica <3mm, Regular 3-5mm, Buena >5mm)
✅ Búsqueda de vehículos por número interno o placa
✅ Almacenamiento en Google Sheets
✅ Generación opcional de PDF en Google Drive
✅ Interfaz responsive (móvil y desktop)
✅ Resumen estadístico en tiempo real

---

## 🚀 INSTALACIÓN PASO A PASO

### PASO 1: Preparar Google Sheets

1. **Crear una nueva hoja de cálculo en Google Sheets**
   - Ir a: https://sheets.google.com
   - Clic en "+ Blank spreadsheet"
   - Nombrarla: "Inspecciones de Llantas"

2. **Obtener el ID de la hoja**
   - Copiar el ID de la URL:
   ```
   https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
   ```

3. **Crear la hoja "Buses"** (opcional, se crea automáticamente)
   - Agregar columnas: Numero Interno | Placa | Modelo | Estado
   - Agregar tus vehículos:
   ```
   2417    NNZ426    Mercedes-Benz O500    Activo
   2960    TRN123    Volvo B290R          Activo
   3105    ABC456    Scania K380          Activo
   ```

---

### PASO 2: Configurar Google Apps Script

1. **Abrir el editor de scripts**
   - En la hoja de cálculo: Extensiones → Apps Script
   - O ir directamente a: https://script.google.com

2. **Copiar el código**
   - Abrir el archivo `Code.gs` de este proyecto
   - Copiar TODO el contenido
   - Pegar en el editor de Apps Script (reemplazar todo)

3. **Configurar las variables**
   ```javascript
   const SPREADSHEET_ID = 'PEGAR_TU_ID_AQUI';
   const FOLDER_ID = 'OPCIONAL_ID_DE_CARPETA_DRIVE';
   ```

4. **Guardar el proyecto**
   - Clic en el icono de disquete 💾
   - Nombrar el proyecto: "API Inspecciones"

5. **Implementar como Web App**
   - Clic en **Implementar** → **Nueva implementación**
   - Tipo: **Aplicación web**
   - Configuración:
     * **Descripción:** API Inspecciones v1
     * **Ejecutar como:** Yo (tu correo)
     * **Quién tiene acceso:** Cualquier persona
   - Clic en **Implementar**

6. **Copiar la URL del Web App**
   ```
   https://script.google.com/macros/s/XXXXXXXXX/exec
   ```
   - ⚠️ **MUY IMPORTANTE:** Guardar esta URL

7. **Autorizar permisos**
   - La primera vez pedirá permisos
   - Clic en "Revisar permisos"
   - Seleccionar tu cuenta
   - Clic en "Configuración avanzada" → "Ir a [nombre proyecto]"
   - Clic en "Permitir"

---

### PASO 3: Configurar la Aplicación Web

1. **Editar el archivo `app.js`**
   - Abrir el archivo `app.js`
   - En la **línea 2**, pegar la URL del Web App:
   ```javascript
   const SCRIPT_URL = 'https://script.google.com/macros/s/XXXXXXXXX/exec';
   ```

2. **Guardar cambios**

---

### PASO 4: Ejecutar la Aplicación

#### Opción A: Abrir directamente el HTML
1. Hacer doble clic en `index.html`
2. Se abrirá en tu navegador

#### Opción B: Usar un servidor local (recomendado)
1. Instalar la extensión "Live Server" en VS Code
2. Click derecho en `index.html` → "Open with Live Server"

#### Opción C: Servidor Python
```powershell
# En la carpeta del proyecto ejecutar:
python -m http.server 8000

# Abrir en el navegador:
# http://localhost:8000
```

---

## 📱 CÓMO USAR EL SISTEMA

### 1. Información General
- **Fecha:** Se establece automáticamente (editable)
- **Número Interno:** Escribir y buscar el bus
- **Placa:** Se autocompleta al seleccionar el bus
- **Técnico:** Nombre del inspector
- **Observaciones:** Notas generales

### 2. Inspección de Llantas
- Se muestran 24 tarjetas (una por llanta)
- Cada tarjeta tiene 3 campos:
  * **Externa:** Profundidad exterior (mm)
  * **Media:** Profundidad central (mm)
  * **Interna:** Profundidad interior (mm)

### 3. Validación Automática
- **🔴 Rojo** = Crítica (< 3mm)
- **🟡 Amarillo** = Regular (3-5mm)
- **🟢 Verde** = Buena (> 5mm)

### 4. Resumen Estadístico
- Se calcula automáticamente:
  * Llantas críticas
  * Llantas regulares
  * Llantas buenas
  * Promedio general

### 5. Guardar
- Clic en **"💾 Guardar Inspección"**
- Los datos se envían a Google Sheets
- Se genera confirmación

---

## 📊 ESTRUCTURA DE DATOS EN GOOGLE SHEETS

### Hoja: Inspecciones
| ID Inspección | Fecha | Número Interno | Placa | Técnico | Llantas Críticas | ... |
|--------------|-------|----------------|-------|---------|------------------|-----|

### Hoja: Detalle_Llantas
| ID Llanta | ID Inspección | Número Llanta | Externa | Media | Interna | Promedio | Estado |
|-----------|---------------|---------------|---------|-------|---------|----------|--------|

### Hoja: Buses
| Numero Interno | Placa | Modelo | Estado |
|----------------|-------|--------|--------|

---

## 🔧 PERSONALIZACIÓN

### Cambiar el número de llantas
En `app.js`, línea 25:
```javascript
for (let i = 1; i <= 24; i++) {  // Cambiar 24 por el número deseado
```

### Cambiar límites de profundidad
En `app.js`, función `validarProfundidad()`:
```javascript
if (valor < 3) {  // Límite crítico
if (valor >= 3 && valor <= 5) {  // Límite regular
```

### Agregar más campos de vehículo
Editar:
- `index.html` (agregar inputs)
- `app.js` (recopilar datos)
- `Code.gs` (guardar en Sheets)

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### ❌ Error: "Script URL no configurado"
**Solución:** Editar `app.js` y pegar la URL del Web App

### ❌ Error: "No se guardan los datos"
**Solución:** 
1. Verificar que el script esté implementado
2. Verificar permisos
3. Revisar el ID del Spreadsheet

### ❌ Error: "No aparecen los buses"
**Solución:**
1. Crear la hoja "Buses" manualmente
2. Agregar encabezados: Numero Interno | Placa | Modelo | Estado
3. Agregar al menos un vehículo

### ❌ No se ven los colores al escribir
**Solución:** Los colores aparecen cuando el valor es válido (0-30 mm)

---

## 📱 USO EN MÓVIL

El sistema es completamente responsive:
- ✅ Funciona en tablets
- ✅ Funciona en smartphones
- ✅ Se adapta al tamaño de pantalla

---

## 🔐 SEGURIDAD

- Los datos se almacenan en TU cuenta de Google
- Solo tú tienes acceso a la hoja de cálculo
- El script se ejecuta con tus permisos
- Puedes revocar acceso en cualquier momento

---

## 📦 ARCHIVOS DEL PROYECTO

```
PREVIAJES/
│
├── index.html          # Interfaz principal
├── app.js              # Lógica de la aplicación
├── styles.css          # Estilos y diseño
├── Code.gs             # Google Apps Script (copiar a script.google.com)
└── README.md           # Este archivo
```

---

## 🎯 PRÓXIMOS PASOS

Una vez funcionando, puedes:

1. **Agregar dashboard de reportes**
2. **Exportar a Excel**
3. **Enviar notificaciones por email**
4. **Crear gráficos de tendencias**
5. **Agregar fotos de las llantas**
6. **Integrar con WhatsApp Business**

---

## 💡 TIPS PROFESIONALES

1. **Backup regular:** Hacer copias de la hoja de cálculo
2. **Validar datos:** Revisar que los promedios sean correctos
3. **Entrenar personal:** Capacitar en el uso del sistema
4. **Mantenimiento:** Limpiar datos antiguos periódicamente

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisar esta guía completa
2. Verificar la consola del navegador (F12)
3. Revisar los logs de Apps Script

---

## ✅ CHECKLIST DE INSTALACIÓN

- [ ] Crear Google Spreadsheet
- [ ] Copiar ID del Spreadsheet
- [ ] Crear Apps Script
- [ ] Copiar código de Code.gs
- [ ] Configurar SPREADSHEET_ID
- [ ] Implementar como Web App
- [ ] Copiar URL del Web App
- [ ] Pegar URL en app.js
- [ ] Autorizar permisos
- [ ] Abrir index.html
- [ ] Probar guardar una inspección
- [ ] Verificar datos en Sheets

---

**¡Sistema listo para usar! 🚀**

*Desarrollado para PreViajes - Sistema de Inspección de Llantas*
