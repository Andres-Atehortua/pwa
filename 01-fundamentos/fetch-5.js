// RESP.CLONE() NOS SIRVE PARA CLONAR UNA RESPUESTA DEL FETCH Y PODER TRABAJAR CON ELLA MÁS DE UNA VEZ

fetch('https://reqres.in/api/users/1')
  .then((resp) => {
    if (!resp.ok) {
      throw new Error('Petición errónea');
    } else {
      resp
        .clone()
        .json()
        .then(({ data }) => console.log(data));
      return resp.json();
    }
  })
  .then(({ data }) => console.log(data))
  .catch((error) => console.log('Hubo un error', error));
