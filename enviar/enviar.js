import { supabase } from '../supabase.js';
let items=[];
async function cargarItems(){
    const { data, error } = await supabase.rpc('obtener_stock_por_alimento');

if (error) {
  console.error("Error ejecutando la función:", error.message);
} else {
  console.log("Resultado:", data);
}
items=data;
console.log(items)
actualizarItems(items)
}
let fundaciones=[];
async function cargarFundaciones(){
    const {data,error}=await supabase.from('fundaciones').select('*');
    if (error) {
        console.error('Error al obtener datos:', error);
        return;
    }
    fundaciones=data;
    actualizarFundaciones(fundaciones)
}
function actualizarFundaciones(lista){
    const select = document.getElementById('cbFundacion');
    select.innerHTML = '<option value="">Seleccione una fundacion</option>';
    lista.forEach(d => {
        const option = document.createElement('option');
        option.value = d.id_fundacion;
        option.textContent = d.nombre;
        select.appendChild(option);
    });
}


function actualizarItems(lista){
    const select = document.getElementById('cbItem');
  select.innerHTML = '<option value="">Seleccione un donante</option>';
  
  lista.forEach(d => {
    const option = document.createElement('option');
    option.value = d.id_alimento;
    option.textContent = d.descripcion+'| Cantidad: '+d.total_stock;
    select.appendChild(option);
  });
}
document.addEventListener('DOMContentLoaded', function () {
  cargarItems();
  cargarFundaciones();
});

let idsAlimentos=[]
let cantidades=[]
document.getElementById('btnAgregar').addEventListener('click', () => {
  const selectItem = document.getElementById('cbItem');
  const cantidad = document.getElementById('cantidad').value;
  // Validación
  if (!selectItem.value || !cantidad ) {
    alert('Por favor completa todos los campos antes de agregar.');
    return;
  }

  const idAlimento = selectItem.value;
  const descripcionItem = selectItem.options[selectItem.selectedIndex].text;
    const primeraParte = descripcionItem.split('|')[0].trim();

  // Agregar fila a la tabla
  const fila = document.createElement('tr');
  fila.innerHTML = `
    <td>${primeraParte}</td>
    <td>${cantidad}</td>
  `;
  document.getElementById('tabla-body').appendChild(fila);

  // Guardar en arreglos
  idsAlimentos.push(idAlimento);
  cantidades.push(parseInt(cantidad));

  // Limpiar campos
  selectItem.value = '';
  document.getElementById('cantidad').value = '';


  console.log(items)
});



async function realizarEnvio(){
    const fundacion_id=document.getElementById('cbFundacion').value;
    
    const voluntario=document.getElementById('txtVoluntario').value;
    if(!fundacion_id || !voluntario || idsAlimentos==0){
        alert('Ingrese todos los datos requeridos')
        return;
    }
      const { data, error } = await supabase.rpc('realizar_envio', {
        p_id_fundacion:fundacion_id,
        p_ids_alimentos: idsAlimentos,
        p_cantidades: cantidades, // Usa formato 'YYYY-MM-DD'
        p_voluntario: voluntario
      });
    
      if (error) {
        console.error('❌ Error al registrar envio:', error);
      } else {
        mostrarModalExito();
        console.log('✅ Envio registrada con éxito:', data);
        document.getElementById('tabla-body').innerHTML = '';
        idsAlimentos = [];
        cantidades = [];
      }
}

document.getElementById('btnRegistrar').addEventListener('click', () => {
  realizarEnvio();
});

function mostrarModalExito() {
  const modal = document.getElementById('modalExito');
  modal.style.display = 'block';

  setTimeout(() => {
    modal.style.display = 'none';
  }, 5000); // se oculta después de 3 segundos
}
