import { supabase } from '../supabase.js';

let donadoresCargados = [];

async function cargarDonadores() {
  const { data, error } = await supabase
    .from('donantes')
    .select('*');

  if (error) {
    console.error('Error al obtener datos:', error);
    return;
  }

  donadoresCargados = data;
  mostrarDonadores(donadoresCargados);
}

function mostrarDonadores(lista) {
  const tabla = document.getElementById('tabla-donadores');
  tabla.innerHTML = '';

  lista.forEach(item => {
    const fila = document.createElement('tr');

    const celdaNIT = document.createElement('td');
    celdaNIT.textContent = item.nit;

    const celdaRazon = document.createElement('td');
    celdaRazon.textContent = item.razon_social;

    const celdaUbicaciones = document.createElement('td');
const botonUbicaciones = document.createElement('button');
botonUbicaciones.textContent = 'Ver ubicaciones';
botonUbicaciones.addEventListener('click', () => {
  verDetalle(item.nit); // <--- CORREGIDO AQUÍ
});
celdaUbicaciones.appendChild(botonUbicaciones);
    fila.appendChild(celdaNIT);
    fila.appendChild(celdaRazon);
    fila.appendChild(celdaUbicaciones);
    tabla.appendChild(fila);
  });
}

function aplicarFiltro() {
  const filtro = document.getElementById('filtroDonador').value.toLowerCase();

  const filtrado = donadoresCargados.filter(item =>
    item.razon_social.toLowerCase().includes(filtro)
  );

  mostrarDonadores(filtrado);
}

document.addEventListener('DOMContentLoaded', () => {
  cargarDonadores();

  const inputFiltro = document.getElementById('filtroDonador');
  inputFiltro.addEventListener('input', aplicarFiltro);
});


async function cargarDetalle(nit) {
  const { data: data2, error: error2 } = await supabase
    .from('donante_ubicacion')
    .select(`
      punto_venta
    `)
    .eq('donantes_nit', nit); // Filtra correctamente

  if (error2) {
    console.error('Error al cargar detalle de donante:', error2);
    return;
  }

  const tabla2 = document.getElementById('tabla-detalles');
  tabla2.innerHTML = ''; // Limpia tabla antes de insertar

  data2.forEach(d => {
    const fila2 = document.createElement('tr');
    fila2.innerHTML = `
      <td>${d.punto_venta}</td>
    `;
    tabla2.appendChild(fila2);
  });

}

window.verDetalle = function(nit) {
     document.getElementById("popup").style.display = "block";
  // Puedes mostrar un modal aquí si lo tienes implementado
    nit=parseInt(nit)
  cargarDetalle(nit); // ahora sí se llama a cargarDetalle correctamente
};

window.cerrarPopup=function() {
  document.getElementById("popup").style.display = "none";
}