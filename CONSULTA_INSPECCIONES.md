# Consulta de Inspecciones Anteriores

## Funcionalidad Implementada

Se ha agregado un sistema completo para consultar y revisar inspecciones anteriores, permitiendo identificar hallazgos críticos y elementos pendientes.

## Características

### 1. Botón de Consulta en el Header
- Ubicado en la esquina superior derecha
- Acceso rápido desde cualquier parte de la aplicación
- Icono: 📋 Consultar Inspecciones

### 2. Filtros de Búsqueda

**Criterios disponibles:**
- **Bus:** Buscar por número interno o placa
- **Rango de fechas:** Desde/Hasta
- **Tipo de hallazgos:**
  - Todas las inspecciones
  - Solo con llantas críticas (<3mm)
  - Solo con elementos MALOS
  - Con hallazgos (cualquier problema)

### 3. Resultados de Inspecciones

**Cada resultado muestra:**
- 🚍 Número de bus y placa
- 📅 Fecha y hora de inspección
- 👤 Nombre del conductor
- 🛣️ Kilometraje
- 🔴 Cantidad de llantas críticas
- ⚠️ Cantidad de elementos MALOS
- ✅ Indicador si no hay hallazgos

### 4. Detalle de Inspección

**Al hacer clic en una inspección se muestra:**

**Información General:**
- Fecha completa
- Bus (número y placa)
- Conductor
- Kilometraje

**Llantas Críticas (si aplica):**
- Número de llanta
- Medidas: Externa, Media, Interna
- Indicador visual de cuál medida es crítica
- Valor mínimo resaltado en rojo

**Elementos MALOS (si aplica):**
- Lista de elementos con estado MALO
- Indicador visual para cada elemento

**Sin Hallazgos:**
- Mensaje de confirmación verde si todo está bien

## Uso

### Búsqueda Básica
1. Click en "📋 Consultar Inspecciones"
2. El sistema carga automáticamente el último mes
3. Click en "🔍 Buscar"

### Búsqueda Específica
1. Ingresar número de bus o placa
2. Ajustar rango de fechas si es necesario
3. Seleccionar tipo de hallazgo
4. Click en "🔍 Buscar"

### Ver Detalles
1. Click en cualquier inspección de la lista
2. Se abre modal con detalle completo
3. Revisar llantas críticas y elementos MALOS
4. Cerrar con ✕ o click fuera del modal

### Limpiar Filtros
- Click en "🔄 Limpiar Filtros"
- Restaura valores por defecto

## Integración con Google Apps Script

### Endpoint Requerido

El sistema realiza llamadas a:
```
GET ${SCRIPT_URL}?action=getInspecciones&bus={bus}&desde={fecha}&hasta={fecha}&hallazgos={tipo}
```

### Formato de Respuesta Esperado

```javascript
{
  "success": true,
  "inspecciones": [
    {
      "id": "INS001",
      "fecha": "2026-01-06T10:30:00",
      "numeroInterno": "101",
      "placa": "ABC123",
      "conductor": "Juan Pérez",
      "km": 150000,
      "llantasCriticas": 3,
      "elementosMalos": 2,
      "llantasDetalle": [
        {
          "numero": 5,
          "externa": 2.5,
          "media": 2.8,
          "interna": 2.2
        }
      ],
      "malosDetalle": ["Faldones", "Vidrios"]
    }
  ]
}
```

## Datos de Ejemplo

Mientras no esté conectado a Google Sheets, el sistema usa datos de ejemplo para demostrar la funcionalidad:

- **Bus 101 (ABC123):** 3 llantas críticas, 2 elementos MALOS
- **Bus 102 (DEF456):** 0 llantas críticas, 1 elemento MALO
- **Bus 101 (ABC123):** 1 llanta crítica, 0 elementos MALOS

## Diseño Responsive

- **Desktop:** Header con botón a la derecha
- **Tablet:** Layout adaptado
- **Mobile:** Botón de consulta ocupa ancho completo

## Colores y Badges

- 🔴 **Crítica:** Rojo (#dc2626) - Llantas <3mm
- ⚠️ **MALO:** Amarillo/Naranja (#92400e) - Elementos en mal estado
- ✅ **OK:** Verde (#065f46) - Sin problemas

## Ventajas

1. **Seguimiento:** Ver historial de cada bus
2. **Prevención:** Identificar problemas recurrentes
3. **Trazabilidad:** Saber cuándo apareció un problema
4. **Planificación:** Programar mantenimientos basados en hallazgos
5. **Auditoría:** Revisar inspecciones pasadas

## Próximos Pasos

Para producción, implementar en Google Apps Script:

1. Función `getInspecciones()` que filtre por criterios
2. Consulta a Google Sheets con filtros SQL
3. Formato de respuesta según estructura esperada
4. Paginación si hay muchos resultados
5. Export a PDF/Excel de inspecciones seleccionadas
