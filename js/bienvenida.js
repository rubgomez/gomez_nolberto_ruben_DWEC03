'use strict'

// definimos las variables
let bprincipiante =document.querySelector("#principiante")
let bintermedio =document.querySelector("#intermedio")
let bavanzado =document.querySelector("#avanzado")
let juego=document.querySelector("#juego")
let clickado = "iniciado"


// principiante-----------------------------------------------------------
// ponemos el nivel en blanco al pasar
bprincipiante.addEventListener("mouseover", function(){
    bprincipiante.style.background="white"
})

// controlamos que al salir se ha clicado el boton
bprincipiante.addEventListener("mouseout", function(){
    if(clickado=="principiante"){
    bprincipiante.style.background="white"
    }else{
    bprincipiante.style.background="rgb(187, 187, 187)"
    }
    
})

// intermedio-----------------------------------------------------------
bintermedio.addEventListener("mouseover", function(){
    bintermedio.style.background="white"
})

bintermedio.addEventListener("mouseout", function(){
    if(clickado=="intermedio"){
        bintermedio.style.background="white"
    }else{
        bintermedio.style.background="rgb(187, 187, 187)"
    }
    
})

// avanzado-----------------------------------------------------------
bavanzado.addEventListener("mouseover", function(){
    bavanzado.style.background="white"
})

bavanzado.addEventListener("mouseout", function(){
    if(clickado=="avanzado"){
        bavanzado.style.background="white"
    }else{
        bavanzado.style.background="rgb(187, 187, 187)"
    }
    
})

/*click*/

bprincipiante.addEventListener("click", function(){
    clickado="principiante"
    bprincipiante.style.background="white"
    bintermedio.style.background="rgb(187, 187, 187)"
    bavanzado.style.background="rgb(187, 187, 187)"
})

bintermedio.addEventListener("click", function(){
    clickado="intermedio"
    bprincipiante.style.background="rgb(187, 187, 187)"
    bintermedio.style.background="white"
    bavanzado.style.background="rgb(187, 187, 187)"
})

bavanzado.addEventListener("click", function(){
    clickado="avanzado"
    bprincipiante.style.background="rgb(187, 187, 187)"
    bintermedio.style.background="rgb(187, 187, 187)"
    bavanzado.style.background="white"
})

//cuando pinchamos en iniciar juego, abro la web del juego y le paso el nivel mediante el localStorage
juego.addEventListener("click", function(){
      localStorage.setItem('nivel', JSON.stringify(clickado))
      window.location.href = "./juego.html"
})

