
let listaImagenes = [];

// función para el botón Exportar GIF
function exportGif() {
   

    // contar el número de acordes
    const acordes = document.querySelectorAll('.acorde');
    const numAcordes = acordes.length;

    // Oobtener el BPM ingresado por el usuario
    const bpm = parseInt(document.getElementById('bpm').value) || 120; // Valor por defecto 120 si no hay entrada

    // obtener el compás seleccionado
    const compas = document.getElementById('compas').value || '4/4'; // Valor por defecto 4/4 si no hay selección

    // calculo de milisegundos por compás
    let beatsPerBar;
    switch (compas) {
        case '3/4':
            beatsPerBar = 3;
            break;
        case '6/8':
            beatsPerBar = 6;
            break;
        default:
            beatsPerBar = 4; 
    }

    const msPerBeat = 60000 / bpm; // 60000 ms en un minuto
    const msPerBar = msPerBeat * beatsPerBar;

    

    // reiniciar listaImagenes antes de capturar nuevos frames
    listaImagenes = [];

    // GENERAR Y GUARDAR EL PNG
    function capturarFrame(index) {
        if (index >= numAcordes) {
            // mostrar un alert con el número de frames guardados
            //alert(`Se guardaron ${listaImagenes.length} frames.`);
            return; // finalizar si ya se capturaron todos los frames
        }

        // seleccionar todos los acordes
        const acordes = document.querySelectorAll('.acorde');

        // primero, reiniciar todos los acordes a inactivo
        acordes.forEach(ac => {
            ac.classList.remove('activo');
            ac.classList.add('inactivo');
        });

        // asignar la clase 'activo' solo al acorde actual
        if (acordes[index]) {
            acordes[index].classList.remove('inactivo');
            acordes[index].classList.add('activo');
        }

        // GENERAR Y GUARDAR EL PNG
        html2canvas(document.getElementById("divCentral"), {
            onrendered: function (canvas) {
                var dataURL = canvas.toDataURL('image/png');
                listaImagenes.push(dataURL);

                // capturrar el siguiente frame
                capturarFrame(index + 1);
            }
        });
    }

    // iniciar la captura de frames
    capturarFrame(0);

  // Llamada a la función
 

}




// FUNCION DESCARGAR LA LISTA
function descargarLista() {
   
    // comprobar que se guardan y descargan las imagenes
 // descargarImagenes ();
  
 document.getElementById('reporte').innerText = 'se guardaron ' + listaImagenes.length + ' pngs';
  mostrarAlgunaImagen();  
    crearGifDesdeLista();
    

}




// asignar las funciones a los botones cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const exportGifButton = document.getElementById('exportGifButton');
    if (exportGifButton) {
        exportGifButton.addEventListener('click', exportGif);
        
    } else {
        
    }

    const exportarListaButton = document.getElementById('exportarLista');
    if (exportarListaButton) {
        exportarListaButton.addEventListener('click', descargarLista);
        
    } else {
        
    }
});




  // CREAR EL GIF

  function crearGifDesdeLista() {
    // asegurar de que listaImagenes esté definida y llena de datos PNG
    if (!Array.isArray(listaImagenes) || listaImagenes.length === 0) {
        document.getElementById('reporte2').innerText = 'la lista de imagenes esta vacia';
        return;
    }

    // crear un nuevo GIF usando gif.js
    const gif = new GIF({
        workers: 2,
        quality: 10
    });

    // cargar y añadir cada imagen al GIF
    listaImagenes.forEach((imgDataUrl) => {
        const img = new Image();
        img.src = imgDataUrl;
        img.onload = () => {
            gif.addFrame(img, { delay: 500 }); // añadir cada imagen con un retraso de 500ms
        };
    });

    // cuando todas las imágenes han sido añadidas
    gif.on('finished', function(blob) {
        // crear url
        const url = URL.createObjectURL(blob);
        
        // mostrar el gif en el contenedor de frames
        const framesContainer = document.getElementById('framesContainer');
        const imgElement = document.createElement('img');
        imgElement.src = url;
        framesContainer.innerHTML = ''; // Limpiar el contenedor
        framesContainer.appendChild(imgElement);
    });

    // renderizar el GIF
    gif.render();
}

 

 



 
function mostrarAlgunaImagen() {
    const framesContainer = document.getElementById("framesContainer");

    // limpiar el contenido previo
    framesContainer.innerHTML = '<h3>Frames Exportados:</h3>'; // Reintroducimos el título

    // verificamos si la lista no está vacía
    if (typeof listaImagenes !== 'undefined' && listaImagenes.length > 0) {
      // creamos un elemento de imagen
      const imgElement = document.createElement("img");
      imgElement.src = listaImagenes[1]; // Establecemos el src con el primer elemento de la lista
      imgElement.alt = "Imagen"; // Texto alternativo para la imagen (opcional)
      imgElement.style.maxWidth = "100%"; // Opcional: ajustar tamaño

      // añadir la imagen al div
      framesContainer.appendChild(imgElement);
    } else {
      
      document.getElementById('reporte2').innerText = 'La lista no esta definida o esta vacia';
    }



  } 


 // BOTON EXPORTAR

  function descargarImagenes (){
    if (listaImagenes.length === 0) {
      alert("no hay imágenes para descargar. Por favor, genere las imágenes primero usando el botón 'Exportar GIF'.");
      return;
  }

  listaImagenes.forEach((dataURL, index) => {
      const a = document.createElement("a");
      a.href = dataURL;
      a.download = `imagen_${index + 1}.png`;  // nombre de archivo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  });

  
  // AQUI LLAMAR A FUNCION QUE CREA Y EXPORTA
  
  document.getElementById('framesList').textContent = `se han descargado ${listaImagenes.length} imágenes.`;


  }