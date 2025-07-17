import { supabase } from '../supabase.js';
let enviosCargados=[]
async function cargarEnvios() {
  const { data, error } = await supabase
  .from('envio')
  .select(`
    id_envio,
    fecha,
    voluntario,
    fundacion:fundaciones (
      nombre
    )
  `);


  if (error) {
    console.error('Error al cargar donaciones:', error);
    return;
  }
  enviosCargados=data;
  mostrarEnvios(enviosCargados)
  
}

function mostrarEnvios(lista) {
  const tabla = document.getElementById('tabla-envios');
  tabla.innerHTML = '';

  lista.forEach(d => {
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td>${d.id_envio}</td>
      <td>${d.fundacion.nombre }</td>
      <td>${d.fecha}</td>
      <td>${d.voluntario}</td>
      <td><button onclick="verDetalle(${d.id_envio})" class="ver">Ver</button></td>
    `;

    tabla.appendChild(fila);
  });
}

function aplicarFiltro() {
  const nombre = document.getElementById('filtroNombre').value.toLowerCase();

  const filtrado = enviosCargados.filter(item => {
    const coincideNombre = item.fundacion?.nombre.toLowerCase().includes(nombre);
    return coincideNombre;
  });

  mostrarEnvios(filtrado);
}


async function cargarDetalle(id) {
  console.log('Cargando detalle para ID:', id);

  const { data, error } = await supabase
    .from('envio_item')
    .select(`
      cantidad,
      tipo_alimento:tipo_alimento (
        descripcion
      )
    `)
    .eq('id_envio', id);

  if (error) {
    console.error('Error al cargar detalle de donación:', error);
    return;
  }

  const tabla2 = document.getElementById('tabla-detalles');
  tabla2.innerHTML = ''; // Limpia la tabla antes de insertar

  data.forEach(item => {
    const fila2 = document.createElement('tr');
    fila2.innerHTML = `
      <td>${item.tipo_alimento.descripcion}</td>
      <td>${item.cantidad}</td>
    `;
    tabla2.appendChild(fila2);
  });
}

window.verDetalle = function(id) {
    document.getElementById("popup").style.display = "block";
  // Puedes mostrar un modal aquí si lo tienes implementado
  console.log('Ver detalle de donación:', id);
  cargarDetalle(id); // ahora sí se llama a cargarDetalle correctamente
};

window.cerrarPopup=function() {
  document.getElementById("popup").style.display = "none";
}
document.addEventListener('DOMContentLoaded', cargarEnvios);
window.aplicarFiltro = aplicarFiltro;

document.addEventListener('DOMContentLoaded', () => {
  cargarEnvios();

  const nombreInput = document.getElementById('filtroNombre');

  // Ejecuta aplicarFiltro automáticamente al cambiar los inputs
  nombreInput.addEventListener('input', aplicarFiltro);
});
