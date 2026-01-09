// ========================================
// GOOGLE APPS SCRIPT - PREVIAJES
// Sistema de Inspección Vehicular Alberto Ochoa
// ========================================

// IDs de configuración (DEBES REEMPLAZAR ESTOS)
const CONFIG = {
  SPREADSHEET_ID: '13_GJqiWhdjQlwfDXdP_kPWlOGSnmSc7YHfICMVGyDWU', // Google Sheet PreViajes
  FOLDER_ID: '1_9f_WJZDeKJutZzojKYnd4HzaiGLEeWh'       // Carpeta Drive para archivos
};

// Hojas del spreadsheet
const SHEETS = {
  INSPECCIONES: 'Inspecciones',
  VEHICULOS: 'Vehiculos',
  LLANTAS: 'Llantas'
};

// ========================================
// FUNCIÓN PRINCIPAL - Recibe GET y POST
// ========================================
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    switch(action) {
      case 'getBuses':
        return obtenerBuses();
      case 'getConductores':
        return obtenerConductores();
      case 'consultarInspecciones':
        return consultarInspecciones(e.parameter);
      case 'getInspecciones':
        return consultarInspeccionesGet(e.parameter);
      default:
        return respuestaExito({ mensaje: 'API PreViajes funcionando' });
    }
  } catch (error) {
    return respuestaError('Error GET: ' + error.message);
  }
}

function doPost(e) {
  try {
    // Parsear los datos recibidos
    let data;
    
    // Intentar parsear el contenido
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      return respuestaError('No se recibieron datos');
    }
    
    const action = data.action;
    
    switch(action) {
      case 'guardarInspeccion':
        return guardarInspeccion(data);
      case 'consultarInspecciones':
        return consultarInspecciones(data);
      case 'obtenerDetalleInspeccion':
        return obtenerDetalleInspeccion(data);
      default:
        return respuestaError('Acción no válida: ' + action);
    }
  } catch (error) {
    Logger.log('Error en doPost: ' + error.message);
    Logger.log('Stack: ' + error.stack);
    return respuestaError('Error en el servidor: ' + error.message);
  }
}

// ========================================
// GUARDAR INSPECCIÓN COMPLETA
// ========================================
function guardarInspeccion(data) {
  try {
    Logger.log('=== Iniciando guardarInspeccion ===');
    Logger.log('Datos recibidos: ' + JSON.stringify(data));
    
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const timestamp = new Date();
    const idInspeccion = generarIdInspeccion();
    
    Logger.log('ID Inspección generado: ' + idInspeccion);
    
    // 1. Guardar datos generales de la inspección
    const sheetInspecciones = obtenerOCrearHoja(ss, SHEETS.INSPECCIONES);
    
    const datosGenerales = [
      idInspeccion,
      timestamp,
      data.placa || '',
      data.numeroInterno || '',
      data.tipoVehiculo || 'Bus',
      data.odometro || 0,
      data.inspector || 'Inspector',
      data.estadoGeneral || 'Aprobado',
      JSON.stringify(data.carroceria || {}),
      JSON.stringify(data.mecanico || {}),
      JSON.stringify(data.luces || {}),
      JSON.stringify(data.seguridad || {}),
      JSON.stringify(data.vidrios || {}),
      data.observaciones || '',
      data.firmaUrl || ''
    ];
    
    Logger.log('Guardando fila en hoja Inspecciones...');
    sheetInspecciones.appendRow(datosGenerales);
    Logger.log('Fila guardada exitosamente');
    
    // 2. Guardar datos de llantas (si existen)
    if (data.llantas && data.llantas.length > 0) {
      Logger.log('Guardando ' + data.llantas.length + ' llantas...');
      const sheetLlantas = obtenerOCrearHoja(ss, SHEETS.LLANTAS);
      data.llantas.forEach(llanta => {
        const posicion = llanta.posicion || llanta.numero || '';
        Logger.log('Guardando llanta posición: ' + posicion);
        const datosLlanta = [
          idInspeccion,
          timestamp,
          data.placa || '',
          posicion,
          llanta.externa || 0,
          llanta.media || 0,
          llanta.interna || 0,
          llanta.promedio || 0,
          llanta.estado || '',
          llanta.critica ? 'SI' : 'NO',
          llanta.evidenciaUrls ? llanta.evidenciaUrls.join(', ') : ''
        ];
        sheetLlantas.appendRow(datosLlanta);
      });
      Logger.log('Llantas guardadas exitosamente');
    }
    
    // 3. Guardar archivos en Drive (fotos, firma)
    if (data.archivos && data.archivos.length > 0) {
      Logger.log('Guardando ' + data.archivos.length + ' archivos...');
      guardarArchivosEnDrive(idInspeccion, data.archivos);
    }
    
    Logger.log('=== Inspección guardada exitosamente ===');
    
    return respuestaExito({
      mensaje: 'Inspección guardada exitosamente',
      idInspeccion: idInspeccion,
      timestamp: timestamp.toISOString()
    });
    
  } catch (error) {
    Logger.log('ERROR en guardarInspeccion: ' + error.message);
    Logger.log('Stack: ' + error.stack);
    return respuestaError('Error al guardar inspección: ' + error.message);
  }
}
          llanta.media,
          llanta.interna,
          llanta.promedio,
          llanta.estado,
          llanta.critica ? 'SI' : 'NO',
          llanta.evidenciaUrls ? llanta.evidenciaUrls.join(', ') : ''
        ];
        sheetLlantas.appendRow(datosLlanta);
      });
    }
    
    // 3. Guardar archivos en Drive (fotos, firma)
    if (data.archivos && data.archivos.length > 0) {
      guardarArchivosEnDrive(idInspeccion, data.archivos);
    }
    
    return respuestaExito({
      mensaje: 'Inspección guardada exitosamente',
      idInspeccion: idInspeccion,
      timestamp: timestamp.toISOString()
    });
    
  } catch (error) {
    return respuestaError('Error al guardar inspección: ' + error.message);
  }
}

// ========================================
// CONSULTAR INSPECCIONES
// ========================================
function consultarInspecciones(data) {
  try {
    Logger.log('=== Consultando inspecciones ===');
    Logger.log('Filtros: ' + JSON.stringify(data));
    
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheetInspecciones = ss.getSheetByName(SHEETS.INSPECCIONES);
    const sheetLlantas = ss.getSheetByName(SHEETS.LLANTAS);
    
    if (!sheetInspecciones) {
      Logger.log('No existe la hoja de Inspecciones');
      return respuestaExito({ inspecciones: [] });
    }
    
    const datosInsp = sheetInspecciones.getDataRange().getValues();
    if (datosInsp.length <= 1) {
      Logger.log('No hay inspecciones registradas');
      return respuestaExito({ inspecciones: [] });
    }
    
    const headers = datosInsp[0];
    const filas = datosInsp.slice(1);
    
    // Obtener datos de llantas si existe la hoja
    const datosLlantas = sheetLlantas ? sheetLlantas.getDataRange().getValues() : [];
    
    // Mapear inspecciones con sus detalles
    let inspeccionesFiltradas = filas.map(fila => {
      const idInspeccion = fila[0];
      const carroceria = JSON.parse(fila[8] || '{}');
      const mecanico = JSON.parse(fila[9] || '{}');
      const luces = JSON.parse(fila[10] || '{}');
      const seguridad = JSON.parse(fila[11] || '{}');
      const vidrios = JSON.parse(fila[12] || '{}');
      
      // Obtener llantas de esta inspección
      const llantasInspeccion = datosLlantas
        .filter(llanta => llanta[0] === idInspeccion)
        .map(llanta => ({
          numero: llanta[3],
          externa: llanta[4],
          media: llanta[5],
          interna: llanta[6],
          promedio: llanta[7],
          estado: llanta[8]
        }));
      
      // Contar llantas críticas (promedio < 3mm)
      const llantasCriticas = llantasInspeccion.filter(l => 
        Math.min(l.externa, l.media, l.interna) < 3
      ).length;
      
      // Contar elementos MALOS
      let elementosMalos = 0;
      let malosDetalle = [];
      
      // Revisar cada categoría
      Object.entries({...carroceria, ...mecanico, ...luces, ...seguridad, ...vidrios}).forEach(([key, value]) => {
        if (value === 'MALO') {
          elementosMalos++;
          malosDetalle.push(key);
        }
      });
      
      return {
        id: idInspeccion,
        fecha: fila[1],
        placa: fila[2],
        numeroInterno: fila[3],
        tipoVehiculo: fila[4],
        odometro: fila[5],
        inspector: fila[6],
        estadoGeneral: fila[7],
        llantasCriticas: llantasCriticas,
        elementosMalos: elementosMalos,
        llantasDetalle: llantasInspeccion.filter(l => Math.min(l.externa, l.media, l.interna) < 3),
        malosDetalle: malosDetalle
      };
    });
    
    // Aplicar filtros
    if (data.placa) {
      inspeccionesFiltradas = inspeccionesFiltradas.filter(
        insp => insp.placa.toUpperCase().includes(data.placa.toUpperCase()) ||
                insp.numeroInterno.includes(data.placa)
      );
    }
    
    if (data.fechaInicio) {
      const fechaInicio = new Date(data.fechaInicio);
      inspeccionesFiltradas = inspeccionesFiltradas.filter(
        insp => new Date(insp.fecha) >= fechaInicio
      );
    }
    
    if (data.fechaFin) {
      const fechaFin = new Date(data.fechaFin);
      fechaFin.setHours(23, 59, 59);
      inspeccionesFiltradas = inspeccionesFiltradas.filter(
        insp => new Date(insp.fecha) <= fechaFin
      );
    }
    
    // Filtrar por tipo de hallazgos
    if (data.estado && data.estado !== 'todas') {
      if (data.estado === 'criticas') {
        inspeccionesFiltradas = inspeccionesFiltradas.filter(i => i.llantasCriticas > 0);
      } else if (data.estado === 'malos') {
        inspeccionesFiltradas = inspeccionesFiltradas.filter(i => i.elementosMalos > 0);
      } else if (data.estado === 'hallazgos') {
        inspeccionesFiltradas = inspeccionesFiltradas.filter(i => i.llantasCriticas > 0 || i.elementosMalos > 0);
      }
    }
    
    // Ordenar por fecha descendente
    inspeccionesFiltradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    Logger.log('Inspecciones encontradas: ' + inspeccionesFiltradas.length);
    
    return respuestaExito({ inspecciones: inspeccionesFiltradas });
    
  } catch (error) {
    Logger.log('ERROR en consultarInspecciones: ' + error.message);
    return respuestaError('Error al consultar inspecciones: ' + error.message);
  }
}

// ========================================
// OBTENER DETALLE DE INSPECCIÓN
// ========================================
function obtenerDetalleInspeccion(data) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheetInspecciones = ss.getSheetByName(SHEETS.INSPECCIONES);
    const sheetLlantas = ss.getSheetByName(SHEETS.LLANTAS);
    
    // Buscar inspección por ID
    const datosInsp = sheetInspecciones.getDataRange().getValues();
    const inspeccion = datosInsp.find(fila => fila[0] === data.idInspeccion);
    
    if (!inspeccion) {
      return respuestaError('Inspección no encontrada');
    }
    
    // Obtener llantas
    const datosLlantas = sheetLlantas ? sheetLlantas.getDataRange().getValues() : [];
    const llantasInspeccion = datosLlantas.filter(fila => fila[0] === data.idInspeccion).slice(1);
    
    const detalle = {
      id: inspeccion[0],
      fecha: inspeccion[1],
      placa: inspeccion[2],
      numeroInterno: inspeccion[3],
      tipoVehiculo: inspeccion[4],
      odometro: inspeccion[5],
      inspector: inspeccion[6],
      estadoGeneral: inspeccion[7],
      carroceria: JSON.parse(inspeccion[8] || '{}'),
      mecanico: JSON.parse(inspeccion[9] || '{}'),
      luces: JSON.parse(inspeccion[10] || '{}'),
      seguridad: JSON.parse(inspeccion[11] || '{}'),
      vidrios: JSON.parse(inspeccion[12] || '{}'),
      observaciones: inspeccion[13],
      firmaUrl: inspeccion[14],
      llantas: llantasInspeccion.map(ll => ({
        posicion: ll[3],
        externa: ll[4],
        media: ll[5],
        interna: ll[6],
        promedio: ll[7],
        estado: ll[8],
        critica: ll[9] === 'SI',
        evidenciaUrls: ll[10] ? ll[10].split(', ') : []
      }))
    };
    
    return respuestaExito({ inspeccion: detalle });
    
  } catch (error) {
    return respuestaError('Error al obtener detalle: ' + error.message);
  }
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

function generarIdInspeccion() {
  const fecha = new Date();
  const timestamp = fecha.getTime();
  const random = Math.floor(Math.random() * 1000);
  return `INS-${timestamp}-${random}`;
}

function obtenerOCrearHoja(ss, nombreHoja) {
  let sheet = ss.getSheetByName(nombreHoja);
  
  if (!sheet) {
    sheet = ss.insertSheet(nombreHoja);
    
    // Crear headers según el tipo de hoja
    if (nombreHoja === SHEETS.INSPECCIONES) {
      sheet.appendRow([
        'ID Inspección', 'Fecha', 'Placa', 'Número Interno', 'Tipo Vehículo',
        'Odómetro', 'Inspector', 'Estado General', 'Carrocería (JSON)',
        'Mecánico (JSON)', 'Luces (JSON)', 'Seguridad (JSON)', 'Vidrios (JSON)',
        'Observaciones', 'URL Firma'
      ]);
      sheet.getRange(1, 1, 1, 15).setFontWeight('bold').setBackground('#dc2626').setFontColor('#ffffff');
    } else if (nombreHoja === SHEETS.LLANTAS) {
      sheet.appendRow([
        'ID Inspección', 'Fecha', 'Placa', 'Posición', 'Medida Externa',
        'Medida Media', 'Medida Interna', 'Promedio', 'Estado', 'Crítica',
        'URLs Evidencias'
      ]);
      sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#dc2626').setFontColor('#ffffff');
    } else if (nombreHoja === SHEETS.VEHICULOS) {
      sheet.appendRow(['Número Interno', 'Placa', 'Tipo', 'Modelo', 'Estado']);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#dc2626').setFontColor('#ffffff');
    }
  }
  
  return sheet;
}

function guardarArchivosEnDrive(idInspeccion, archivos) {
  try {
    const folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
    const carpetaInspeccion = folder.createFolder(idInspeccion);
    
    archivos.forEach(archivo => {
      const blob = Utilities.newBlob(
        Utilities.base64Decode(archivo.data),
        archivo.mimeType,
        archivo.nombre
      );
      carpetaInspeccion.createFile(blob);
    });
    
    return carpetaInspeccion.getUrl();
  } catch (error) {
    Logger.log('Error al guardar archivos: ' + error.message);
    return null;
  }
}

function respuestaExito(data) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function respuestaError(mensaje) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: false, error: mensaje }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========================================
// OBTENER LISTA DE BUSES
// ========================================
function obtenerBuses() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = obtenerOCrearHoja(ss, SHEETS.VEHICULOS);
    const datos = sheet.getDataRange().getValues();
    
    if (datos.length <= 1) {
      // Si no hay datos, crear algunos de ejemplo
      const busesEjemplo = [
        ['2417', 'NNZ426', 'Bus Interprovincial', 'Mercedes-Benz O500', 'Activo'],
        ['2960', 'TRN123', 'Bus Urbano', 'Volvo B290R', 'Activo'],
        ['3105', 'ABC456', 'Bus Interprovincial', 'Scania K380', 'Activo']
      ];
      busesEjemplo.forEach(bus => sheet.appendRow(bus));
      return respuestaExito({ buses: busesEjemplo.map(b => ({ numeroInterno: b[0], placa: b[1], tipo: b[2] })) });
    }
    
    const buses = datos.slice(1).map(fila => ({
      numeroInterno: fila[0],
      placa: fila[1],
      tipo: fila[2],
      modelo: fila[3],
      estado: fila[4]
    }));
    
    return respuestaExito({ buses: buses });
  } catch (error) {
    return respuestaError('Error al obtener buses: ' + error.message);
  }
}

// ========================================
// OBTENER LISTA DE CONDUCTORES
// ========================================
function obtenerConductores() {
  try {
    // Por ahora retornamos lista fija
    // Podrías crear una hoja "Conductores" si lo necesitas
    const conductores = [
      { nombre: 'Juan Pérez', licencia: 'A-IIb' },
      { nombre: 'María González', licencia: 'A-IIb' },
      { nombre: 'Carlos Rodríguez', licencia: 'A-IIb' },
      { nombre: 'Ana Martínez', licencia: 'A-IIb' }
    ];
    
    return respuestaExito({ conductores: conductores });
  } catch (error) {
    return respuestaError('Error al obtener conductores: ' + error.message);
  }
}

// ========================================
// CONSULTAR INSPECCIONES (GET)
// ========================================
function consultarInspeccionesGet(params) {
  const data = {
    placa: params.bus || '',
    fechaInicio: params.desde || '',
    fechaFin: params.hasta || '',
    estado: params.hallazgos || ''
  };
  return consultarInspecciones(data);
}

// ========================================
// FUNCIÓN PARA PROBAR (ejecutar manualmente)
// ========================================
function testCrearHojas() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  obtenerOCrearHoja(ss, SHEETS.INSPECCIONES);
  obtenerOCrearHoja(ss, SHEETS.LLANTAS);
  obtenerOCrearHoja(ss, SHEETS.VEHICULOS);
  Logger.log('Hojas creadas exitosamente');
}
