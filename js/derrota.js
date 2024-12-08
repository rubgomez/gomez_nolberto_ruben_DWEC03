'use strict'

// definimos las variables
let bnueva =document.querySelector("#nueva_partida")
let bsalir =document.querySelector("#salir")
let clickado = "iniciado"


// nueva partida-----------------------------------------------------------
// ponemos el nivel en blanco al pasar
bnueva.addEventListener("mouseover", function(){
     bnueva.style.background="white"
})

// controlamos que al salir se ha clicado el boton
bnueva.addEventListener("mouseout", function(){
    if(clickado=="nueva"){
     bnueva.style.background="white"
    }else{
     bnueva.style.background="rgb(187, 187, 187)"
    }
    
})

// intermedio-----------------------------------------------------------
bsalir.addEventListener("mouseover", function(){
     bsalir.style.background="white"
})

bsalir.addEventListener("mouseout", function(){
    if(clickado=="salir"){
     bsalir.style.background="white"
    }else{
     bsalir.style.background="rgb(187, 187, 187)"
    }
    
})

/*click*/

bnueva.addEventListener("click", function(){
    clickado="nueva"
    bnueva.style.background="white"
    bsalir.style.background="rgb(187, 187, 187)"
    window.location.href = "./bienvenida.html"
})

bsalir.addEventListener("click", function(){
    clickado="salir"
    bsalir.style.background="white"
    bnueva.style.background="rgb(187, 187, 187)"
    window.location.href = "../../index.html"
})

//Estadísticas----------------------------------------------------

$(document).ready(function(){

     let puntuacion=$(".resultados")
     let info=$(".informacion")

     // estos datos los guardé durante el login y serían del usuario activo
     let usuario_nombre= JSON.parse(localStorage.getItem('usuario_nombre'))
     let usuario_apellido= JSON.parse(localStorage.getItem('usuario_apellido'))

     // este dato lo guardé al inicar el juego para controlar los nivels
     let nivel= JSON.parse(localStorage.getItem('nivel'))

     // estos son los datos guardados de la partida
     let usuario_tiempo= JSON.parse(localStorage.getItem('tiempo_partida'))
     let usuario_vidas= JSON.parse(localStorage.getItem('vidas_partida'))
     let usuario_nivel= JSON.parse(localStorage.getItem('nivel_partida'))
     let usuario_puntos= JSON.parse(localStorage.getItem('puntuacion_partida'))

     // saco los dato de usuario en el aside
     info.text(usuario_nombre +" "+ usuario_apellido+ " ¡¡Has sido derrotado!!")

     // saco los datos de la partida en un div dentro del formulario
     puntuacion.append("<p>Tiempo consumido en la partida :"+usuario_tiempo+ "sg (empezaste con 100 sg) </p>")
     puntuacion.append("<p>Vidas consumidas en la partida :"+usuario_vidas+ " (empezaste con 3 vidas) </p>")
     puntuacion.append("<p>Nivel alcanzado en la partica :"+usuario_nivel+ " (empezaste en el nivel "+nivel+") </p>")
     puntuacion.append("<p>Puntuación alcanzada en la partida:"+usuario_puntos+ " puntos (empezaste con 0000000000 puntos) </p>")

})
     
    