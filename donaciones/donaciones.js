import { supabase } from '../supabase.js';
let donacionesCargadas=[]
async function cargarDonaciones() {
  const { data, error } = await supabase
    .from('donacion')
    .select(`
      id_donacion,
      fecha,
      donante_ubicacion:donante_ubicacion_id_punto (
        punto_venta,
        donantes:donantes_nit (
          razon_social
        )
      )
    `);

  if (error) {
    console.error('Error al cargar donaciones:', error);
    return;
  }
  donacionesCargadas=data;
  mostrarDonaciones(donacionesCargadas)
}
function mostrarDonaciones(lista) {
  const tabla = document.getElementById('tabla-donaciones');
  tabla.innerHTML = '';

  lista.forEach(d => {
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td>${d.id_donacion}</td>
      <td>${d.donante_ubicacion?.donantes?.razon_social || ''}</td>
      <td>${d.donante_ubicacion?.punto_venta || ''}</td>
      <td>${d.fecha || ''}</td>
      <td><button onclick="verDetalle(${d.id_donacion})" class="ver">Ver</button></td>
    `;

    tabla.appendChild(fila);
  });
}

function aplicarFiltro() {
  const nombre = document.getElementById('filtroDonante').value.toLowerCase();

  const filtrado = donacionesCargadas.filter(item => {
    const razonSocial = item.donante_ubicacion?.donantes?.razon_social?.toLowerCase() || '';
    return razonSocial.includes(nombre);
  });

  mostrarDonaciones(filtrado);
}

document.addEventListener('DOMContentLoaded', () => {
  cargarDonaciones();

  const nombreInput = document.getElementById('filtroDonante');
  nombreInput.addEventListener('input', aplicarFiltro);
});




async function cargarDetalle(id) {
    console.log('Cargando detalle para ID:', id);
  const { data: data2, error: error2 } = await supabase
    .from('donacion_item')
    .select(`
      cantidad,
      fecha_vencimiento,
      tipo_alimento:tipo_alimento_id_alimento (
        descripcion
      )
    `)
    .eq('donacion_id_donacion', id); // Filtra correctamente

  if (error2) {
    console.error('Error al cargar detalle de donación:', error2);
    return;
  }

  const tabla2 = document.getElementById('tablaProductos').querySelector('tbody');
  tabla2.innerHTML = ''; // Limpia tabla antes de insertar

  data2.forEach(d => {
    const fila2 = document.createElement('tr');
    fila2.innerHTML = `
      <td>${d.tipo_alimento?.descripcion || ''}</td>
      <td>${d.cantidad}</td>
      <td>${d.fecha_vencimiento || ''}</td>
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
document.addEventListener('DOMContentLoaded', cargarDonaciones);

window.aplicarFiltro = aplicarFiltro;