import { supabase } from '../supabase.js';

// index.js
window.abrirModalItem = function () {
  document.getElementById('modalItem').style.display = 'flex';
};
window.abrirModalDonante = function () {
  document.getElementById('modalDonador').style.display = 'flex';
};
window.abrirModalPunto = function () {
  document.getElementById('modalPunto').style.display = 'flex';
};
window.cerrarModalItem = function () {
  document.getElementById('modalItem').style.display = 'none';
  document.getElementById('itemDescripcion').value='';
};
window.cerrarModalDonante= function () {
  document.getElementById('modalDonador').style.display = 'none';
  document.getElementById('donadorNIT').value='';
  document.getElementById('donadorRazon').value='';
};
window.cerrarModalPunto= function () {
  document.getElementById('modalPunto').style.display = 'none';
  document.getElementById('puntoVenta').value='';
};

window.guardarItem =async function () {
  const descripcion = document.getElementById('itemDescripcion').value.trim();

  if (!descripcion) {
    alert('Por favor completa todos los campos correctamente.');
    return;
  }

  const { data, error } = await supabase
    .from('tipo_alimento')
    .insert([{ descripcion }]);

  if (error) {
    console.error('Error al insertar:', error);
    alert('Error al insertar el ítem.');
    return;
  }

  // Aquí iría la inserción real
  window.cerrarModalItem();
  alert('Item guardado (simulado)');
};
window.guardarDonante = async function () {
  const nit = document.getElementById('donadorNIT').value.trim();
  const razon = document.getElementById('donadorRazon').value.trim();

  if (!nit || !razon || isNaN(nit)) {
    alert('Por favor completa todos los campos correctamente.');
    return;
  }

  const { data, error } = await supabase
    .from('donantes')
    .insert([{ 
      nit: parseInt(nit), 
      razon_social: razon 
    }]);

  if (error) {
    console.error('Error al insertar:', error);
    alert('Error al insertar el donante.');
    return;
  }

  window.cerrarModalDonante();
  alert('Donante guardado exitosamente.');
};

window.guardarDonante = async function () {
  const nit = document.getElementById('donadorNIT').value.trim();
  const razon = document.getElementById('donadorRazon').value.trim();

  if (!nit || !razon || isNaN(nit)) {
    alert('Por favor completa todos los campos correctamente.');
    return;
  }

  const { data, error } = await supabase
    .from('donantes')
    .insert([{ 
      nit: parseInt(nit), 
      razon_social: razon 
    }]);

  if (error) {
    console.error('Error al insertar:', error);
    alert('Error al insertar el donante.');
    return;
  }

  window.cerrarModalDonante();
  alert('Donante guardado exitosamente.');
};


window.guardarPunto = async function () {
  const nit = document.getElementById('cbDonantes').value;
  const punto = document.getElementById('puntoVenta').value.trim();

  if (!nit || !punto|| isNaN(nit)) {
    alert('Por favor completa todos los campos correctamente.');
    return;
  }

  const { data, error } = await supabase
    .from('donante_ubicacion')
    .insert([{ 
      punto_venta:punto, 
      donantes_nit: nit 
    }]);

  if (error) {
    console.error('Error al insertar:', error);
    alert('Error al insertar el punto.');
    return;
  }

  window.cerrarModalPunto();
  alert('Donante guardado exitosamente.');
};


window.toggleFabMenu = function () {
  const menu = document.getElementById('fabMenu');
  const button = document.getElementById('fabMain');
  menu.classList.toggle('show');
  button.classList.toggle('rotate');
};
let donantes = [];

async function cargarDonantes() {
  const { data, error } = await supabase
    .from('donantes')
    .select('*');

  if (error) {
    console.error('Error al obtener datos:', error);
    return;
  }

  // Guardar los datos correctamente
  donantes = data;

  const select = document.getElementById('cbDonantes');

  // Limpiar opciones actuales y agregar una opción por defecto
  select.innerHTML = '<option value="">Seleccione un donante</option>';

  // Agregar cada donante como una opción
  donantes.forEach(d => {
    const option = document.createElement('option');
    option.value = d.nit;
    option.textContent = d.razon_social;
    select.appendChild(option);
  });
}


document.addEventListener('DOMContentLoaded', () => {
  cargarDonantes();
});
