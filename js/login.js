'use strict'

// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let usuariosJSON = null;
let usuariosJSONpath = './data/usuarios.json';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Usuarios JSON: ', usuariosJSON);

    cargardatos_LocalStorage();

    // Inicializar eventos el formularios
    document.getElementById('login').addEventListener('submit', login);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        usuariosJSON = await cargarJSON(usuariosJSONpath);


    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
//meto los datos recogidos del json en LocalStorage
function cargardatos_LocalStorage() {

    //limpio los datos del LocalStorage
    localStorage.clear()

    //para guardar los datos de un JSON al LocalStorage hay que pasarlo a string
    localStorage.setItem('user', JSON.stringify(usuariosJSON))
   
}
//compruebo usuario y contraseña del  LocalStorage
function login(event) {
    event.preventDefault()

    //obtengo el nombre y contraseña introducidos en el formulario
    let usu = document.getElementById('usuario').value
    let pw = document.getElementById('contrasena').value 

    //valido la contraseña con RegEx (caracteres alfanuméricos (números y letras)
    // ^ y $: Aseguran que la cadena comience y termine con el patrón.
    // (?=.*[a-zA-Z]): Asegura que haya al menos una letra (mayúscula o minúscula).
    // (?=.*\d): Asegura que haya al menos un número (cifra).
    // [a-zA-Z0-9]+: Permite cualquier combinación de letras (mayúsculas o minúsculas) y números.
    let regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/
    let comp_regex = regex.test(pw);

    //si no cumple saco un aviso y reseteo la contraseña
    if(comp_regex==false){
        console.log(comp_regex)
        document.getElementById('avisos_id').innerText ="La contraseña debe cumplir con un formato de caracteres alfanuméricos (números y letras)"
        document.getElementById('contrasena').value =""
    }else{

            // busco coincidencias en los datos cargados en el json
            // const buscausuario = usuariosJSON.find(usuario => usuario.usuario == usu)

            //para leer el LocalStorage hay que volverlo a pasar a JSON
            let datosusuario= JSON.parse(localStorage.getItem('user'))

            //busco coincidencias en los datos cargados en el LocalStorage
            let buscausuario = datosusuario.find(usuario => usuario.usuario == usu)

            //si el usuario existe compruebo la contraseña
            if(buscausuario){
                
                if(pw==buscausuario.contraseña){
                    //guardo el nombre y apellido para usarlo después en el programa
                    localStorage.setItem('usuario_nombre', JSON.stringify(buscausuario.nombre))
                    localStorage.setItem('usuario_apellido', JSON.stringify(buscausuario.apellido))
                    window.location.href = "./web/bienvenida.html"
                }else{
                    document.getElementById('avisos_id').innerText ="Contraseña incorrecta"
                }

            }else{
                document.getElementById('avisos_id').innerText ="Usuario no encontrado"
            }

    }


}


