# Solución: Error al Guardar Inspecciones

## Cambios Realizados

He corregido varios problemas que impedían guardar las inspecciones:

### 1. **Problema de CORS** ❌
- **Antes:** Se usaba `mode: 'no-cors'` que bloquea la respuesta del servidor
- **Ahora:** Se envía correctamente con `Content-Type: text/plain` para evitar preflight CORS

### 2. **Estructura de Datos Incorrecta** ❌
- **Antes:** Los datos no coincidían con lo que esperaba Google Apps Script
- **Ahora:** Se envía un objeto con la estructura correcta:
  - `action: 'guardarInspeccion'`
  - Datos organizados por categorías (carroceria, mecanico, luces, etc.)
  - Llantas en formato de array con todos los campos necesarios

### 3. **Manejo de Errores Mejorado** ✅
- Se agregaron logs detallados en Google Apps Script
- Mejor manejo de excepciones
- Mensajes de error más descriptivos

## Pasos para Verificar

### 1. Actualizar el Google Apps Script

Copie el contenido de `google-apps-script.js` y:

1. Vaya a [script.google.com](https://script.google.com)
2. Abra su proyecto "PreViajes"
3. Pegue el código actualizado
4. Haga clic en **Guardar** (💾)
5. Haga clic en **Implementar** > **Nueva implementación**
6. Seleccione **Aplicación web**
7. Configure:
   - **Ejecutar como:** Yo
   - **Quién tiene acceso:** Cualquier persona
8. Haga clic en **Implementar**
9. **IMPORTANTE:** Copie la nueva URL y actualícela en `app.js` (línea 2)

### 2. Probar la Conexión

Abra la consola del navegador (F12) y ejecute:

```javascript
fetch('TU_URL_DE_SCRIPT_AQUI?action=getBuses')
  .then(r => r.json())
  .then(d => console.log('Conexión OK:', d))
  .catch(e => console.error('Error:', e));
```

Debería ver: `Conexión OK: {success: true, data: {...}}`

### 3. Probar Guardado

1. Complete una inspección de prueba
2. Abra la consola del navegador (F12)
3. Al hacer clic en "Guardar", observe los logs:
   - "Enviando datos:" - muestra qué se está enviando
   - "Respuesta del servidor:" - muestra la respuesta

### 4. Verificar en Google Sheets

1. Abra su Google Sheet: [PreViajes](https://docs.google.com/spreadsheets/d/13_GJqiWhdjQlwfDXdP_kPWlOGSnmSc7YHfICMVGyDWU)
2. Debería tener 3 hojas:
   - **Inspecciones:** Datos generales
   - **Llantas:** Detalle de cada llanta
   - **Vehiculos:** Listado de buses

### 5. Revisar Logs de Google Apps Script

Si sigue habiendo problemas:

1. Vaya a [script.google.com](https://script.google.com)
2. Abra su proyecto
3. Haga clic en **Ejecuciones** (⚡) en el menú izquierdo
4. Revise los logs de las ejecuciones recientes

## Mensajes de Error Comunes

### "Error al guardar. Verifique su conexión"
- ✅ Verifique que la URL del script esté actualizada
- ✅ Verifique que el script esté implementado como "Cualquier persona"
- ✅ Revise la consola del navegador para más detalles

### "Acción no válida"
- ✅ Asegúrese de que `action: 'guardarInspeccion'` esté en los datos
- ✅ Verifique que el código de Google Apps Script esté actualizado

### "Error al guardar inspección: ..."
- ✅ Revise los logs en Google Apps Script
- ✅ Verifique que el SPREADSHEET_ID sea correcto
- ✅ Asegúrese de tener permisos en la hoja

## Estructura de Datos Enviada

```javascript
{
  action: 'guardarInspeccion',
  placa: 'ABC123',
  numeroInterno: '2417',
  tipoVehiculo: 'Bus',
  odometro: 125000,
  inspector: 'Inspector PreViajes',
  estadoGeneral: 'Aprobado' | 'Requiere Atención',
  
  llantas: [
    {
      numero: 1,
      externa: 5.5,
      media: 6.0,
      interna: 5.8,
      promedio: '5.77',
      estado: 'Buena' | 'Regular' | 'Crítica'
    },
    // ... más llantas
  ],
  
  carroceria: {
    faldones: 'BUENO' | 'REGULAR' | 'MALO',
    vidrios: 'BUENO' | 'REGULAR' | 'MALO',
    espejos: 'BUENO' | 'REGULAR' | 'MALO'
  },
  
  mecanico: {
    lucesMedias: 'BUENO' | 'REGULAR' | 'MALO',
    lucesAltas: 'BUENO' | 'REGULAR' | 'MALO',
    // ... más elementos
  },
  
  luces: { /* cintas y emblemas */ },
  seguridad: { /* extintores, tomas */ },
  vidrios: { /* documentación */ },
  
  observaciones: 'Texto libre...',
  firmaUrl: 'data:image/png;base64,...'
}
```

## Próximos Pasos

Si todo funciona correctamente:
- ✅ Las inspecciones se guardarán en Google Sheets
- ✅ Podrá consultarlas desde la aplicación
- ✅ Los datos quedarán respaldados automáticamente

## Soporte

Si persisten los problemas, revise:
1. Consola del navegador (F12)
2. Logs de Google Apps Script
3. Permisos en Google Sheets
4. URL del script actualizada
