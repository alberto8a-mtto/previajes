# 📊 CONFIGURACIÓN GOOGLE SHEETS - PreViajes

## 📋 PASO A PASO COMPLETO

---

## 1️⃣ CREAR GOOGLE SHEET

### A. Crear la Hoja de Cálculo

1. Ve a **https://sheets.google.com**
2. Click en **+ Blank** (Nuevo documento en blanco)
3. Nombra el documento: **"PreViajes - Inspecciones Alberto Ochoa"**

### B. Obtener el ID del Spreadsheet

1. Mira la URL de tu Google Sheet:
   ```
   https://docs.google.com/spreadsheets/d/AQUI_ESTA_EL_ID/edit
   ```
2. **Copia el ID** (la parte entre `/d/` y `/edit`)
3. Ejemplo: `1AbC-2DeFgH3IjKl4MnO5PqR6StUv7WxY8z`
4. **Guárdalo** - lo necesitarás después

---

## 2️⃣ CREAR CARPETA EN GOOGLE DRIVE

### A. Crear Carpeta para Archivos

1. Ve a **https://drive.google.com**
2. Click derecho → **Nueva carpeta**
3. Nómbrala: **"PreViajes - Archivos"**
4. Dentro, crea subcarpetas:
   - `Firmas`
   - `Fotos Carroceria`
   - `Fotos Llantas`
   - `Fotos Seguridad`

### B. Obtener el ID de la Carpeta

1. Abre la carpeta principal "PreViajes - Archivos"
2. Mira la URL:
   ```
   https://drive.google.com/drive/folders/ESTE_ES_EL_ID_DE_CARPETA
   ```
3. **Copia el ID** de la carpeta
4. **Guárdalo** - lo necesitarás después

---

## 3️⃣ CONFIGURAR GOOGLE APPS SCRIPT

### A. Abrir Editor de Scripts

1. En tu Google Sheet, ve al menú **Extensiones** → **Apps Script**
2. Se abrirá el editor de código
3. Verás un archivo `Código.gs` vacío
4. **BORRA** todo el contenido que tenga

### B. Copiar el Código del Script

1. Abre el archivo **`google-apps-script.js`** de este proyecto (en VS Code)
2. **Selecciona TODO** (Ctrl+A) y **copia** (Ctrl+C)
3. Pégalo en el editor de Apps Script (reemplaza todo)
4. Deberías ver el código completo con funciones doGet, doPost, etc.

### C. Configurar los IDs

En las primeras líneas del script (líneas 7-9), verás:

```javascript
const CONFIG = {
  SPREADSHEET_ID: 'TU_ID_DE_GOOGLE_SHEETS_AQUI',
  FOLDER_ID: 'TU_ID_DE_CARPETA_DRIVE_AQUI'
};
```

**⚠️ MUY IMPORTANTE - Reemplaza con tus IDs:**

```javascript
const CONFIG = {
  SPREADSHEET_ID: '1AbC-2DeFgH3IjKl4MnO5PqR6StUv7WxY8z',  // ← TU ID del Sheet aquí
  FOLDER_ID: '1XyZ-9WvU8tS7rQ6pO5nM4lK3jI2hG1fE'         // ← TU ID de carpeta aquí
};
```

### D. Guardar el Proyecto

1. Click en el ícono de **💾 Proyecto sin título** (arriba)
2. Nombra el proyecto: **"PreViajes Backend"**
3. Click en **💾 Guardar** o presiona Ctrl+S

---

## 4️⃣ PROBAR EL SCRIPT

### A. Crear las Hojas Automáticamente

1. En el editor de Apps Script, busca la función `testCrearHojas`
2. Selecciónala en el dropdown de funciones (arriba)
3. Click en **▶️ Ejecutar**

### B. Autorizar Permisos (Primera Vez)

1. Te pedirá **Revisar permisos**
2. Click en **Revisar permisos**
3. Selecciona tu cuenta de Google
4. Click en **Avanzado**
5. Click en **Ir a PreViajes Backend (no seguro)**
6. Click en **Permitir**

### C. Verificar Resultados

1. Vuelve a tu Google Sheet
2. Deberías ver **3 hojas nuevas**:
   - ✅ **Inspecciones** (con headers rojos)
   - ✅ **Llantas** (con headers rojos)
   - ✅ **Vehiculos** (con headers rojos)

---

## 5️⃣ PUBLICAR COMO WEB APP

### A. Implementar el Script

1. En el editor de Apps Script, click en **Implementar** → **Nueva implementación**
2. Click en el ícono de ⚙️ **Seleccionar tipo** → **Aplicación web**

### B. Configurar la Implementación

**Descripción:** `PreViajes API v1`

**Ejecutar como:** `Yo (tu email)`

**Quién tiene acceso:** `Cualquier usuario`

3. Click en **Implementar**

### C. Obtener la URL de la Web App

1. **Copia la URL** que aparece (termina en `/exec`)
2. Ejemplo: `https://script.google.com/macros/s/AKfycby.../exec`
3. **GUARDA ESTA URL** - es la más importante

---

## 6️⃣ CONECTAR LA APP CON EL SCRIPT

### A. Actualizar app.js

1. Abre el archivo **`app.js`** del proyecto
2. Busca la línea (al principio):
   ```javascript
   const SCRIPT_URL = 'https://script.google.com/macros/s/TU_URL_AQUI/exec';
   ```
3. Reemplázala con tu URL:
   ```javascript
   const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```
4. **Guarda el archivo**

---

## 7️⃣ PROBAR LA CONEXIÓN

### A. Hacer una Inspección de Prueba

1. Abre `index.html` en tu navegador
2. Llena una inspección de prueba
3. Firma y envía
4. Deberías ver: **"✅ Inspección guardada exitosamente"**

### B. Verificar en Google Sheets

1. Ve a tu Google Sheet
2. Revisa la hoja **"Inspecciones"**
3. Deberías ver la nueva fila con los datos

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### ❌ Error: "Script no autorizado"

**Solución:**
1. Vuelve al Apps Script
2. Ejecuta `testCrearHojas` de nuevo
3. Autoriza permisos nuevamente

### ❌ Error: "No se puede guardar"

**Solución:**
1. Verifica que el `SPREADSHEET_ID` sea correcto
2. Verifica que el `FOLDER_ID` sea correcto
3. Asegúrate de haber autorizado permisos

### ❌ Error de CORS

**Solución:**
1. Asegúrate de haber publicado como "Cualquier usuario"
2. No uses la URL de "prueba", usa la URL de "/exec"

### ❌ Los datos no aparecen

**Solución:**
1. Abre la consola del navegador (F12)
2. Revisa si hay errores
3. Verifica que la URL en `app.js` sea correcta
4. Asegúrate de que termine en `/exec` (NO `/dev`)

---

## 📊 ESTRUCTURA DE LAS HOJAS

### Hoja "Inspecciones"
Columnas:
- ID Inspección
- Fecha
- Placa
- Número Interno
- Tipo Vehículo
- Odómetro
- Inspector
- Estado General
- Carrocería (JSON)
- Mecánico (JSON)
- Luces (JSON)
- Seguridad (JSON)
- Vidrios (JSON)
- Observaciones
- URL Firma

### Hoja "Llantas"
Columnas:
- ID Inspección
- Fecha
- Placa
- Posición
- Medida Externa
- Medida Media
- Medida Interna
- Promedio
- Estado
- Crítica
- URLs Evidencias

### Hoja "Vehiculos" (Opcional)
Columnas:
- Número Interno
- Placa
- Tipo
- Modelo
- Estado

---

## 🔄 ACTUALIZAR EL SCRIPT

Si necesitas hacer cambios al script:

1. Edita el código en Apps Script
2. **Guarda** (Ctrl+S)
3. **Nueva implementación**:
   - Click en **Implementar** → **Administrar implementaciones**
   - Click en el ✏️ lápiz de edición
   - Cambiar versión a **Nueva versión**
   - Click en **Implementar**

---

## ✅ CHECKLIST FINAL

Antes de subir a Git:

- [ ] Google Sheet creado
- [ ] ID del Sheet copiado
- [ ] Carpeta Drive creada
- [ ] ID de carpeta copiado
- [ ] Script copiado a Apps Script
- [ ] IDs configurados en el script
- [ ] Función `testCrearHojas` ejecutada
- [ ] Hojas creadas correctamente
- [ ] Script implementado como Web App
- [ ] URL de la Web App copiada
- [ ] URL configurada en `app.js`
- [ ] Inspección de prueba exitosa
- [ ] Datos aparecen en Google Sheets

---

## 🎯 SIGUIENTE PASO

Una vez que todo esté funcionando:

```bash
# Inicializar Git y subir a GitHub
git init
git add .
git commit -m "PreViajes - Sistema completo con Google Sheets"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/previajes.git
git push -u origin main
```

---

**¿Listo para empezar? 🚀 Comienza por el Paso 1: Crear Google Sheet**
