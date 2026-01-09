# ❌ Error 302: Redirección en Google Apps Script

## Problema Detectado

La consola muestra **Status 302 (Redirect)** en las peticiones, lo que indica que:
- La URL del script no es la correcta
- El script no está desplegado correctamente
- Falta autorización o permisos

## Solución Paso a Paso

### 1️⃣ Verificar e Implementar el Script

1. **Abrir el Script:**
   - Vaya a: https://script.google.com
   - Abra el proyecto "PreViajes"

2. **Pegar el Código Actualizado:**
   - Seleccione todo el código actual (Ctrl+A)
   - Bórrelo
   - Copie el contenido completo de `google-apps-script.js`
   - Péguelo en el editor
   - **Guardar:** Ctrl+S o ícono de disquete

3. **Crear Nueva Implementación:**
   - Click en **"Implementar"** (arriba derecha)
   - Click en **"Nueva implementación"**
   
4. **Configurar la Implementación:**
   - En "Tipo", seleccione: **⚙️ Aplicación web**
   - Configure:
     ```
     Descripción: PreViajes API v1
     Ejecutar como: Yo (su email)
     Quién tiene acceso: Cualquier persona
     ```
   - Click en **"Implementar"**

5. **Autorizar el Script (MUY IMPORTANTE):**
   - Aparecerá: "Autorización necesaria"
   - Click en **"Autorizar acceso"**
   - Seleccione su cuenta de Google
   - Verá: "Google no ha verificado esta aplicación"
   - Click en **"Configuración avanzada"**
   - Click en **"Ir a PreViajes (no seguro)"**
   - Click en **"Permitir"**

6. **Copiar la URL Correcta:**
   - Después de implementar, aparecerá una URL que termina en `/exec`
   - Ejemplo: `https://script.google.com/macros/s/AKfycby...xxx.../exec`
   - **¡COPIE ESTA URL!**

### 2️⃣ Actualizar la URL en app.js

Abra `app.js` y en la **línea 2** cambie:

```javascript
const SCRIPT_URL = 'PEGUE_AQUI_LA_URL_QUE_COPIO_EN_EL_PASO_ANTERIOR';
```

### 3️⃣ Probar la Conexión

1. **Refrescar la Página:**
   - Presione **Ctrl+Shift+R** para limpiar caché
   
2. **Abrir Consola del Navegador:**
   - Presione **F12**
   - Vaya a la pestaña **"Console"** (no Network)
   
3. **Debe Ver:**
   ```
   🔍 Probando conexión con Google Apps Script...
   📡 URL: https://script.google.com/macros/s/...
   ✅ Conexión exitosa con el servidor
   📊 Buses disponibles: 3
   ```

4. **Verificar en Network:**
   - Vaya a la pestaña **"Network"**
   - Las solicitudes deben mostrar **Status: 200** (no 302)

### 4️⃣ Si Sigue Dando Error 302

**Opción A: Probar la URL directamente**
```
https://TU_URL_DEL_SCRIPT/exec?action=getBuses
```
Ábrala en el navegador. Debe mostrar:
```json
{"success":true,"data":{"buses":[...]}}
```

**Opción B: Verificar permisos**
- En Google Apps Script, vaya a **Configuración** (⚙️)
- En "Permisos", asegúrese que dice: "Cualquier persona"

**Opción C: Crear implementación desde cero**
1. En Google Apps Script
2. Click en **"Implementar"** > **"Administrar implementaciones"**
3. Click en el ícono de **lápiz** (editar)
4. Cambie "Nueva versión" a **"Nueva versión"**
5. Click en **"Implementar"**
6. Copie la nueva URL

## Verificación Final

### ✅ Checklist

- [ ] Script actualizado en Google Apps Script
- [ ] Nueva implementación creada
- [ ] Autorizaciones otorgadas (paso de "no verificado")
- [ ] URL copiada (termina en `/exec`)
- [ ] URL actualizada en `app.js` línea 2
- [ ] Página refrescada con Ctrl+Shift+R
- [ ] Consola muestra "✅ Conexión exitosa"
- [ ] Network muestra Status 200 (no 302)

## URL Actual vs URL Correcta

❌ **Incorrecto (causa error 302):**
```
https://script.google.com/macros/s/AKfycby.../dev
https://script.google.com/home/projects/.../edit
```

✅ **Correcto:**
```
https://script.google.com/macros/s/AKfycby.../exec
```

## Siguiente Paso

Una vez que vea **Status 200** en Network:
1. Complete una inspección de prueba
2. Click en "Guardar Inspección"
3. Verifique en Google Sheets que se guardó

---

**💡 Nota:** El error 302 es MUY común y se resuelve con una implementación correcta del script.
