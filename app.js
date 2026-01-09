// Configuración de Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxO2QkIUGFS8XHgn8Ttj_kLVmz8JLRkbFH0pSMgqlvqVNpym5YPB0nOOsREmQtebHG2/exec'; // Nueva implementación

// Base de datos
let busesDB = [];
let conductoresDB = [];

// Canvas para firmas
let firmaConductorCanvas, firmaConductorCtx;
let firmaInspectorCanvas, firmaInspectorCtx;
let firmandoConductor = false;
let firmandoInspector = false;

// Evidencias fotográficas
let evidenciasFiles = [];

// Estado de los módulos
let modulosCompletados = {
    llantas: false,
    carroceria: false,
    luces: false,
    senalizacion: false,
    seguridad: false,
    documentacion: false
};

// Módulo actual abierto
let moduloActual = null;

// Evidencias por módulo
let evidenciasCarroceria = [];
let evidenciasLlantas = {}; // {numeroLlanta: [File, File, ...]}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    inicializarFecha();
    cargarBuses();
    cargarConductores();
    configurarEventos();
    actualizarBarraProgreso();
    generarLlantas24();
    configurarCarroceria();
    
    // Prueba de conectividad con el servidor
    probarConexion();
});

// Probar conexión con Google Apps Script
async function probarConexion() {
    try {
        console.log('🔍 Probando conexión con Google Apps Script...');
        console.log('📡 URL:', SCRIPT_URL);
        
        const response = await fetch(`${SCRIPT_URL}?action=getBuses`);
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Conexión exitosa con el servidor');
            console.log('📊 Buses disponibles:', data.data.buses.length);
        } else {
            console.warn('⚠️ Servidor respondió pero con error:', data.error);
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        console.error('💡 Verifique que la URL del script sea correcta');
    }
}

// Establecer fecha actual
function inicializarFecha() {
    const ahora = new Date();
    // Formato datetime-local: yyyy-MM-ddTHH:mm
    const year = ahora.getFullYear();
    const month = String(ahora.getMonth() + 1).padStart(2, '0');
    const day = String(ahora.getDate()).padStart(2, '0');
    const hours = String(ahora.getHours()).padStart(2, '0');
    const minutes = String(ahora.getMinutes()).padStart(2, '0');
    
    document.getElementById('fechaInspeccion').value = `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Cargar lista de conductores desde Google Sheets
async function cargarConductores() {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=getConductores`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.conductores) {
            conductoresDB = data.data.conductores;
            actualizarDatalistConductores();
        } else {
            // Datos de ejemplo
            conductoresDB = [
                { nombre: 'Juan Pérez', licencia: 'A-IIb' },
                { nombre: 'María González', licencia: 'A-IIb' },
                { nombre: 'Carlos Rodríguez', licencia: 'A-IIb' }
            ];
            actualizarDatalistConductores();
        }
    } catch (error) {
        console.error('Error al cargar conductores:', error);
        conductoresDB = [
            { nombre: 'Juan Pérez', licencia: 'A-IIb' },
            { nombre: 'María González', licencia: 'A-IIb' }
        ];
        actualizarDatalistConductores();
    }
}

// Actualizar datalist con conductores
function actualizarDatalistConductores() {
    const datalist = document.getElementById('conductoresDatalist');
    datalist.innerHTML = '';
    
    conductoresDB.forEach(conductor => {
        const option = document.createElement('option');
        option.value = `${conductor.nombre}${conductor.licencia ? ' - ' + conductor.licencia : ''}`;
        datalist.appendChild(option);
    });
}

// Configurar eventos
function configurarEventos() {
    // Búsqueda de bus
    const numeroInternoInput = document.getElementById('numeroInterno');
    numeroInternoInput.addEventListener('input', function(e) {
        buscarBus(e.target.value);
    });

    // Validación de selects - cambiar color basado en selección
    const selects = document.querySelectorAll('select[id^="carroceria"], select[id^="luces"], select[id^="cintas"], select[id^="emblemas"], select[id^="extintores"], select[id^="toma"], select[id^="documentos"], select[id^="licencia"]');
    selects.forEach(select => {
        select.addEventListener('change', function(e) {
            if (e.target.value === 'BUENO') {
                e.target.style.backgroundColor = '#d1fae5';
                e.target.style.borderColor = '#10b981';
            } else if (e.target.value === 'MALO') {
                e.target.style.backgroundColor = '#fee2e2';
                e.target.style.borderColor = '#ef4444';
            } else {
                e.target.style.backgroundColor = '';
                e.target.style.borderColor = '';
            }
        });
    });

    // Submit del formulario
    document.getElementById('inspeccionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        validarYGuardar();
    });
}

// Cargar lista de buses desde Google Sheets
async function cargarBuses() {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=getBuses`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.buses) {
            busesDB = data.data.buses;
            actualizarDatalistBuses();
        } else {
            console.error('Error al cargar buses:', data.error);
            // Datos de ejemplo si no se puede conectar
            busesDB = [
                { numeroInterno: '2417', placa: 'NNZ426' },
                { numeroInterno: '2960', placa: 'TRN123' },
                { numeroInterno: '3105', placa: 'ABC456' }
            ];
            actualizarDatalistBuses();
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        // Usar datos de ejemplo
        busesDB = [
            { numeroInterno: '2417', placa: 'NNZ426' },
            { numeroInterno: '2960', placa: 'TRN123' }
        ];
        actualizarDatalistBuses();
    }
}

// Actualizar datalist con buses
function actualizarDatalistBuses() {
    const datalist = document.getElementById('busesDatalist');
    datalist.innerHTML = '';
    
    busesDB.forEach(bus => {
        const option = document.createElement('option');
        option.value = `${bus.numeroInterno} | ${bus.placa}`;
        datalist.appendChild(option);
    });
}

// Buscar bus y autocompletar placa
function buscarBus(valor) {
    const bus = busesDB.find(b => 
        b.numeroInterno === valor || 
        valor.includes(b.numeroInterno) ||
        valor.includes(b.placa)
    );
    
    if (bus) {
        document.getElementById('placa').value = bus.placa;
        document.getElementById('numeroInterno').value = bus.numeroInterno;
    }
}

// ============================================
// MÓDULO DE CARROCERÍA - VALIDACIÓN NOK
// ============================================

function configurarCarroceria() {
    // Eventos para detectar cambios en selects de carrocería
    const carroceriaSelects = document.querySelectorAll('.carroceria-select');
    carroceriaSelects.forEach(select => {
        select.addEventListener('change', validarCarroceriaNOK);
    });
    
    // Configurar input de evidencias
    const inputEvidencias = document.getElementById('evidenciasCarroceria');
    if (inputEvidencias) {
        inputEvidencias.addEventListener('change', function(e) {
            evidenciasCarroceria = Array.from(e.target.files);
            mostrarPreviewCarroceria();
            validarCarroceriaNOK();
        });
    }
}

function validarCarroceriaNOK() {
    const faldones = document.getElementById('carroceriaFaldones');
    const vidrios = document.getElementById('carroceriaVidrios');
    const espejos = document.getElementById('carroceriaEspejos');
    
    const infoNOK = document.getElementById('carroceriaInfoNOK');
    const evidenciaRequerida = document.getElementById('carroceriaEvidenciaRequerida');
    
    // Verificar si hay algún MALO
    const hayNOK = faldones.value === 'MALO' || vidrios.value === 'MALO' || espejos.value === 'MALO';
    
    if (hayNOK) {
        // Mostrar advertencia
        if (infoNOK) infoNOK.style.display = 'block';
        if (evidenciaRequerida) evidenciaRequerida.style.display = 'inline';
        
        // Hacer el input de evidencias visualmente requerido
        const inputEvidencias = document.getElementById('evidenciasCarroceria');
        if (inputEvidencias) {
            inputEvidencias.required = true;
            inputEvidencias.parentElement.querySelector('label').style.color = '#ef4444';
        }
    } else {
        // Ocultar advertencia
        if (infoNOK) infoNOK.style.display = 'none';
        if (evidenciaRequerida) evidenciaRequerida.style.display = 'none';
        
        // Quitar requerimiento
        const inputEvidencias = document.getElementById('evidenciasCarroceria');
        if (inputEvidencias) {
            inputEvidencias.required = false;
            inputEvidencias.parentElement.querySelector('label').style.color = '';
        }
    }
}

function mostrarPreviewCarroceria() {
    const previewContainer = document.getElementById('previewEvidenciasCarroceria');
    if (!previewContainer) return;
    
    previewContainer.innerHTML = '';
    
    if (evidenciasCarroceria.length === 0) return;
    
    evidenciasCarroceria.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Evidencia ${index + 1}">
                <button type="button" class="btn-remove-evidence" onclick="eliminarEvidenciaCarroceria(${index})">
                    🗑️ Eliminar
                </button>
                <span class="evidence-name">${file.name}</span>
            `;
            previewContainer.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

function eliminarEvidenciaCarroceria(index) {
    evidenciasCarroceria.splice(index, 1);
    mostrarPreviewCarroceria();
    
    // Actualizar el input file
    const dataTransfer = new DataTransfer();
    evidenciasCarroceria.forEach(file => dataTransfer.items.add(file));
    document.getElementById('evidenciasCarroceria').files = dataTransfer.files;
    
    // Revalidar
    validarCarroceriaNOK();
}

// ============================================
// NAVEGACIÓN ENTRE SECCIONES
// ============================================

function irAModulos() {
    // Validar información general
    const fechaInspeccion = document.getElementById('fechaInspeccion').value;
    const km = document.getElementById('km').value;
    const numeroInterno = document.getElementById('numeroInterno').value;
    const conductorId = document.getElementById('conductorId').value;
    
    if (!fechaInspeccion || !km || !numeroInterno || !conductorId) {
        mostrarToast('❌ Complete todos los campos obligatorios', 'error');
        return;
    }
    
    // Ocultar info general, mostrar módulos
    document.getElementById('seccionInfoGeneral').style.display = 'none';
    document.getElementById('seccionModulos').style.display = 'block';
    document.getElementById('progressBar').style.display = 'block';
    document.getElementById('headerSubtitle').textContent = `Bus: ${numeroInterno} - Seleccione módulo a inspeccionar`;
    
    window.scrollTo(0, 0);
}

function volverAInfoGeneral() {
    document.getElementById('seccionModulos').style.display = 'none';
    document.getElementById('seccionInfoGeneral').style.display = 'block';
    document.getElementById('progressBar').style.display = 'none';
    document.getElementById('headerSubtitle').textContent = 'Inspección completa de vehículo - Todas las verificaciones';
    
    window.scrollTo(0, 0);
}

function irAFirmas() {
    document.getElementById('seccionModulos').style.display = 'none';
    document.getElementById('seccionFirmas').style.display = 'block';
    document.getElementById('headerSubtitle').textContent = 'Firmas y Evidencias - Paso final';
    
    // Inicializar firmas y evidencias si no se han inicializado
    if (!firmaConductorCanvas) {
        inicializarFirmas();
        configurarEvidencias();
    }
    
    window.scrollTo(0, 0);
}

function volverAModulos() {
    document.getElementById('seccionFirmas').style.display = 'none';
    document.getElementById('seccionModulos').style.display = 'block';
    document.getElementById('headerSubtitle').textContent = `Bus: ${document.getElementById('numeroInterno').value} - Seleccione módulo a inspeccionar`;
    
    window.scrollTo(0, 0);
}

// ============================================
// GESTIÓN DE MÓDULOS
// ============================================

function abrirModulo(modulo) {
    moduloActual = modulo;
    
    // Ocultar galería de módulos
    document.getElementById('seccionModulos').style.display = 'none';
    
    // Mostrar módulo específico
    const moduloDetalle = document.getElementById(`moduloDetalle${modulo}`);
    if (moduloDetalle) {
        moduloDetalle.style.display = 'block';
        window.scrollTo(0, 0);
    }
}

function cerrarModulo() {
    console.log('🔙 cerrarModulo() llamado. moduloActual:', moduloActual);
    
    if (moduloActual) {
        const elementoModulo = document.getElementById(`moduloDetalle${moduloActual}`);
        console.log('🎯 Elemento a ocultar:', `moduloDetalle${moduloActual}`, 'Encontrado:', !!elementoModulo);
        if (elementoModulo) {
            elementoModulo.style.display = 'none';
            elementoModulo.style.visibility = 'hidden';
            console.log('✅ Módulo ocultado');
        }
    }
    
    const seccionModulos = document.getElementById('seccionModulos');
    console.log('🎯 Sección módulos:', !!seccionModulos);
    if (seccionModulos) {
        seccionModulos.style.display = 'block';
        seccionModulos.style.visibility = 'visible';
        seccionModulos.style.opacity = '1';
        // Forzar reflow
        seccionModulos.offsetHeight;
        console.log('✅ Sección módulos mostrada. Display:', seccionModulos.style.display);
    }
    
    moduloActual = null;
    
    // Scroll con delay para móviles
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    
    console.log('✅ cerrarModulo() completado');
}

function guardarModulo(modulo) {
    console.log('🔍 Guardando módulo:', modulo);
    
    // Validar que todos los campos del módulo estén completos
    const moduloDetalle = document.getElementById(`moduloDetalle${modulo}`);
    
    if (!moduloDetalle) {
        console.error('❌ No se encontró el elemento moduloDetalle' + modulo);
        mostrarToast('Error: No se encontró el módulo', 'error');
        return;
    }
    
    const inputs = moduloDetalle.querySelectorAll('input[required], select[required], textarea[required]');
    let todosCompletos = true;
    
    console.log('📋 Campos a validar:', inputs.length);
    
    inputs.forEach(input => {
        if (!input.value) {
            todosCompletos = false;
            input.style.borderColor = '#ef4444';
            console.log('❌ Campo vacío:', input.id || input.name);
        } else {
            input.style.borderColor = '';
        }
    });
    
    if (!todosCompletos) {
        mostrarToast('❌ Complete todos los campos obligatorios del módulo', 'error');
        return;
    }
    
    console.log('✅ Todos los campos completos');
    
    // Validación específica para llantas - Si hay llantas críticas, advertir sobre evidencias
    if (modulo === 'llantas') {
        const llantasCriticas = [];
        
        for (let i = 1; i <= 24; i++) {
            const externa = parseFloat(document.getElementById(`llanta${i}_externa`).value) || 0;
            const media = parseFloat(document.getElementById(`llanta${i}_media`).value) || 0;
            const interna = parseFloat(document.getElementById(`llanta${i}_interna`).value) || 0;
            
            if (externa === 0 && media === 0 && interna === 0) continue;
            
            const minima = Math.min(externa, media, interna);
            if (minima < 3) {
                llantasCriticas.push(i);
            }
        }
        
        if (llantasCriticas.length > 0) {
            // Verificar que cada llanta crítica tenga al menos una foto
            const llantasSinFoto = [];
            
            llantasCriticas.forEach(numLlanta => {
                const fotos = evidenciasLlantas[numLlanta] || [];
                if (fotos.length === 0) {
                    llantasSinFoto.push(numLlanta);
                }
            });
            
            // Solo advertir, no bloquear
            if (llantasSinFoto.length > 0) {
                const continuar = confirm(`⚠️ Las llantas críticas #${llantasSinFoto.join(', #')} no tienen evidencia fotográfica.\n\n¿Desea continuar de todas formas?`);
                if (!continuar) {
                    // Hacer scroll al primer campo sin foto
                    const primerInput = document.getElementById(`evidenciaLlanta${llantasSinFoto[0]}`);
                    if (primerInput) {
                        primerInput.style.borderColor = '#ef4444';
                        primerInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    return;
                }
            }
        }
    }
    
    // Validación específica para carrocería - Si hay MALO, advertir sobre evidencias
    if (modulo === 'carroceria') {
        const faldones = document.getElementById('carroceriaFaldones');
        const vidrios = document.getElementById('carroceriaVidrios');
        const espejos = document.getElementById('carroceriaEspejos');
        
        const hayNOK = faldones.value === 'MALO' || vidrios.value === 'MALO' || espejos.value === 'MALO';
        
        // Solo advertir, no bloquear
        if (hayNOK && evidenciasCarroceria.length === 0) {
            const continuar = confirm('⚠️ Hay elementos en estado MALO sin evidencia fotográfica.\n\n¿Desea continuar de todas formas?');
            if (!continuar) {
                // Resaltar el campo de evidencias
                const inputEvidencias = document.getElementById('evidenciasCarroceria');
                if (inputEvidencias) {
                    inputEvidencias.style.borderColor = '#ef4444';
                    inputEvidencias.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
        }
    }
    
    // Marcar módulo como completado
    modulosCompletados[modulo] = true;
    console.log('✅ Módulo marcado como completado:', modulo);
    console.log('📊 Estado módulos:', modulosCompletados);
    
    // Actualizar UI del módulo en la galería
    const moduloCard = document.getElementById(`modulo${capitalizar(modulo)}`);
    console.log('🎴 Buscando card:', `modulo${capitalizar(modulo)}`, 'Encontrado:', !!moduloCard);
    
    if (moduloCard) {
        moduloCard.classList.add('completado');
        const statusSpan = moduloCard.querySelector('.modulo-status');
        if (statusSpan) {
            statusSpan.textContent = 'Completado ✓';
            statusSpan.classList.add('completado');
        }
    }
    
    // Actualizar barra de progreso
    actualizarBarraProgreso();
    
    // Cerrar módulo y volver a galería
    console.log('🔙 Cerrando módulo y volviendo a galería...');
    cerrarModulo();
    
    mostrarToast(`✅ Módulo "${getNombreModulo(modulo)}" guardado correctamente`, 'success');
    console.log('✅ Función guardarModulo completada');
}

function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getNombreModulo(modulo) {
    const nombres = {
        llantas: 'Profundidad de Llantas',
        carroceria: 'Carrocería',
        luces: 'Sistema de Luces y Pitos',
        senalizacion: 'Señalización y Emblemas',
        seguridad: 'Equipamiento de Seguridad',
        documentacion: 'Documentación'
    };
    return nombres[modulo] || modulo;
}

function actualizarBarraProgreso() {
    const total = Object.keys(modulosCompletados).length;
    const completados = Object.values(modulosCompletados).filter(v => v === true).length;
    const porcentaje = (completados / total) * 100;
    
    const progressBar = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${porcentaje}%`;
        progressText.textContent = `${completados} de ${total} módulos completados`;
    }
}

// ============================================
// MÓDULO DE LLANTAS - 24 POSICIONES
// ============================================

function generarLlantas24() {
    const container = document.getElementById('llantasGrid');
    if (!container) return;
    
    container.innerHTML = ''; // Limpiar contenido previo
    
    for (let i = 1; i <= 24; i++) {
        const llantaCard = document.createElement('div');
        llantaCard.className = 'llanta-item';
        llantaCard.innerHTML = `
            <div class="llanta-numero">Llanta #${i}</div>
            <div class="llanta-medidas">
                <div class="medida-input-group">
                    <label>Externa (mm)</label>
                    <input type="number" 
                           class="medida-input" 
                           id="llanta${i}_externa"
                           data-llanta="${i}" 
                           data-tipo="externa"
                           min="0" 
                           max="30" 
                           step="0.1" 
                           placeholder="0.0">
                </div>
                <div class="medida-input-group">
                    <label>Media (mm)</label>
                    <input type="number" 
                           class="medida-input" 
                           id="llanta${i}_media"
                           data-llanta="${i}" 
                           data-tipo="media"
                           min="0" 
                           max="30" 
                           step="0.1" 
                           placeholder="0.0">
                </div>
                <div class="medida-input-group">
                    <label>Interna (mm)</label>
                    <input type="number" 
                           class="medida-input" 
                           id="llanta${i}_interna"
                           data-llanta="${i}" 
                           data-tipo="interna"
                           min="0" 
                           max="30" 
                           step="0.1" 
                           placeholder="0.0">
                </div>
            </div>
            <div class="llanta-promedio" id="llantaPromedio${i}">
                Promedio: -- mm
            </div>
            <div class="llanta-estado" id="llantaEstado${i}"></div>
        `;
        container.appendChild(llantaCard);
    }
    
    // Agregar eventos a todos los inputs de llantas
    const inputs = document.querySelectorAll('.medida-input');
    inputs.forEach(input => {
        input.addEventListener('input', function(e) {
            validarMedidaLlanta(e.target);
            const llanta = e.target.dataset.llanta;
            calcularPromedioLlanta(llanta);
            actualizarResumenLlantas();
        });
        
        input.addEventListener('blur', function(e) {
            validarMedidaLlanta(e.target);
        });
    });
}

function validarMedidaLlanta(input) {
    const valor = parseFloat(input.value);
    
    // Limpiar clases previas
    input.classList.remove('medida-critica', 'medida-regular', 'medida-buena');
    
    if (isNaN(valor) || valor === 0 || input.value === '') {
        return;
    }
    
    // Validar rango
    if (valor < 0 || valor > 30) {
        input.setCustomValidity('El valor debe estar entre 0 y 30 mm');
        input.classList.add('medida-critica');
        return;
    } else {
        input.setCustomValidity('');
    }
    
    // Clasificar por color según profundidad
    if (valor < 3) {
        input.classList.add('medida-critica'); // Rojo
    } else if (valor >= 3 && valor <= 5) {
        input.classList.add('medida-regular'); // Amarillo
    } else {
        input.classList.add('medida-buena'); // Verde
    }
}

function calcularPromedioLlanta(numeroLlanta) {
    const externa = parseFloat(document.getElementById(`llanta${numeroLlanta}_externa`).value) || 0;
    const media = parseFloat(document.getElementById(`llanta${numeroLlanta}_media`).value) || 0;
    const interna = parseFloat(document.getElementById(`llanta${numeroLlanta}_interna`).value) || 0;
    
    const promedioSpan = document.getElementById(`llantaPromedio${numeroLlanta}`);
    const estadoDiv = document.getElementById(`llantaEstado${numeroLlanta}`);
    
    // Si no hay datos, limpiar
    if (externa === 0 && media === 0 && interna === 0) {
        promedioSpan.textContent = 'Promedio: -- mm';
        estadoDiv.textContent = '';
        estadoDiv.className = 'llanta-estado';
        return null;
    }
    
    // Calcular promedio
    const promedio = (externa + media + interna) / 3;
    promedioSpan.textContent = `Promedio: ${promedio.toFixed(2)} mm`;
    
    // Determinar estado basado en la medida mínima
    const minima = Math.min(externa, media, interna);
    
    if (minima < 3) {
        estadoDiv.textContent = '🔴 CRÍTICA';
        estadoDiv.className = 'llanta-estado estado-critico';
        return 'critica';
    } else if (minima >= 3 && minima <= 5) {
        estadoDiv.textContent = '🟡 REGULAR';
        estadoDiv.className = 'llanta-estado estado-regular';
        return 'regular';
    } else {
        estadoDiv.textContent = '🟢 BUENA';
        estadoDiv.className = 'llanta-estado estado-bueno';
        return 'buena';
    }
}

function actualizarResumenLlantas() {
    let criticas = 0;
    let regulares = 0;
    let buenas = 0;
    let sumaPromedios = 0;
    let llantasConDatos = 0;
    const llantasCriticasIds = [];
    
    for (let i = 1; i <= 24; i++) {
        const externa = parseFloat(document.getElementById(`llanta${i}_externa`).value) || 0;
        const media = parseFloat(document.getElementById(`llanta${i}_media`).value) || 0;
        const interna = parseFloat(document.getElementById(`llanta${i}_interna`).value) || 0;
        
        // Saltar llantas sin datos
        if (externa === 0 && media === 0 && interna === 0) continue;
        
        llantasConDatos++;
        const minima = Math.min(externa, media, interna);
        const promedio = (externa + media + interna) / 3;
        sumaPromedios += promedio;
        
        // Clasificar
        if (minima < 3) {
            criticas++;
            llantasCriticasIds.push(i);
        } else if (minima >= 3 && minima <= 5) {
            regulares++;
        } else {
            buenas++;
        }
    }
    
    // Actualizar UI
    const criticasElement = document.getElementById('llantasCriticasCount');
    const regularesElement = document.getElementById('llantasRegularesCount');
    const buenasElement = document.getElementById('llantasBuenasCount');
    const promedioElement = document.getElementById('promedioGeneralLlantas');
    
    if (criticasElement) criticasElement.textContent = criticas;
    if (regularesElement) regularesElement.textContent = regulares;
    if (buenasElement) buenasElement.textContent = buenas;
    
    const promedioGeneral = llantasConDatos > 0 ? (sumaPromedios / llantasConDatos).toFixed(2) : '0.00';
    if (promedioElement) promedioElement.textContent = `${promedioGeneral} mm`;
    
    // Mostrar/ocultar advertencia y campos de evidencias
    const warningDiv = document.getElementById('llantasCriticasWarning');
    const evidenciasContainer = document.getElementById('evidenciasLlantasContainer');
    
    if (criticas > 0) {
        if (warningDiv) warningDiv.style.display = 'block';
        if (evidenciasContainer) evidenciasContainer.style.display = 'block';
        generarCamposEvidenciasLlantas(llantasCriticasIds);
    } else {
        if (warningDiv) warningDiv.style.display = 'none';
        if (evidenciasContainer) evidenciasContainer.style.display = 'none';
    }
}

function generarCamposEvidenciasLlantas(llantasCriticas) {
    const container = document.getElementById('evidenciasLlantasGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    llantasCriticas.forEach(numLlanta => {
        const divEvidencia = document.createElement('div');
        divEvidencia.className = 'evidencia-llanta-item';
        divEvidencia.innerHTML = `
            <div class="evidencia-llanta-header">
                <span class="evidencia-llanta-titulo">🔴 Llanta #${numLlanta}</span>
                <span class="evidencia-llanta-requerido">(OBLIGATORIO)</span>
            </div>
            <input type="file" 
                   id="evidenciaLlanta${numLlanta}" 
                   accept="image/*" 
                   multiple
                   capture="environment"
                   data-llanta="${numLlanta}"
                   class="evidencia-llanta-input">
            <div id="previewLlanta${numLlanta}" class="preview-evidencias-llanta"></div>
        `;
        container.appendChild(divEvidencia);
        
        // Agregar event listener
        const input = divEvidencia.querySelector('input[type="file"]');
        input.addEventListener('change', function(e) {
            const numLlanta = e.target.dataset.llanta;
            evidenciasLlantas[numLlanta] = Array.from(e.target.files);
            mostrarPreviewLlanta(numLlanta);
        });
    });
}

function mostrarPreviewLlanta(numLlanta) {
    const previewContainer = document.getElementById(`previewLlanta${numLlanta}`);
    if (!previewContainer) return;
    
    previewContainer.innerHTML = '';
    const archivos = evidenciasLlantas[numLlanta] || [];
    
    if (archivos.length === 0) return;
    
    archivos.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const div = document.createElement('div');
            div.className = 'preview-item-mini';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Evidencia">
                <button type="button" class="btn-remove-mini" onclick="eliminarEvidenciaLlanta(${numLlanta}, ${index})">
                    ✕
                </button>
            `;
            previewContainer.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

function eliminarEvidenciaLlanta(numLlanta, index) {
    if (evidenciasLlantas[numLlanta]) {
        evidenciasLlantas[numLlanta].splice(index, 1);
        
        // Actualizar input file
        const input = document.getElementById(`evidenciaLlanta${numLlanta}`);
        if (input) {
            const dataTransfer = new DataTransfer();
            evidenciasLlantas[numLlanta].forEach(file => dataTransfer.items.add(file));
            input.files = dataTransfer.files;
        }
        
        mostrarPreviewLlanta(numLlanta);
    }
}

function obtenerDatosLlantas() {
    const llantas = [];
    
    for (let i = 1; i <= 24; i++) {
        const externa = parseFloat(document.getElementById(`llanta${i}_externa`).value) || 0;
        const media = parseFloat(document.getElementById(`llanta${i}_media`).value) || 0;
        const interna = parseFloat(document.getElementById(`llanta${i}_interna`).value) || 0;
        
        // Solo incluir llantas con al menos un dato
        if (externa > 0 || media > 0 || interna > 0) {
            const promedio = (externa + media + interna) / 3;
            const minima = Math.min(externa, media, interna);
            
            let estado = 'Buena';
            if (minima < 3) estado = 'Crítica';
            else if (minima >= 3 && minima <= 5) estado = 'Regular';
            
            llantas.push({
                numero: i,
                posicion: i, // Agregando posicion como backup
                externa: externa,
                media: media,
                interna: interna,
                promedio: promedio.toFixed(2),
                estado: estado
            });
        }
    }
    
    console.log('🔧 Llantas a enviar:', llantas);
    return llantas;
}

// ============================================
// FIRMAS DIGITALES
// ============================================

function inicializarFirmas() {
    // Canvas Conductor
    firmaConductorCanvas = document.getElementById('firmaConductor');
    firmaConductorCtx = firmaConductorCanvas.getContext('2d');
    configurarCanvas(firmaConductorCanvas, firmaConductorCtx);
    
    // Canvas Inspector
    firmaInspectorCanvas = document.getElementById('firmaInspector');
    firmaInspectorCtx = firmaInspectorCanvas.getContext('2d');
    configurarCanvas(firmaInspectorCanvas, firmaInspectorCtx);
    
    // Eventos para Conductor
    firmaConductorCanvas.addEventListener('mousedown', (e) => iniciarFirma(e, 'conductor'));
    firmaConductorCanvas.addEventListener('mousemove', (e) => dibujarFirma(e, 'conductor'));
    firmaConductorCanvas.addEventListener('mouseup', () => detenerFirma('conductor'));
    firmaConductorCanvas.addEventListener('mouseleave', () => detenerFirma('conductor'));
    
    // Touch events para móvil - Conductor
    firmaConductorCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        iniciarFirma(e.touches[0], 'conductor');
    });
    firmaConductorCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        dibujarFirma(e.touches[0], 'conductor');
    });
    firmaConductorCanvas.addEventListener('touchend', () => detenerFirma('conductor'));
    
    // Eventos para Inspector
    firmaInspectorCanvas.addEventListener('mousedown', (e) => iniciarFirma(e, 'inspector'));
    firmaInspectorCanvas.addEventListener('mousemove', (e) => dibujarFirma(e, 'inspector'));
    firmaInspectorCanvas.addEventListener('mouseup', () => detenerFirma('inspector'));
    firmaInspectorCanvas.addEventListener('mouseleave', () => detenerFirma('inspector'));
    
    // Touch events para móvil - Inspector
    firmaInspectorCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        iniciarFirma(e.touches[0], 'inspector');
    });
    firmaInspectorCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        dibujarFirma(e.touches[0], 'inspector');
    });
    firmaInspectorCanvas.addEventListener('touchend', () => detenerFirma('inspector'));
}

function configurarCanvas(canvas, ctx) {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function iniciarFirma(e, tipo) {
    if (tipo === 'conductor') {
        firmandoConductor = true;
        const rect = firmaConductorCanvas.getBoundingClientRect();
        firmaConductorCtx.beginPath();
        firmaConductorCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    } else {
        firmandoInspector = true;
        const rect = firmaInspectorCanvas.getBoundingClientRect();
        firmaInspectorCtx.beginPath();
        firmaInspectorCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
}

function dibujarFirma(e, tipo) {
    if (tipo === 'conductor' && !firmandoConductor) return;
    if (tipo === 'inspector' && !firmandoInspector) return;
    
    if (tipo === 'conductor') {
        const rect = firmaConductorCanvas.getBoundingClientRect();
        firmaConductorCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        firmaConductorCtx.stroke();
    } else {
        const rect = firmaInspectorCanvas.getBoundingClientRect();
        firmaInspectorCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        firmaInspectorCtx.stroke();
    }
}

function detenerFirma(tipo) {
    if (tipo === 'conductor') {
        firmandoConductor = false;
    } else {
        firmandoInspector = false;
    }
}

function limpiarFirma(canvasId) {
    if (canvasId === 'firmaConductor') {
        firmaConductorCtx.fillStyle = '#ffffff';
        firmaConductorCtx.fillRect(0, 0, firmaConductorCanvas.width, firmaConductorCanvas.height);
    } else {
        firmaInspectorCtx.fillStyle = '#ffffff';
        firmaInspectorCtx.fillRect(0, 0, firmaInspectorCanvas.width, firmaInspectorCanvas.height);
    }
}

function obtenerFirmaBase64(canvasId) {
    const canvas = document.getElementById(canvasId);
    return canvas.toDataURL('image/png');
}

function firmaEstaVacia(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    // Verificar si todos los píxeles son blancos
    for (let i = 0; i < pixelData.length; i += 4) {
        if (pixelData[i] !== 255 || pixelData[i+1] !== 255 || pixelData[i+2] !== 255) {
            return false; // Hay al menos un píxel que no es blanco
        }
    }
    return true;
}

// ============================================
// EVIDENCIAS FOTOGRÁFICAS
// ============================================

function configurarEvidencias() {
    const inputEvidencias = document.getElementById('evidencias');
    inputEvidencias.addEventListener('change', function(e) {
        evidenciasFiles = Array.from(e.target.files);
        mostrarPreviewEvidencias();
    });
}

function mostrarPreviewEvidencias() {
    const previewContainer = document.getElementById('previewEvidencias');
    previewContainer.innerHTML = '';
    
    if (evidenciasFiles.length === 0) return;
    
    evidenciasFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Evidencia ${index + 1}">
                <button type="button" class="btn-remove-evidence" onclick="eliminarEvidencia(${index})">
                    🗑️ Eliminar
                </button>
                <span class="evidence-name">${file.name}</span>
            `;
            previewContainer.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

function eliminarEvidencia(index) {
    evidenciasFiles.splice(index, 1);
    mostrarPreviewEvidencias();
    
    // Actualizar el input file
    const dataTransfer = new DataTransfer();
    evidenciasFiles.forEach(file => dataTransfer.items.add(file));
    document.getElementById('evidencias').files = dataTransfer.files;
}

// ============================================
// VALIDAR Y GUARDAR INSPECCIÓN
// ============================================

function validarYGuardar() {
    // Validar firmas
    if (firmaEstaVacia('firmaConductor')) {
        mostrarToast('❌ Falta la firma del conductor', 'error');
        document.getElementById('firmaConductor').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    if (firmaEstaVacia('firmaInspector')) {
        mostrarToast('❌ Falta la firma del inspector', 'error');
        document.getElementById('firmaInspector').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    // Validar que haya al menos un campo MALO identificado si es necesario
    const camposMALO = [];
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        if (select.value === 'MALO') {
            const label = select.previousElementSibling ? select.previousElementSibling.textContent : select.id;
            camposMALO.push(label);
        }
    });
    
    if (camposMALO.length > 0) {
        const confirmar = confirm(`Se encontraron ${camposMALO.length} elementos MALOS:\n\n${camposMALO.join('\n')}\n\n¿Desea continuar con el registro?`);
        if (!confirmar) return;
    }
    
    guardarInspeccion();
}

// Guardar inspección en Google Drive
async function guardarInspeccion() {
    // Determinar estado general
    const selects = document.querySelectorAll('select');
    let hayMALO = false;
    selects.forEach(select => {
        if (select.value === 'MALO') hayMALO = true;
    });
    
    // Verificar llantas críticas
    const llantas = obtenerDatosLlantas();
    const llantasCriticas = llantas.filter(l => l.estado === 'Crítica').length;
    
    let estadoGeneral = 'Aprobado';
    if (hayMALO || llantasCriticas > 0) {
        estadoGeneral = 'Requiere Atención';
    }
    
    // Obtener conductor
    const conductorInput = document.getElementById('conductorId').value;
    
    // Recopilar datos en el formato esperado por Google Apps Script
    const datos = {
        action: 'guardarInspeccion',
        
        // Datos generales
        placa: document.getElementById('placa').value,
        numeroInterno: document.getElementById('numeroInterno').value,
        tipoVehiculo: 'Bus', // Asumiendo que siempre es bus
        odometro: parseInt(document.getElementById('km').value) || 0,
        inspector: 'Inspector PreViajes', // Puedes modificar esto
        estadoGeneral: estadoGeneral,
        
        // Llantas
        llantas: llantas,
        
        // Carrocería
        carroceria: {
            faldones: document.getElementById('carroceriaFaldones').value,
            vidrios: document.getElementById('carroceriaVidrios').value,
            espejos: document.getElementById('carroceriaEspejos').value
        },
        
        // Mecánico/Luces
        mecanico: {
            lucesMedias: document.getElementById('lucesMedias').value,
            lucesAltas: document.getElementById('lucesAltas').value,
            lucesPosicionamiento: document.getElementById('lucesPosicionamiento').value,
            lucesReversa: document.getElementById('lucesReversa').value,
            lucesStop: document.getElementById('lucesStop').value
        },
        
        // Luces adicionales (señalización)
        luces: {
            cintasReflectivasLaterales: document.getElementById('cintasReflectivasLaterales').value,
            cintasReflectivasTrasera: document.getElementById('cintasReflectivasTrasera').value,
            emblemasLaterales: document.getElementById('emblemasLaterales').value,
            emblemasFrontales: document.getElementById('emblemasFrontales').value,
            emblemasTraseros: document.getElementById('emblemasTraseros').value
        },
        
        // Seguridad
        seguridad: {
            extintoresCabina: document.getElementById('extintoresCabina').value,
            extintoresBodega: document.getElementById('extintoresBodega').value,
            tomaCorrienteEspalda: document.getElementById('tomaCorrienteEspalda').value,
            tomaCorrienteSilla: document.getElementById('tomaCorrienteSilla').value
        },
        
        // Vidrios/Documentación
        vidrios: {
            soat: document.getElementById('documentosSoat').value,
            rtm: document.getElementById('documentosRtm').value,
            tarjetaOperacion: document.getElementById('documentosTarjetaOperacion').value,
            licenciaConduccion: document.getElementById('licenciaConduccionConductor').value
        },
        
        // Observaciones
        observaciones: document.getElementById('observacionesLlantas') ? document.getElementById('observacionesLlantas').value : '',
        
        // Firma (solo una por ahora)
        firmaUrl: obtenerFirmaBase64('firmaInspector')
    };
    
    // Mostrar loading
    document.getElementById('loadingOverlay').style.display = 'flex';
    
    try {
        console.log('Enviando datos:', datos);
        
        // Enviar datos principales - SIN mode: 'no-cors'
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(datos)
        });
        
        const result = await response.json();
        console.log('Respuesta del servidor:', result);
        
        document.getElementById('loadingOverlay').style.display = 'none';
        
        if (result.success) {
            mostrarToast('✅ Inspección guardada exitosamente', 'success');
            
            // Limpiar formulario automáticamente después de 1 segundo
            setTimeout(() => {
                limpiarFormularioAutomatico();
            }, 1000);
        } else {
            mostrarToast('⚠️ Error: ' + (result.error || 'Error desconocido'), 'error');
        }
        
    } catch (error) {
        console.error('Error al guardar:', error);
        document.getElementById('loadingOverlay').style.display = 'none';
        mostrarToast('⚠️ Error al guardar. Verifique su conexión e intente nuevamente.', 'error');
    }
}

// Enviar evidencias fotográficas
async function enviarEvidencias(numeroInterno, fecha) {
    const formData = new FormData();
    formData.append('numeroInterno', numeroInterno);
    formData.append('fecha', fecha);
    
    evidenciasFiles.forEach((file, index) => {
        formData.append(`evidencia_${index}`, file);
    });
    
    try {
        await fetch(`${SCRIPT_URL}?action=uploadEvidencias`, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });
    } catch (error) {
        console.error('Error al subir evidencias:', error);
    }
}

// Limpiar formulario
function limpiarFormulario() {
    if (confirm('¿Está seguro de limpiar todo el formulario?')) {
        limpiarFormularioAutomatico();
    }
}

// Limpiar formulario automáticamente (sin confirmación)
function limpiarFormularioAutomatico() {
    document.getElementById('inspeccionForm').reset();
    inicializarFecha();
    
    // Limpiar firmas
    limpiarFirma('firmaConductor');
    limpiarFirma('firmaInspector');
    
    // Limpiar evidencias
    evidenciasFiles = [];
    evidenciasCarroceria = [];
    evidenciasLlantas = {};
    document.getElementById('previewEvidencias').innerHTML = '';
    
    // Limpiar estilos de selects
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.style.backgroundColor = '';
        select.style.borderColor = '';
    });
    
    // Reiniciar módulos completados
    modulosCompletados = {
        llantas: false,
        carroceria: false,
        luces: false,
        senalizacion: false,
        seguridad: false,
        documentacion: false
    };
    
    // Cerrar cualquier módulo abierto
    if (moduloActual) {
        document.getElementById(`moduloDetalle${moduloActual}`).style.display = 'none';
        moduloActual = null;
    }
    
    // Volver a la sección de información general
    document.getElementById('seccionModulos').style.display = 'none';
    document.getElementById('seccionInfoGeneral').style.display = 'block';
    document.getElementById('progressBar').style.display = 'none';
    document.getElementById('headerSubtitle').textContent = 'Inspección completa de vehículo - Todas las verificaciones';
    
    // Actualizar barra de progreso
    actualizarBarraProgreso();
    
    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Enfocar en el primer campo
    setTimeout(() => {
        document.getElementById('numeroInterno').focus();
    }, 300);
    
    mostrarToast('✨ Listo para nueva inspección', 'info');
}

// Mostrar notificación toast
function mostrarToast(mensaje, tipo = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.className = `toast show ${tipo}`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}
// ============================================
// CONSULTA DE INSPECCIONES ANTERIORES
// ============================================

function abrirConsultaInspecciones() {
    const modal = document.getElementById('modalConsultaInspecciones');
    modal.style.display = 'flex';
    
    // Establecer fechas por defecto (último mes)
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);
    
    document.getElementById('filtroFechaDesde').valueAsDate = haceUnMes;
    document.getElementById('filtroFechaHasta').valueAsDate = hoy;
}

function cerrarConsultaInspecciones() {
    const modal = document.getElementById('modalConsultaInspecciones');
    modal.style.display = 'none';
}

function limpiarFiltros() {
    document.getElementById('filtroBus').value = '';
    document.getElementById('filtroFechaDesde').value = '';
    document.getElementById('filtroFechaHasta').value = '';
    document.getElementById('filtroHallazgos').value = 'todas';
    document.getElementById('resultadosInspecciones').innerHTML = '<p class="info-text">Use los filtros para buscar inspecciones anteriores</p>';
}

async function buscarInspecciones() {
    const filtroBus = document.getElementById('filtroBus').value.trim();
    const filtroDesde = document.getElementById('filtroFechaDesde').value;
    const filtroHasta = document.getElementById('filtroFechaHasta').value;
    const filtroHallazgos = document.getElementById('filtroHallazgos').value;
    
    const resultadosDiv = document.getElementById('resultadosInspecciones');
    resultadosDiv.innerHTML = '<p class="info-text">🔍 Buscando inspecciones...</p>';
    
    try {
        console.log('🔍 Consultando inspecciones desde Google Sheets...');
        
        // Llamar a Google Apps Script para obtener inspecciones
        const params = new URLSearchParams({
            action: 'consultarInspecciones',
            placa: filtroBus,
            fechaInicio: filtroDesde,
            fechaFin: filtroHasta,
            estado: filtroHallazgos === 'todas' ? '' : filtroHallazgos
        });
        
        const response = await fetch(`${SCRIPT_URL}?${params.toString()}`);
        const data = await response.json();
        
        console.log('📊 Respuesta del servidor:', data);
        
        if (data.success && data.data && data.data.inspecciones && data.data.inspecciones.length > 0) {
            console.log('✅ Inspecciones encontradas:', data.data.inspecciones.length);
            mostrarResultadosInspecciones(data.data.inspecciones, filtroHallazgos);
        } else {
            console.log('⚠️ No se encontraron inspecciones');
            resultadosDiv.innerHTML = '<p class="info-text">❌ No se encontraron inspecciones con los criterios especificados</p>';
        }
    } catch (error) {
        console.error('❌ Error al buscar inspecciones:', error);
        resultadosDiv.innerHTML = `<p class="info-text" style="color: #dc2626;">❌ Error al conectar con el servidor: ${error.message}</p>`;
    }
}

function mostrarResultadosInspecciones(inspecciones, filtroHallazgos) {
    const resultadosDiv = document.getElementById('resultadosInspecciones');
    
    let html = `<p class="info-text">✅ Se encontraron ${inspecciones.length} inspección(es)</p>`;
    
    inspecciones.forEach(inspeccion => {
        const fecha = new Date(inspeccion.fecha);
        const fechaFormato = fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const tieneHallazgos = inspeccion.llantasCriticas > 0 || inspeccion.elementosMalos > 0;
        
        html += `
            <div class="inspeccion-item" onclick="verDetalleInspeccion('${inspeccion.id}')">
                <div class="inspeccion-header">
                    <div class="inspeccion-bus">#${inspeccion.numeroInterno} - ${inspeccion.placa}</div>
                    <div class="inspeccion-fecha">${fechaFormato}</div>
                </div>
                
                <div class="inspeccion-info">
                    <div class="inspeccion-dato">
                        <span class="inspeccion-dato-label">Kilometraje:</span>
                        <span class="inspeccion-dato-valor">${inspeccion.odometro ? inspeccion.odometro.toLocaleString() : '0'} km</span>
                    </div>
                    <div class="inspeccion-dato">
                        <span class="inspeccion-dato-label">Inspector:</span>
                        <span class="inspeccion-dato-valor">${inspeccion.inspector || 'N/A'}</span>
                    </div>
                </div>
                
                <div class="inspeccion-hallazgos">
        `;
        
        if (!tieneHallazgos) {
            html += '<span class="badge-hallazgo badge-ok">✅ Sin hallazgos críticos</span>';
        } else {
            if (inspeccion.llantasCriticas > 0) {
                html += `<span class="badge-hallazgo badge-critica">🔴 ${inspeccion.llantasCriticas} llanta(s) crítica(s)</span>`;
            }
            if (inspeccion.elementosMalos > 0) {
                html += `<span class="badge-hallazgo badge-malo">⚠️ ${inspeccion.elementosMalos} elemento(s) MALO(S)</span>`;
            }
        }
        
        html += `
                </div>
            </div>
        `;
    });
    
    resultadosDiv.innerHTML = html;
}

function verDetalleInspeccion(idInspeccion) {
    const modal = document.getElementById('modalDetalleInspeccion');
    const content = document.getElementById('detalleInspeccionContent');
    
    // Obtener datos de la inspección (en producción, desde Google Apps Script)
    const inspecciones = generarInspeccionesEjemplo();
    const inspeccion = inspecciones.find(i => i.id === idInspeccion);
    
    if (!inspeccion) {
        content.innerHTML = '<p class="info-text">❌ No se encontró la inspección</p>';
        modal.style.display = 'flex';
        return;
    }
    
    const fecha = new Date(inspeccion.fecha);
    const fechaFormato = fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let html = `
        <div class="detalle-section">
            <h3>📋 Información General</h3>
            <div class="detalle-grid">
                <div class="detalle-item">
                    <span class="detalle-item-label">Fecha:</span>
                    <span class="detalle-item-value">${fechaFormato}</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-item-label">Bus:</span>
                    <span class="detalle-item-value">${inspeccion.numeroInterno} - ${inspeccion.placa}</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-item-label">Conductor:</span>
                    <span class="detalle-item-value">${inspeccion.conductor}</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-item-label">Kilometraje:</span>
                    <span class="detalle-item-value">${inspeccion.km.toLocaleString()} km</span>
                </div>
            </div>
        </div>
    `;
    
    // Llantas Críticas
    if (inspeccion.llantasCriticas > 0) {
        html += `
            <div class="detalle-section">
                <h3>🔴 Llantas Críticas (<3mm)</h3>
                <div class="llantas-criticas-list">
        `;
        
        inspeccion.llantasDetalle.forEach(llanta => {
            const minima = Math.min(llanta.externa, llanta.media, llanta.interna);
            html += `
                <div class="llanta-critica-card">
                    <h4>Llanta #${llanta.numero}</h4>
                    <div class="llanta-medida ${llanta.externa < 3 ? 'llanta-medida-critica' : ''}">Externa: ${llanta.externa} mm</div>
                    <div class="llanta-medida ${llanta.media < 3 ? 'llanta-medida-critica' : ''}">Media: ${llanta.media} mm</div>
                    <div class="llanta-medida ${llanta.interna < 3 ? 'llanta-medida-critica' : ''}">Interna: ${llanta.interna} mm</div>
                    <div style="margin-top: 8px; font-weight: 700; color: #dc2626;">Mínima: ${minima.toFixed(2)} mm</div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Elementos MALOS
    if (inspeccion.elementosMalos > 0) {
        html += `
            <div class="detalle-section">
                <h3>⚠️ Elementos con Estado MALO</h3>
                <div class="detalle-grid">
        `;
        
        inspeccion.malosDetalle.forEach(elemento => {
            html += `
                <div class="detalle-item detalle-item-malo">
                    <span class="detalle-item-label">${elemento}:</span>
                    <span class="detalle-item-value">❌ MALO</span>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Si no hay hallazgos
    if (inspeccion.llantasCriticas === 0 && inspeccion.elementosMalos === 0) {
        html += `
            <div class="detalle-section">
                <p class="info-text" style="background-color: #d1fae5; color: #065f46; padding: 16px; border-radius: 8px;">
                    ✅ <strong>Inspección satisfactoria</strong><br>
                    No se encontraron llantas críticas ni elementos en mal estado.
                </p>
            </div>
        `;
    }
    
    content.innerHTML = html;
    modal.style.display = 'flex';
}

function cerrarDetalleInspeccion() {
    const modal = document.getElementById('modalDetalleInspeccion');
    modal.style.display = 'none';
}

// Cerrar modales al hacer clic fuera
window.addEventListener('click', function(e) {
    const modalConsulta = document.getElementById('modalConsultaInspecciones');
    const modalDetalle = document.getElementById('modalDetalleInspeccion');
    
    if (e.target === modalConsulta) {
        cerrarConsultaInspecciones();
    }
    
    if (e.target === modalDetalle) {
        cerrarDetalleInspeccion();
    }
});