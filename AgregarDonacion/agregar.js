import {supabase} from '../supabase.js';

let donantes = [];

async function cargarDonantes() {
  const { data, error } = await supabase.from('donantes').select('*');
  if (error) {
    console.error('Error al obtener datos:', error);
    return;
  }

  donantes = data;
  actualizarSelectDonantes(donantes); // Mostrar todos al inicio
}

function actualizarSelectDonantes(lista) {
  const select = document.getElementById('cbDonantes');
  select.innerHTML = '<option value="">Seleccione un donante</option>';
  
  lista.forEach(d => {
    const option = document.createElement('option');
    option.value = d.nit;
    option.textContent = d.razon_social;
    select.appendChild(option);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  cargarDonantes();
  cargarItems();
});


document.getElementById('filtroDonante').addEventListener('input', (e) => {
  const texto = e.target.value.toLowerCase();
  const select = document.getElementById('cbDonantes');

  // Buscar en el array de donantes la primera coincidencia
  const encontrado = donantes.find(d => d.razon_social.toLowerCase().includes(texto));

  if (encontrado) {
    select.value = encontrado.nit; // Establece el value del <select>
  } else {
    select.value = ''; // Si no encuentra, vuelve a la opción por defecto
  }
});

let ubicaciones=[]
async function cargarUbicaciones(nit){
    const { data, error } = await supabase.from('donante_ubicacion').select('*').eq('donantes_nit',nit);
  if (error) {
    console.error('Error al obtener datos:', error);
    return;
  }

  ubicaciones = data;
  actualizarSelectUbicaciones(ubicaciones);
}

function actualizarSelectUbicaciones(lista) {
  const select = document.getElementById('cbSucursal');
  
  lista.forEach(d => {
    const option = document.createElement('option');
    option.value = d.id_punto;
    option.textContent = d.punto_venta;
    select.appendChild(option);
  });
}
document.getElementById('cbDonantes').addEventListener('change',function(){
    
    let nit=document.getElementById('cbDonantes').value;
    console.log(nit)
    cargarUbicaciones(nit)
})


document.getElementById('filtroSucursal').addEventListener('input', (e) => {
  const texto = e.target.value.toLowerCase();
  const select = document.getElementById('cbSucursal');

  // Buscar en el array de donantes la primera coincidencia
  const encontrado = ubicaciones.find(d => d.punto_venta.toLowerCase().includes(texto));

  if (encontrado) {
    select.value = encontrado.id_punto; // Establece el value del <select>
  } else {
    select.value = ''; // Si no encuentra, vuelve a la opción por defecto
  }
});



let items=[];
async function cargarItems(){
    const { data, error } = await supabase.from('tipo_alimento').select('*');
  if (error) {
    console.error('Error al obtener datos:', error);
    return;
  }

  items = data;
  actualizarSelectItems(items)
}

function actualizarSelectItems(lista) {
  const select = document.getElementById('cbItem');
  select.innerHTML = '<option value="">Seleccione un item</option>';
  
  lista.forEach(d => {
    const option = document.createElement('option');
    option.value = d.id_alimento;
    option.textContent = d.descripcion;
    select.appendChild(option);
  });
}


document.getElementById('filtroItem').addEventListener('input', (e) => {
  const texto = e.target.value.toLowerCase();
  const select = document.getElementById('cbItem');

  // Buscar en el array de donantes la primera coincidencia
  const encontrado = items.find(d => d.descripcion.toLowerCase().includes(texto));

  if (encontrado) {
    select.value = encontrado.id_alimento; // Establece el value del <select>
  } else {
    select.value = ''; // Si no encuentra, vuelve a la opción por defecto
  }
});

let idsAlimentos = [];
let cantidades = [];
let fechas = [];

document.getElementById('btnAgregar').addEventListener('click', () => {
  const selectItem = document.getElementById('cbItem');
  const cantidad = document.getElementById('cantidad').value;
  const fecha = document.getElementById('fecha').value;
  const fechaFormateada = new Date(fecha).toISOString().split('T')[0]; // YYYY-MM-DD
  const [anio, mes, dia] = fechaFormateada.split('-');
  // Validación
  if (!selectItem.value || !cantidad || !fecha) {
    alert('Por favor completa todos los campos antes de agregar.');
    return;
  }

  const idAlimento = selectItem.value;
  const descripcionItem = selectItem.options[selectItem.selectedIndex].text;

  // Agregar fila a la tabla
  const fila = document.createElement('tr');
  fila.innerHTML = `
    <td>${descripcionItem}</td>
    <td>${cantidad}</td>
    <td>${dia}/${mes}/${anio}</td>
  `;
  document.getElementById('tabla-body').appendChild(fila);

  // Guardar en arreglos
  idsAlimentos.push(idAlimento);
  cantidades.push(parseInt(cantidad));
  fechas.push(fechaFormateada);
  console.log(fechaFormateada)

  // Limpiar campos
  selectItem.value = '';
  document.getElementById('cantidad').value = '';
  document.getElementById('fecha').value = '';


  console.log(items)
});


document.getElementById('btnRegistrar').addEventListener('click', () => {
  registrarDonacion();
});


async function registrarDonacion() {
  const nitRaw = document.getElementById('cbDonantes').value;
  const puntoRaw = document.getElementById('cbSucursal').value;
  const usuario = document.getElementById('txtVoluntario').value.trim();

  // Validaciones de campos obligatorios
  if (!nitRaw || isNaN(parseInt(nitRaw))) {
    alert('❌ Debes seleccionar un donante válido.');
    return;
  }

  if (!puntoRaw || isNaN(parseInt(puntoRaw))) {
    alert('❌ Debes seleccionar una sucursal válida.');
    return;
  }

  if (!usuario) {
    alert('❌ Debes ingresar el nombre del voluntario.');
    return;
  }

  if (idsAlimentos.length === 0 || cantidades.length === 0 || fechas.length === 0) {
    alert('❌ Debes agregar al menos un ítem a la donación.');
    return;
  }

  if (
    idsAlimentos.length !== cantidades.length ||
    cantidades.length !== fechas.length
  ) {
    alert('❌ Los arreglos de alimentos, cantidades y fechas deben tener el mismo tamaño.');
    return;
  }

  // Si todo está bien, convertir los valores
  const nit = parseInt(nitRaw);
  const punto = parseInt(puntoRaw);
  const hoy = new Date().toISOString().split('T')[0]; 
  const { data, error } = await supabase.rpc('registrar_donacion_multiple_2', {
    p_nit_donante:nit,
    p_id_punto: punto,
    p_fecha: hoy, // Usa formato 'YYYY-MM-DD'
    p_ids_alimentos: idsAlimentos,
    p_cantidades: cantidades,
    p_fechas_vencimiento: fechas,
    p_nombre_volutario: usuario
  });

  if (error) {
    console.error('❌ Error al registrar donación:', error);
  } else {
    console.log('✅ Donación registrada con éxito:', data);
    generarMensajePreDonacion(nit,punto,hoy,usuario,idsAlimentos,cantidades,fechas);
    document.getElementById('tabla-body').innerHTML = '';
    idsAlimentos = [];
    cantidades = [];
    fechas = [];
  }
}

function generarMensajePreDonacion(nit, punto, fecha, voluntario, ids_alimentos, cantidades, fechas) {
  const donador = donantes.find(d => d.nit === nit);
  const punto_v = ubicaciones.find(u => u.id_punto === punto);
  const nombreItem=[];

  for(let i=0;i<items.length;i++){
    for(let j=0;j<ids_alimentos.length;j++){
      if(items[i].id_alimento==ids_alimentos[j]){
        nombreItem.push(items[i].descripcion)
      }
    }
  }
  let mensaje = `Donación 

Donante: ${donador?.razon_social || 'Desconocido'} NIT: ${nit}
Punto de recolección: ${punto_v?.punto_venta || 'Desconocido'}
Fecha: ${fecha}
Voluntario responsable: ${voluntario}

📝 Detalle:\n`;

  for (let i = 0; i < nombreItem.length; i++) {
    const nombre = nombreItem[i];
    mensaje += `- Alimento: ${nombre}: ${cantidades[i]} unidades (vence: ${fechas[i]})\n`;
  }

  navigator.clipboard.writeText(mensaje)
    .then(() => {
      mostrarModalExito();
    })
    .catch(err => {
      console.error('❌ Error al copiar al portapapeles:', err);
    });
}


// Función para copiar al portapapeles
function copiarMensaje() {
  const mensaje = generarMensajePreDonacion(
    nitDonante,
    puntoNombre,
    fecha,
    voluntario,
    alimentos,
    cantidades,
    fechasVencimiento
  );

  navigator.clipboard.writeText(mensaje)
  
    .then(() => {
      mostrarModalExito();
    })
    .catch(err => {
      console.error('❌ Error al copiar al portapapeles:', err);
    });
}


function mostrarModalExito() {
  const modal = document.getElementById('modalExito');
  modal.style.display = 'block';

  setTimeout(() => {
    modal.style.display = 'none';
  }, 5000); // se oculta después de 3 segundos
}

