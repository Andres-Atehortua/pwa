// Tarea sobre promesas y fetch
// Realice resolución de cada ejercicio,

// compruebe el resultado en la consola y posteriormente
// siga con el siguiente.

// Comente TODO el código del ejercicio anterior
// antes de continuar con el siguiente.

// ==============================================
// Ejercicio #1
// ==============================================
/*
 Realizar un llamado FETCH a la siguiente API
 https://swapi.dev/api/people/1/
 Imprima en consola el nombre y género de la persona.
*/

// Resolución de la tarea #1

// fetch('https://swapi.dev/api/people/1')
//   .then((resp) => resp.json())
//   .then(({ name, gender }) => console.log(`${name} - ${gender}`));

// ==============================================
// Ejercicio #2
// ==============================================
/*
 Similar al ejercicio anterior... haga un llamado a la misma api
 (puede reutilizar el código )
 https://swapi.dev/api/people/1/
 
 Pero con el nombre y el género, haga un posteo
 POST a: https://reqres.in/api/users

 Imprima en consola el objeto y asegúrese que tenga
 el ID y la fecha de creación del objeto
*/

// Resolución de la tarea #2

const postData = ({ name, gender }) => {
  let obj = { name, gender };
  return fetch('https://reqres.in/api/users', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

fetch('https://swapi.dev/api/people/1')
  .then((resp) => {
    if (resp.ok) {
      return resp.json();
    } else {
      throw new Error('Hubo un error en la petición');
    }
  })
  .then(postData)
  .then((resp) => {
    if (resp.ok) return resp.json();
    else throw new Error('Hubo un error en el posteo');
  })
  .then(console.log)
  .catch((error) => console.log('Hubo un error', error));
