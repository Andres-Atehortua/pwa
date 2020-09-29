fetch('not-found.html')
  .then((resp) => resp.text())
  .then((html) => {
    let body = document.querySelector('body');

    body.innerHTML = html;
  })
  .catch((error) => console.log('Error en la peticion', error));
