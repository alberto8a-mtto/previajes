# Validación de Evidencias Fotográficas en Módulo Carrocería

## Funcionalidad Implementada

El módulo de Carrocería ahora requiere **evidencia fotográfica obligatoria** cuando se reporta algún elemento como MALO.

## Cómo Funciona

### 1. Detección Automática de MALO
Cuando el inspector selecciona "❌ MALO" en cualquiera de los siguientes campos:
- Faldones
- Vidrios
- Espejos

El sistema automáticamente:
- Muestra un mensaje de advertencia amarillo
- Marca el campo de evidencias como **(OBLIGATORIO)** en rojo
- Cambia el color del label a rojo

### 2. Validación al Guardar
Cuando se intenta guardar el módulo:
- Si hay algún elemento MALO **Y** no se han adjuntado fotos → **BLOQUEA** el guardado
- Muestra mensaje: "❌ Debe adjuntar evidencia fotográfica de los elementos MALOS"
- Resalta el campo de evidencias en rojo y hace scroll automático
- El módulo NO se marca como completado

### 3. Vista Previa de Fotos
Al seleccionar fotos:
- Se muestran miniaturas de cada imagen
- Nombre del archivo debajo de cada foto
- Botón "🗑️ Eliminar" para quitar fotos individuales
- Actualización automática del estado de validación

### 4. Cambio Dinámico
Si el inspector:
- Cambia un elemento de MALO a BUENO → La validación se recalcula
- Cambia todos los elementos a BUENO → Las fotos se vuelven opcionales
- Agrega fotos → Se revalida automáticamente

## Archivos Modificados

### app.js
- `configurarCarroceria()`: Inicializa event listeners
- `validarCarroceriaNOK()`: Detecta MALO y actualiza UI
- `mostrarPreviewCarroceria()`: Muestra miniaturas de fotos
- `eliminarEvidenciaCarroceria(index)`: Elimina foto individual
- `guardarModulo()`: Validación especial para carrocería

### index.html
- Agregado `class="carroceria-select"` a los 3 selects
- `<p id="carroceriaInfoNOK">`: Mensaje de advertencia
- `<span id="carroceriaEvidenciaRequerida">`: Label (OBLIGATORIO)
- `<input id="evidenciasCarroceria">`: Campo de fotos
- `<div id="previewEvidenciasCarroceria">`: Container de previews

### styles.css
- Estilos para mensaje de advertencia (#carroceriaInfoNOK)
- Estilos para label obligatorio (#carroceriaEvidenciaRequerida)
- Estilos existentes para preview-container y preview-item

## Variables Globales

```javascript
let evidenciasCarroceria = []; // Array de archivos File
```

## Flujo de Usuario

1. Inspector abre módulo Carrocería
2. Selecciona estado para Faldones, Vidrios, Espejos
3. Si alguno es MALO:
   - Aparece advertencia amarilla
   - Campo de fotos se marca como OBLIGATORIO
4. Inspector toma/adjunta fotos
5. Ve preview de las fotos
6. Intenta guardar:
   - ✅ Si hay MALO con fotos → Guardado exitoso
   - ✅ Si todos BUENO (con o sin fotos) → Guardado exitoso
   - ❌ Si hay MALO sin fotos → Bloqueado con error

## Pruebas Recomendadas

1. Marcar Faldones como MALO → Verificar que aparece advertencia
2. Intentar guardar sin fotos → Verificar que bloquea
3. Adjuntar 2 fotos → Verificar previews
4. Eliminar 1 foto → Verificar que queda 1 preview
5. Cambiar todos a BUENO → Verificar que advertencia desaparece
6. Guardar con todos BUENO sin fotos → Verificar guardado exitoso
7. Marcar MALO + adjuntar fotos + guardar → Verificar guardado exitoso
