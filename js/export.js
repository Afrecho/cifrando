let listaImagenes = [];

// function for the Export GIF button
function exportGif() {
    const acordes = document.querySelectorAll('.acorde');
    const numAcordes = acordes.length;

    const bpm = parseInt(document.getElementById('bpm').value) || 120;
    const compas = document.getElementById('compas').value || '4/4';

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
ter
    const msPerBeat = 60000 / bpm;
    const msPerBar = msPerBeat * beatsPerBar;

    listaImagenes = [];

    // Limpiar el contenedor de imágenes
    document.getElementById('framesContainer').innerHTML = ''; 

    function capturarFrame(index) {
        if (index >= numAcordes) {
            // Mostrar la imagen después de capturar todos los frames
            if (listaImagenes.length > 1) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(listaImagenes[3]);
                document.getElementById('framesContainer').appendChild(img);
            }
            return;
        }

        const acordes = document.querySelectorAll('.acorde');
        acordes.forEach(ac => {
            ac.classList.remove('activo');
            ac.classList.add('inactivo');
        });

        if (acordes[index]) {
            acordes[index].classList.remove('inactivo');
            acordes[index].classList.add('activo');
        }

        html2canvas(document.getElementById("divCentral")).then(canvas => {
            canvas.toBlob(function(blob) {
                listaImagenes.push(blob);
                capturarFrame(index + 1);
            }, 'image/png');
        });
    }

    capturarFrame(0);
}





// function descargar la lista
function descargarLista() {
   
    // check that the images are saved and downloaded
    // descargarImagenes ();
  
    document.getElementById('reporte').innerText = 'se guardaron ' + listaImagenes.length + ' pngs';
    // mostrarAlgunaImagen();
   // createGifFromList();
   generarGif();

 //  document.getElementById('reporte').innerText = 'Contenido de la lista: ' + listaImagenes.join(', ');

}



// assign functions to buttons when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const exportGifButton = document.getElementById('exportGifButton');
    if (exportGifButton) {
        exportGifButton.addEventListener('click', exportGif);
        
    } else {
        // handle case where exportGifButton is not found (optional)
    }

    const exportarListaButton = document.getElementById('exportarLista');
    if (exportarListaButton) {
        exportarListaButton.addEventListener('click', descargarLista);
        
    } else {
        // handle case where exportarListaButton is not found (optional)
    }
});





  // create to gif



  
  // Función que genera el GIF desde listaImagenes
     function createGifFromList() {
    document.getElementById('generateGif').addEventListener('click', async () => {
        // Suponiendo que `listaImagenes` contiene URLs de imágenes PNG
        let imageUrls = ["http://example.com/image1.png", "http://example.com/image2.png"]; // Reemplaza esto con `listaImagenes`

        // Enviar la solicitud POST al servidor Flask
        let response = await fetch('/generate_gif', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image_urls: imageUrls })
        });

        if (response.ok) {
            // Descargar el GIF generado
            let blob = await response.blob();
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'output.gif';
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            alert('Error al generar el GIF');
        }
    });
  }
  
  // Llama a la función desde tu botón
   // document.getElementById('miBoton').addEventListener('click', createGifFromList);
  

 
//FIN DEL CREADOR GIF


    function mostrarAlgunaImagen() {
        const framesContainer = document.getElementById("framesContainer");
    
        // clear previous content
        framesContainer.innerHTML = '<h3>frames exportados:</h3>'; // reintroduce the title
    
        // check if the list is not empty
        if (typeof listaImagenes !== 'undefined' && listaImagenes.length > 0) {
          // create an image element
          const imgElement = document.createElement("img");
          imgElement.src = listaImagenes[2]; // set the src with the first element of the list
          imgElement.alt = "imagen"; // alternative text for the image (optional)
          imgElement.style.maxWidth = "100%"; // optional: adjust size
    
          // add the image to the div
          framesContainer.appendChild(imgElement);
        } else {
          
          document.getElementById('reporte2').innerText = 'la lista no esta definida o esta vacia';
        }
    }
    


 // botton export

  function descargarImagenes (){
    if (listaImagenes.length === 0) {
      alert("no hay imágenes para descargar. Por favor, genere las imágenes primero usando el botón 'Exportar GIF'.");
      return;
  }

  listaImagenes.forEach((dataURL, index) => {
      const a = document.createElement("a");
      a.href = dataURL;
      a.download = `imagen_${index + 1}.png`;  // file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  });

  
  // call to action and export
  
  document.getElementById('framesList').textContent = `se han descargado ${listaImagenes.length} imágenes.`;


  }






  function generarGif() {
    const gif = new GIF({
        workers: 2, // Número de hilos para procesamiento
        quality: 10, // Calidad de la imagen (menor valor, mayor calidad)
        workerScript: 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js' // Ruta del worker de gif.js
    });

    let imagesProcessed = 0; // Contador de imágenes procesadas

    // Añadir cada imagen al GIF una vez que esté cargada
    listaImagenes.forEach((blob, index) => {
        const img = new Image();
        img.src = URL.createObjectURL(blob);

        img.onload = function () {
            gif.addFrame(img, { delay: 500 }); // 500ms de delay entre cada frame
            imagesProcessed++;

            // Cuando todas las imágenes hayan sido procesadas, renderiza el GIF
            if (imagesProcessed === listaImagenes.length) {
                gif.render();
            }
        };
    });

    // Una vez que el GIF está completo
    gif.on('finished', function(blob) {
        const gifUrl = URL.createObjectURL(blob);

        // Crear un enlace de descarga para el GIF
        const downloadLink = document.createElement('a');
        downloadLink.href = gifUrl;
        downloadLink.download = 'animacion.gif';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(gifUrl); // Liberar memoria temporal
    });
}
