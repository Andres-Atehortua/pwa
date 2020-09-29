// Forma actual de hacer peticiones https
// POST PUT
//https://reqres.in/api/users

let user = {
  nombre: 'Andrés',
  edad: 24,
  casado: false,
};

fetch('https://reqres.in/api/users', {
  method: 'POST',
  body: JSON.stringify(user),
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then((resp) => resp.json())
  .then(console.log)
  .catch(console.error);
