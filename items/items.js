import { supabase } from '../supabase.js';

let itemsCargados = [];

async function cargarItems() {
  const { data, error } = await supabase
    .from('tipo_alimento')
    .select(`
      id_alimento,
      descripcion,
      donacion_item:donacion_item (
        stock
      )
    `);

  if (error) {
    console.error('Error al obtener datos:', error);
    return;
  }

  itemsCargados = data;
  mostrarItems(itemsCargados);
}

function mostrarItems(lista) {
  const tabla = document.getElementById('tabla-items');
  tabla.innerHTML = ''; // Limpia la tabla

  lista.forEach(item => {
    const fila = document.createElement('tr');

    const celdaId = document.createElement('td');
    celdaId.textContent = item.id_alimento;

    const celdaDescripcion = document.createElement('td');
    celdaDescripcion.textContent = item.descripcion;

    const totalStock = item.donacion_item?.reduce((sum, it) => sum + (it.stock || 0), 0) || 0;
    const celdaStock = document.createElement('td');
    celdaStock.textContent = totalStock;

    fila.appendChild(celdaId);
    fila.appendChild(celdaDescripcion);
    fila.appendChild(celdaStock);

    tabla.appendChild(fila);
  });
}

function aplicarFiltro() {
  const filtro = document.getElementById('filtroDescripcion').value.toLowerCase();

  const filtrado = itemsCargados.filter(item =>
    item.descripcion.toLowerCase().includes(filtro)
  );

  mostrarItems(filtrado);
}

document.addEventListener('DOMContentLoaded', () => {
  cargarItems();

  const inputFiltro = document.getElementById('filtroDescripcion');
  inputFiltro.addEventListener('input', aplicarFiltro);
});
