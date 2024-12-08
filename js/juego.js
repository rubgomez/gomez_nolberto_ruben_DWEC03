'use strict'

//----------------------------definimos variables ----------------------------------------------------------

    //canvas (chatgpt)
    const canvas = document.getElementById('juego_id');
    const ctx = canvas.getContext('2d');
    var canvas_juego =$("canvas")

    //numéricos
    var filas = 0
    var columnas = 0
    var tamañoCuadrado = 0
    var puntos_nivel=0
    var puntos_subir_nivel=0
    var minimo_nivel =0
    var maximo_nivel =0
    var sleep_nivel =0
    var sleep_disparo_inicio=10
    var sleep_disparo_fin=20  
    
    //avisos
    var avisos =$("#avisos_id")
    var aviso_temp=""
    var avisos_hist =$("#avisos_hist_id")
    //puntos
    var puntuacion =$("#puntuacion_id")
    var puntuacion_temp ="0000000000"
    //nivel    
    var nivel =$("#nivel_id")
    var nivel_temp=""
    var siguiente_nivel=""
    var nivel_color=""
    //vidas
    var vidas =$("#vidas_id")
    var vidas_temp="3"
    //tiempo
    var tiempo =$("#tiempo_id")
    var tiempo_temp="100"
    
    //sw
    var cambio_nivel=true
    var partida=true
    var disparado=false

    // arrays
    var avisos_hist_temp=[]   
    var nave=[]
    var disparos=[]
    var enemigo=[]
    var enemigos=[]

//---------------------------carga de la página-------------------------------------------------------------


window.addEventListener('load', function() {

    //valores iniciales
    puntuacion.text(puntuacion_temp)
    nivel_temp=JSON.parse(localStorage.getItem('nivel'))
    nivel.text(nivel_temp) 
    vidas.text(vidas_temp)

    tiempo.text(tiempo_temp)   
    aviso_temp="Puntuación, Nivel, Vidas y Tiempo de partida inicializados..."
    avisos_pantalla()

    comenzar_juego()

})

//---------------------------funciones principales---------------------------------------------

async function comenzar_juego(){

    //valores iniciales partida
    tiempo_temp=parseFloat(tiempo_temp)
    vidas_temp=parseFloat(vidas_temp)

    let tiempo_consumido=0
    let vidas_hist=vidas_temp

    //bucle para controlar vidas y tiempo
    for (let i=tiempo_temp; i>=0 && vidas_temp>0 && nivel_temp !='victoria'; i--){

        // control del tiempo (un sleep de toda la vida, pero que en javascript parece que es asyncrono)
        await sleep(1000)

        if(cambio_nivel==true){

            //bloqueo que no se pueda mover la nave mientras se cambia de nivel
            $(document).off('keydown');

            //inicializo todo por nivel
            color(avisos, "red")
            borrar_nave()
            borrar_enemigos()
            enemigo=[]
            enemigos=[]
            borrar_tablero()
            //resetear el canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //cargo datos por nivel
            inicializa()

            //mensajes de inicio controlando que no se haya pasado el juego
                if(nivel_temp !='victoria'){
                await sleep(2000)
                pintar_tablero()
                aviso_temp="Tablero de juego cargado..."
                avisos_pantalla()
                await sleep(1000)
                pintar_nave()
                aviso_temp="Nave cargada..."
                avisos_pantalla()
                await sleep(1000)
                color(avisos, "red")
                aviso_temp="La partida comienza en 3..."
                avisos_pantalla()
                await sleep(1000)
                aviso_temp="2..."
                avisos_pantalla()
                await sleep(1000)
                aviso_temp="1...."
                avisos_pantalla()
                await sleep(1000)
                aviso_temp="¡¡YA...!!"
                avisos_pantalla()
                await sleep(1000)
                }

            //bandera para que sólo entre cuando hay cambio de nivel o se inice la partida
            cambio_nivel=false

            //si se cambia de nivel hay que generar a los enemigos e iniciar la partida
            if(i<=100){
            partida=true
            crear_nuevo_enemigo()
            inicia_partida()
            }
        }        

        //actualizo datos del tiempo
        tiempo_consumido=i
        tiempo.text(i.toString()) 
   
    }

    //para la partida
    partida=false

    //desactivo la escucha
    $(document).off('keydown');  

    //calculo datos para estadisticas
    tiempo_temp=tiempo_temp-tiempo_consumido
    vidas_hist=vidas_hist-vidas_temp

    //guardo los datos de la partida en el localStorage   
    localStorage.setItem('tiempo_partida', JSON.stringify(tiempo_temp))
    localStorage.setItem('vidas_partida', JSON.stringify(vidas_hist))
    localStorage.setItem('nivel_partida', JSON.stringify(nivel_temp))
    localStorage.setItem('puntuacion_partida', JSON.stringify(puntuacion_temp))

     //compruebo el motivo del fin de partida
     if (vidas_temp==0){
        aviso_temp="Derrota. ¡¡ PERDISTE TODAS LAS VIDAS!!"    
        avisos_pantalla()
       //perdidas las vidas vamos a la pantalla de derrota   
        await sleep(10000)
        window.location.href = "./derrota.html"
    }else if (nivel_temp == "victoria"){
        aviso_temp="Victoria. ¡¡ ELIMINASTE A TODOS LOS ENEMIGOS!!"    
        avisos_pantalla()
        //superados los 3 niveles victoria
        await sleep(10000)
        window.location.href = "./victoria.html"
    }else {
        aviso_temp="Se acabo el tiempo. ¡¡ PARTIDA FINALIZADA!!"    
        avisos_pantalla()
        //pasado el tiempo volvemos al index   
        await sleep(10000)
        window.location.href = "../../index.html"
    }

}

async function inicia_partida(){

     aviso_temp=""
     
        // activo la escucha de teclas presionadas(chatgpt)
        $(document).keydown(function(event) {
            // Obtiene el código de la tecla presionada(chatgpt)
            var tecla = event.which || event.keyCode
            color(avisos, "blue")
            
            switch (tecla){

                case 27:
                    aviso_temp="¡tecla de pausa pulsada! Pulse CUALQUIER tecla para continuar..."
                    avisos.text(aviso_temp)
                    avisos_pantalla()
                    // desactivo la escucha de teclas presionadas(chatgpt)
                    $(document).off('keydown');
                    partida=false
                    reactivar_partida()

                break

                case 32:
                    // desactivo la escucha de teclas presionadas hasta que termine el disparo
                    
                    aviso_temp="¡Disparo Realizado!"
                    avisos.text(aviso_temp)
                    avisos_pantalla()
                    disparar()
                    // desactivo la escucha de teclas presionadas(chatgpt)
                    $(document).off('keydown');
                    mover_nave('igual')                    
                break

                case 37:
                    aviso_temp="¡tecla izquierda pulsada!"
                    avisos.text(aviso_temp)
                    avisos_pantalla()                    
                    borrar_nave()
                    mover_nave('izquierda')
                    pintar_nave()
                break

                case 39:
                    aviso_temp="¡tecla derecha pulsada!"
                    avisos.text(aviso_temp)
                    avisos_pantalla()                    
                    borrar_nave()
                    mover_nave('derecha')
                    pintar_nave()
                break
         
            }
        
        });

}

async function reactivar_partida() {

    $(document).keydown(function(event) {
    
    // al estar desactivada la escucha no se puede elegir con que tecla reanudar...
    aviso_temp="¡tecla de reanudación pulsada!."
    avisos.text(aviso_temp)
    avisos_pantalla()
    // desactivo la escucha de teclas presionadas(chatgpt)
    $(document).off('keydown');
    partida=true
    
    borrar_nave()
    pintar_nave()
    crear_nuevo_enemigo()
    inicia_partida()

    });

}

//----------------------------funciones reutilizables-------------------------------------------------------

//sacar los avisos por pantalla
function avisos_pantalla(){
    // saco los datos del aviso en el aside (OJO!!! TEXT)
    avisos.text(aviso_temp)
    // almaceno los datos del aviso en el array de históricos 
    aviso_historico()
    // asingo a una variable los pares valor mediante MAP para poderlos pintar, sino sale [Objetc]
    let avisos_texto = avisos_hist_temp.map(aviso => `<p>${aviso.fh} : ${aviso.ms}</p>`)
    // saco los datos por el footer (OJO!!! HTML)
    avisos_hist.html(avisos_texto)     
}

// añadir datos a array avisos_hist_temp con fecha y hora
function aviso_historico(){

    let fecha =new Date()
    let fecha_formato = fecha.toLocaleDateString()
    let hora_formato = fecha.toLocaleTimeString()

    let aviso={
        fh: "-("+fecha_formato +")"+ hora_formato,
        ms: aviso_temp
    }
    // Unshift añade al principio, push al final
    avisos_hist_temp.unshift(aviso)
}

//sleep usando Promise y setTimeout(chatgpt)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

//Genera un número aleatorio entre un mínimo y un máximo → Math.random()
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//resetear arrays
function array_reseteo(){
    nave=[]
    disparos=[]
    enemigo=[]
    enemigos=[]
}

//cambiar color texto

function color(clase_color, color){
    clase_color.css("color",color)
}

//inicializa en función del nivel
function inicializa(){

    switch(nivel_temp){

        case "principiante":
        // tablero
        filas = 10
        columnas = 20
        tamañoCuadrado = 33.9
        // Definir posiciones para la nave que se pintará de azul
        nave = [
            { fila: 9, col: 8 },  
            { fila: 9, col: 9 }, 
            { fila: 9, col: 10 }
        ]
        // aprovecho para inicializar el disparo, sin pintar
        disparos = [
        
            { fila: 9, col: 9 }
        ] 
        // inicializo resto
        minimo_nivel=2
        maximo_nivel=18
        sleep_nivel =2000
        puntos_nivel=1000
        puntos_subir_nivel=10000
        siguiente_nivel="intermedio"
        nivel_color="green"
        break

        case "intermedio":   
        // tablero
        filas = 12
        columnas = 23
        tamañoCuadrado = 29.6
        // Definir posiciones para la nave que se pintará de azul
        nave = [
            { fila: 11, col: 10 },  
            { fila: 11, col: 11 }, 
            { fila: 11, col: 12 }
        ]
        // aprovecho para inicializar el disparo, sin pintar
        disparos = [
        
            { fila: 11, col: 11 }
        ]
        // inicializo resto
        minimo_nivel=2
        maximo_nivel=20
        sleep_nivel =1750
        puntos_nivel=2000
        puntos_subir_nivel=40000
        siguiente_nivel="avanzado"
        nivel_color="lime"
        break

        case "avanzado": 
        // tablero
        filas = 14
        columnas = 26
        tamañoCuadrado = 26.1
        // Definir posiciones para la nave que se pintará de azul
        nave = [
            { fila: 13, col: 12 },  
            { fila: 13, col: 13 }, 
            { fila: 13, col: 14 }
        ]
        // aprovecho para inicializar el disparo, sin pintar
        disparos = [
        
            { fila: 13, col: 13 }
        ] 
        // inicializo resto
        minimo_nivel=2
        maximo_nivel=24
        sleep_nivel =1500   
        puntos_nivel=3000
        puntos_subir_nivel=100000
        siguiente_nivel="victoria"
        nivel_color="olive"
        break

    }
    
}
//----------------------------funciones pintar-------------------------------------------------------

//pintar tablero
function pintar_tablero(){
    for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < columnas; col++) {
            // Dibujar cada cuadrado(chatgpt)
            ctx.strokeStyle = 'black';  // Color del borde de cada cuadrado
            ctx.strokeRect(col * tamañoCuadrado, fila * tamañoCuadrado, tamañoCuadrado, tamañoCuadrado);
        }
    }
}

// Pintar nave
function pintar_nave(){

    for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < columnas; col++) {
            //veriifica posición de la nave(chatgpt)
            const pos_nave = nave.some(pos => pos.fila === fila && pos.col === col);

            if(pos_nave){
            // Dibujar cada cuadrado(chatgpt)
            ctx.fillStyle = 'blue'; 
            ctx.fillRect(col * tamañoCuadrado, fila * tamañoCuadrado, tamañoCuadrado, tamañoCuadrado); 
            }
        }
    }

}

// Pintar nave fin
function pintar_nave_fin(){

    for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < columnas; col++) {
            //verifica posición de la nave(chatgpt)
            const pos_nave = nave.some(pos => pos.fila === fila && pos.col === col);

            if(pos_nave){
            // Dibujar cada cuadrado(chatgpt)
            ctx.fillStyle = 'red'; 
            ctx.fillRect(col * tamañoCuadrado, fila * tamañoCuadrado, tamañoCuadrado, tamañoCuadrado); 
            }
        }
    }

}

//pintar_enemigos
function pintar_enemigos(nivel_color){
    for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < columnas; col++) {
            //veriifica posición de la nave(chatgpt)
            const pos_nave = enemigos.some(pos => pos.fila === fila && pos.col === col);

            if(pos_nave){
            // Dibujar cada cuadrado(chatgpt)
            ctx.fillStyle = nivel_color; 
            ctx.fillRect(col * tamañoCuadrado, fila * tamañoCuadrado, tamañoCuadrado, tamañoCuadrado); 
            }
        }
    }

}

// Pintar disparo
function pintar_disparos(){

    for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < columnas; col++) {
            //veriifica posición del disparo(chatgpt)
            const pos_disparos = disparos.some(pos => pos.fila === fila && pos.col === col);

            if(pos_disparos){
            // Dibujar cada cuadrado(chatgpt)
            ctx.fillStyle = 'red'; 
            ctx.fillRect(col * tamañoCuadrado + tamañoCuadrado / 2, fila * tamañoCuadrado, 5, tamañoCuadrado);
            }
        }
    }

}

//----------------------------funciones borrar-------------------------------------------------------
// borrar nave
function borrar_nave(){

    for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < columnas; col++) {
            //veriifica posición de la nave(chatgpt)
            const pos_nave = nave.some(pos => pos.fila === fila && pos.col === col);

            if(pos_nave){
            // Dibujar cada cuadrado(chatgpt)
            ctx.fillStyle = 'rgb(187, 187, 187)'
            ctx.strokeStyle = 'black';
            ctx.fillRect(col * tamañoCuadrado, fila * tamañoCuadrado, tamañoCuadrado, tamañoCuadrado); 
            ctx.strokeRect(col * tamañoCuadrado, fila * tamañoCuadrado, tamañoCuadrado, tamañoCuadrado);
            }
        }
    }

}

//borrar enemigos
function borrar_enemigos(){
    for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < columnas; col++) {
            //veriifica posición de la nave(chatgpt)
            const pos_nave = enemigos.some(pos => pos.fila === fila && pos.col === col);

            if(pos_nave){
            // Dibujar cada cuadrado(chatgpt)
            ctx.fillStyle = 'rgb(187, 187, 187)'
            ctx.strokeStyle = 'black';
            ctx.fillRect(col * tamañoCuadrado, fila * tamañoCuadrado, tamañoCuadrado, tamañoCuadrado); 
            ctx.strokeRect(col * tamañoCuadrado, fila * tamañoCuadrado, tamañoCuadrado, tamañoCuadrado);
            }
        }
    }

}

// borrar disparo
function borrar_disparos(){

    for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < columnas; col++) {
            //veriifica posición de la nave(chatgpt)
            const pos_disparos = disparos.some(pos => pos.fila === fila && pos.col === col);

            if(pos_disparos){
            // Dibujar cada cuadrado(chatgpt)
            ctx.fillStyle = 'rgb(187, 187, 187)'
            ctx.strokeStyle = 'black';
            ctx.fillRect(col * tamañoCuadrado, fila* tamañoCuadrado, tamañoCuadrado, tamañoCuadrado); 
            ctx.strokeRect(col * tamañoCuadrado, fila * tamañoCuadrado, tamañoCuadrado, tamañoCuadrado);
            }
        }
    }

}

//borrar tablero
function borrar_tablero(){
    for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < columnas; col++) {
            // Dibujar cada cuadrado(chatgpt)
            ctx.strokeStyle = 'transparent'; 
            ctx.strokeRect(col * tamañoCuadrado, fila * tamañoCuadrado, tamañoCuadrado, tamañoCuadrado);
        }
    }
}




//----------------------------funciones enemigos------------------------------------------------

// cargar enemigos mientras la partida esté activa
async function crear_nuevo_enemigo(){
    while(partida==true){
    inicializar_enemigo(minimo_nivel, maximo_nivel, nivel_temp)
    pintar_enemigos(nivel_color)
    await sleep(sleep_nivel)
    borrar_enemigos()
    mover_enemigos() 
    if(partida==true){
        pintar_enemigos(nivel_color)
    }else{
        pintar_enemigos("red")

    }
    
    }
}

//inicializar enemigos
function inicializar_enemigo(min,max, niv){

    let random1=0
    let random2=0
    let random3=0

    //saco una posición mediante un randomize (seguramente haya una forma mejor de hacer esto pero no tengo tiempo para mas...)
    random1=getRandomInt(min,max)

    do { random2=getRandomInt(min,max)} 
    while (random2==random1 || random2==random1-1 || random2==random1-2 || random2==random1+2 || random2==random1+1)

    do { random3=getRandomInt(min,max)} 
    while (random3==random1 || random3==random1-1 || random3==random1-2 || random3==random1+1 || random3==random1+2 || random3==random2 || random3==random2-1 || random3==random2-2 || random3==random2+1 || random3==random2+2)

    // Definir posiciones para el enemigo según niveles

    switch (niv){

        case "principiante":
        enemigo = [
            { fila: 0, col: random1-1, xxx: "izq", nivel: niv},  
            { fila: 0, col: random1, xxx: "ctr", nivel, niv}, 
            { fila: 0, col: random1+1, xxx: "der", nivel, niv}  
        ];
        break

        case "intermedio":
            enemigo = [
                { fila: 0, col: random1-1, xxx: "izq", nivel: niv},  
                { fila: 0, col: random1, xxx: "ctr", nivel, niv}, 
                { fila: 0, col: random1+1, xxx: "der", nivel, niv},
                { fila: 0, col: random2-1, xxx: "izq", nivel: niv},  
                { fila: 0, col: random2, xxx: "ctr", nivel, niv}, 
                { fila: 0, col: random2+1, xxx: "der", nivel, niv}               
            ];
        break

        case "avanzado":
            enemigo = [
                { fila: 0, col: random1-1, xxx: "izq", nivel: niv},  
                { fila: 0, col: random1, xxx: "ctr", nivel, niv}, 
                { fila: 0, col: random1+1, xxx: "der", nivel, niv},
                { fila: 0, col: random2-1, xxx: "izq", nivel: niv},  
                { fila: 0, col: random2, xxx: "ctr", nivel, niv}, 
                { fila: 0, col: random2+1, xxx: "der", nivel, niv}, 
                { fila: 0, col: random3-1, xxx: "izq", nivel: niv},  
                { fila: 0, col: random3, xxx: "ctr", nivel, niv}, 
                { fila: 0, col: random3+1, xxx: "der", nivel, niv},             
            ];
        break

    }

    // añado el enemigo creado al array enemigoS (también se podría hacer con un for añadiendo cada elemento o pero no funciona push)
    for (let i = 0; i < enemigo.length; i++) {
        enemigos.unshift(enemigo[i]);
    }

}

//mover enemigos
function mover_enemigos(){

    //con map cambiaremos los valores del array
    enemigos = enemigos.map((pos, index) => {
        
        let fila = pos.fila
        let columna = pos.col
        let xxx = pos.xxx

        //movemos
        fila=fila+2

        // si el enemigo llega a la última posición permitida se pierde 1 vida
        if(fila==filas && xxx=="ctr" && vidas_temp>0){

            vidas_temp=vidas_temp-1  
                if(vidas_temp>0){
                    aviso_temp="Pierdes 1 vida"  
                }

            avisos_pantalla()    
            vidas.text(vidas_temp)  
            borrar_nave()
            pintar_nave_fin()

        }

        return {
            fila: fila,
            col: columna,
            xxx: xxx
        };
    
    });
    
}

//----------------------------funciones de momimiento------------------------------------------

//mover nave
async function mover_nave(direccion){

    //con map cambiaremos los valores del array
    nave = nave.map((pos, index) => {
        
        let fila = pos.fila
        let columna = pos.col

        //además del sentido, comprobamos que no se salga de los límites mediante el index
        if(direccion=='derecha'){
            if (index ==0 && columna<columnas-3){
                columna= columna+1
            }
            if (index ==1 && columna<columnas-2){
                columna= columna+1
                // aprovecho para reinicializar el disparo, sin pintar
                disparos = [

                    { fila: fila, col: columna }
                ]
            }
            if (index ==2 && columna<columnas-1){
                columna= columna+1
            }       
        }else if (direccion=='izquierda'){
            if (index ==0 && columna>0){
                columna= columna-1
            }
            if (index ==1 && columna>1){
                columna= columna-1
                // aprovecho para reinicializar el disparo, sin pintar
                disparos = [

                    { fila: fila, col: columna }
                ]
            }
            if (index ==2 && columna>2){
                columna= columna-1
            }               
        }else if (direccion=='igual'){
            if (index ==0){
                columna= columna
            }
            if (index ==1){
                columna= columna
                // aprovecho para reinicializar el disparo, sin pintar
                disparos = [

                    { fila: fila-1, col: columna }
                ]
            }
            if (index ==2){
                columna= columna
            }               
        }

        return {
            fila: fila,
            col: columna
        };

        

    });

}

// disparar
async function disparar(){

    aviso_temp=""
    color(avisos, "red")

    for (let i=1; i<filas && aviso_temp=="" ; i++){

        //con map cambiaremos los valores del array
        disparos = disparos.map((pos, index) => {
                
        let fila = pos.fila
        let columna = pos.col

        fila=fila-1

        // Verifica si el disparo coincide con alguna posición de las naves enemigas
        const pos_nave = enemigos.some(pos => pos.fila === fila && pos.col === columna)

        // Si encontramos coincidencia con la nave o si el disparo llega al final activamos de nuevo la partida
        if (pos_nave) {
            aviso_temp = `¡Nave alcanzada` 
            color(avisos, "green")


                // paso a formato número para hacer la suma
                puntuacion_temp=parseFloat(puntuacion_temp)+puntos_nivel
                // paso a formato texto y relleno con ceros hasta 10 dígitos
                puntuacion_temp= puntuacion_temp.toString().padStart(10, '0')
                puntuacion.text(puntuacion_temp)

                //cambiamos de nivel si se superan los puntos necesarios
                if(puntuacion_temp>=puntos_subir_nivel){                    
                                    
                    //activamos el cambio de nivel y suspendemos la partida
                    cambio_nivel=true
                    partida=false
                    // desactivo la escucha de teclas presionadas(chatgpt)
                    $(document).off('keydown');

                    aviso_temp = aviso_temp + " obtienes " + puntos_nivel + " PUNTOS!" + " y subes de NIVEL"
                    nivel_temp = siguiente_nivel
                    nivel.text(nivel_temp)

                }else{
                    aviso_temp = aviso_temp + " obtienes " + puntos_nivel + " PUNTOS!" 
                }                

                // buscamos el índice en el array
                const indice = enemigos.findIndex(pos => pos.fila === fila && pos.col === columna);

                borrar_enemigos()
                
                // borramos la nave enemiga en función del índice según punto de impacto
                switch (enemigos[indice].xxx){

                    case "ctr":
                        enemigos.splice(indice+1, 1)
                        enemigos.splice(indice, 1)
                        enemigos.splice(indice-1, 1)
                    break

                    case "der":
                        enemigos.splice(indice+2, 1)
                        enemigos.splice(indice+1, 1)
                        enemigos.splice(indice, 1)
                    break

                    case "izq":
                        enemigos.splice(indice, 1)
                        enemigos.splice(indice-1, 1)
                        enemigos.splice(indice-2, 1)
                    break

                    }

                pintar_enemigos(nivel_color)
                
        // si llegamos al final sin acierto 
        } else if(fila==0){
            aviso_temp = `¡Nave NO alcanzada`
        }

        return {
            fila: fila,
            col: columna
        };
    
        });

        //pintamos el disparo con un pequeño retardo para que se vea
        await sleep(sleep_disparo_inicio)
        pintar_disparos()
        await sleep(sleep_disparo_fin)
        borrar_disparos()

    }

    //sacamos los avisos y volvemos a activar la partida
    avisos_pantalla()
    inicia_partida()
     
}