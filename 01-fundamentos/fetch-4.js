let img = document.querySelector('img');

//UTILIZAMOS .blob para tratar una imagen

fetch('superman.png')
  .then((resp) => resp.blob())
  .then((image) => {
    let source = URL.createObjectURL(image);
    img.src = source;
  });
