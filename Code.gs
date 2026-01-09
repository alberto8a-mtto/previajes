// ============================================
// GOOGLE APPS SCRIPT PARA ALMACENAR EN DRIVE
// ============================================
// 
// INSTRUCCIONES DE INSTALACIÓN:
// 1. Ir a https://script.google.com
// 2. Crear un nuevo proyecto
// 3. Copiar este código completo
// 4. Configurar las variables SPREADSHEET_ID y FOLDER_ID
// 5. Implementar como Web App
// 6. Copiar la URL y pegarla en app.js

// ============================================
// CONFIGURACIÓN
// ============================================

// ID de tu Google Spreadsheet (obtenerlo de la URL)
// https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI';

// ID de la carpeta de Google Drive donde guardar archivos (opcional)
const FOLDER_ID = 'TU_FOLDER_ID_AQUI'; // Obtenerlo de la URL de la carpeta

// Nombres de las hojas
const HOJA_INSPECCIONES = 'Inspecciones';
const HOJA_LLANTAS = 'Detalle_Llantas';
const HOJA_BUSES = 'Buses';

// ============================================
// FUNCIÓN PRINCIPAL - PROCESAR PETICIONES
// ============================================

function doGet(e) {
  try {
    const action = e.parameter.action;
    
    switch(action) {
      case 'getBuses':
        return getBuses();
      default:
        return respuestaJSON({ success: false, error: 'Acción no válida' });
    }
  } catch (error) {
    return respuestaJSON({ success: false, error: error.toString() });
  }
}

function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    return guardarInspeccion(datos);
  } catch (error) {
    Logger.log('Error en doPost: ' + error);
    return respuestaJSON({ success: false, error: error.toString() });
  }
}

// ============================================
// OBTENER LISTA DE BUSES
// ============================================

function getBuses() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let hoja = ss.getSheetByName(HOJA_BUSES);
    
    // Si la hoja no existe, crearla con datos de ejemplo
    if (!hoja) {
      hoja = crearHojaBuses(ss);
    }
    
    const datos = hoja.getDataRange().getValues();
    const buses = [];
    
    // Saltar la primera fila (encabezados)
    for (let i = 1; i < datos.length; i++) {
      if (datos[i][0]) { // Si tiene número interno
        buses.push({
          numeroInterno: datos[i][0].toString(),
          placa: datos[i][1].toString(),
          modelo: datos[i][2] || '',
          estado: datos[i][3] || 'Activo'
        });
      }
    }
    
    return respuestaJSON({ success: true, buses: buses });
  } catch (error) {
    return respuestaJSON({ success: false, error: error.toString() });
  }
}

// ============================================
// GUARDAR INSPECCIÓN
// ============================================

function guardarInspeccion(datos) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Crear hojas si no existen
    let hojaInspecciones = ss.getSheetByName(HOJA_INSPECCIONES);
    if (!hojaInspecciones) {
      hojaInspecciones = crearHojaInspecciones(ss);
    }
    
    let hojaLlantas = ss.getSheetByName(HOJA_LLANTAS);
    if (!hojaLlantas) {
      hojaLlantas = crearHojaLlantas(ss);
    }
    
    // Generar ID único para la inspección
    const idInspeccion = Utilities.getUuid();
    const fechaRegistro = new Date();
    
    // Calcular estadísticas
    const estadisticas = calcularEstadisticas(datos.llantas);
    
    // Guardar en hoja de Inspecciones
    const filaInspeccion = [
      idInspeccion,
      datos.fecha,
      fechaRegistro,
      datos.numeroInterno,
      datos.placa,
      datos.tecnico,
      datos.llantas.length,
      estadisticas.criticas,
      estadisticas.regulares,
      estadisticas.buenas,
      estadisticas.promedioGeneral,
      datos.observacionesGenerales || ''
    ];
    
    hojaInspecciones.appendRow(filaInspeccion);
    
    // Guardar detalle de cada llanta
    datos.llantas.forEach(llanta => {
      const filaLlanta = [
        Utilities.getUuid(), // ID único de la llanta
        idInspeccion,
        datos.fecha,
        datos.numeroInterno,
        llanta.numero,
        llanta.externa,
        llanta.media,
        llanta.interna,
        llanta.promedio,
        llanta.estado
      ];
      
      hojaLlantas.appendRow(filaLlanta);
    });
    
    // Opcional: Crear archivo PDF en Drive
    if (FOLDER_ID && FOLDER_ID !== 'TU_FOLDER_ID_AQUI') {
      crearPDFenDrive(datos, idInspeccion, estadisticas);
    }
    
    return respuestaJSON({ 
      success: true, 
      message: 'Inspección guardada correctamente',
      idInspeccion: idInspeccion 
    });
    
  } catch (error) {
    Logger.log('Error al guardar inspección: ' + error);
    return respuestaJSON({ success: false, error: error.toString() });
  }
}

// ============================================
// CALCULAR ESTADÍSTICAS
// ============================================

function calcularEstadisticas(llantas) {
  let criticas = 0;
  let regulares = 0;
  let buenas = 0;
  let sumaPromedios = 0;
  
  llantas.forEach(llanta => {
    sumaPromedios += parseFloat(llanta.promedio);
    
    switch(llanta.estado) {
      case 'Crítica':
        criticas++;
        break;
      case 'Regular':
        regulares++;
        break;
      case 'Buena':
        buenas++;
        break;
    }
  });
  
  const promedioGeneral = llantas.length > 0 ? (sumaPromedios / llantas.length).toFixed(2) : 0;
  
  return {
    criticas: criticas,
    regulares: regulares,
    buenas: buenas,
    promedioGeneral: promedioGeneral
  };
}

// ============================================
// CREAR HOJAS SI NO EXISTEN
// ============================================

function crearHojaInspecciones(ss) {
  const hoja = ss.insertSheet(HOJA_INSPECCIONES);
  const encabezados = [
    'ID Inspección',
    'Fecha Inspección',
    'Fecha Registro',
    'Número Interno',
    'Placa',
    'Técnico',
    'Llantas Inspeccionadas',
    'Llantas Críticas',
    'Llantas Regulares',
    'Llantas Buenas',
    'Promedio General (mm)',
    'Observaciones'
  ];
  
  hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]);
  hoja.getRange(1, 1, 1, encabezados.length).setFontWeight('bold');
  hoja.getRange(1, 1, 1, encabezados.length).setBackground('#4285f4');
  hoja.getRange(1, 1, 1, encabezados.length).setFontColor('white');
  hoja.setFrozenRows(1);
  
  return hoja;
}

function crearHojaLlantas(ss) {
  const hoja = ss.insertSheet(HOJA_LLANTAS);
  const encabezados = [
    'ID Llanta',
    'ID Inspección',
    'Fecha',
    'Número Interno',
    'Número Llanta',
    'Profundidad Externa (mm)',
    'Profundidad Media (mm)',
    'Profundidad Interna (mm)',
    'Promedio (mm)',
    'Estado'
  ];
  
  hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]);
  hoja.getRange(1, 1, 1, encabezados.length).setFontWeight('bold');
  hoja.getRange(1, 1, 1, encabezados.length).setBackground('#34a853');
  hoja.getRange(1, 1, 1, encabezados.length).setFontColor('white');
  hoja.setFrozenRows(1);
  
  return hoja;
}

function crearHojaBuses(ss) {
  const hoja = ss.insertSheet(HOJA_BUSES);
  const encabezados = ['Numero Interno', 'Placa', 'Modelo', 'Estado'];
  
  hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]);
  hoja.getRange(1, 1, 1, encabezados.length).setFontWeight('bold');
  hoja.getRange(1, 1, 1, encabezados.length).setBackground('#fbbc04');
  hoja.getRange(1, 1, 1, encabezados.length).setFontColor('white');
  
  // Datos de ejemplo
  const datosEjemplo = [
    ['2417', 'NNZ426', 'Mercedes-Benz O500', 'Activo'],
    ['2960', 'TRN123', 'Volvo B290R', 'Activo'],
    ['3105', 'ABC456', 'Scania K380', 'Activo']
  ];
  
  hoja.getRange(2, 1, datosEjemplo.length, 4).setValues(datosEjemplo);
  hoja.setFrozenRows(1);
  
  return hoja;
}

// ============================================
// CREAR PDF EN DRIVE (OPCIONAL)
// ============================================

function crearPDFenDrive(datos, idInspeccion, estadisticas) {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    
    // Crear contenido HTML para el PDF
    let html = `
      <h1>Reporte de Inspección de Llantas</h1>
      <p><strong>ID Inspección:</strong> ${idInspeccion}</p>
      <p><strong>Fecha:</strong> ${datos.fecha}</p>
      <p><strong>Bus:</strong> ${datos.numeroInterno} - ${datos.placa}</p>
      <p><strong>Técnico:</strong> ${datos.tecnico}</p>
      
      <h2>Resumen</h2>
      <p>🔴 Llantas Críticas: ${estadisticas.criticas}</p>
      <p>🟡 Llantas Regulares: ${estadisticas.regulares}</p>
      <p>🟢 Llantas Buenas: ${estadisticas.buenas}</p>
      <p><strong>Promedio General: ${estadisticas.promedioGeneral} mm</strong></p>
      
      <h2>Detalle de Llantas</h2>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr>
          <th>Llanta #</th>
          <th>Externa</th>
          <th>Media</th>
          <th>Interna</th>
          <th>Promedio</th>
          <th>Estado</th>
        </tr>
    `;
    
    datos.llantas.forEach(llanta => {
      html += `
        <tr>
          <td>${llanta.numero}</td>
          <td>${llanta.externa}</td>
          <td>${llanta.media}</td>
          <td>${llanta.interna}</td>
          <td>${llanta.promedio}</td>
          <td>${llanta.estado}</td>
        </tr>
      `;
    });
    
    html += '</table>';
    
    if (datos.observacionesGenerales) {
      html += `<h2>Observaciones</h2><p>${datos.observacionesGenerales}</p>`;
    }
    
    // Crear el archivo PDF
    const blob = Utilities.newBlob(html, 'text/html', 'temp.html')
      .getAs('application/pdf');
    
    const nombreArchivo = `Inspeccion_${datos.numeroInterno}_${datos.fecha}.pdf`;
    folder.createFile(blob.setName(nombreArchivo));
    
    Logger.log('PDF creado exitosamente: ' + nombreArchivo);
  } catch (error) {
    Logger.log('Error al crear PDF: ' + error);
  }
}

// ============================================
// FUNCIÓN AUXILIAR PARA RESPUESTAS JSON
// ============================================

function respuestaJSON(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// FUNCIÓN DE PRUEBA
// ============================================

function testGuardarInspeccion() {
  const datosTest = {
    fecha: '2026-01-08',
    numeroInterno: '2417',
    placa: 'NNZ426',
    tecnico: 'Juan Pérez',
    observacionesGenerales: 'Inspección de rutina',
    llantas: [
      {
        numero: 1,
        externa: 7.5,
        media: 7.2,
        interna: 6.8,
        promedio: '7.17',
        estado: 'Buena'
      },
      {
        numero: 2,
        externa: 2.5,
        media: 2.8,
        interna: 2.3,
        promedio: '2.53',
        estado: 'Crítica'
      }
    ]
  };
  
  const resultado = guardarInspeccion(datosTest);
  Logger.log(resultado.getContent());
}
