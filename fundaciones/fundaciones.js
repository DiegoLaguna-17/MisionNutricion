import { supabase } from '../supabase.js';

let fundacionesCargadas = [];

async function cargarFundaciones() {
      const { data, error } = await supabase.rpc('conteo_envios_por_fundacion');
  
  if (error) {
    console.error("Error ejecutando la función:", error.message);
  } else {
    console.log("Resultado:", data);
  }
  fundacionesCargadas =data;
  mostrarFundaciones(fundacionesCargadas)
}

function mostrarFundaciones(lista) {
  const tabla = document.getElementById('tabla-fundaciones');
  tabla.innerHTML = '';

  lista.forEach(f => {
    const fila = document.createElement('tr');

    const celdaID = document.createElement('td');
    celdaID.textContent = f.id_fundacion;

    const celdaNombre = document.createElement('td');
    celdaNombre.textContent = f.nombre;

    const celdaEnvios = document.createElement('td');
    celdaEnvios.textContent=f.total_envios;

    fila.appendChild(celdaID);
    fila.appendChild(celdaNombre);
    fila.appendChild(celdaEnvios);
    tabla.appendChild(fila);
  });
}

function aplicarFiltro() {
  const filtro = document.getElementById('filtroFundacion').value.toLowerCase();

  const filtrado = fundacionesCargados.filter(item =>
    item.nombre.toLowerCase().includes(filtro)
  );

  mostrarFundaciones(filtrado);
}

document.addEventListener('DOMContentLoaded', () => {
  cargarFundaciones();

  const inputFiltro = document.getElementById('filtroFundacion');
  inputFiltro.addEventListener('input', aplicarFiltro);
});

