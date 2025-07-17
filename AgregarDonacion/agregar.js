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
  select.innerHTML = '<option value="">Seleccione una ubicacion</option>';
  
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




async function cargarItems(){
    
}