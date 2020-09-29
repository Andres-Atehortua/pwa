// Forma antigua de hacer peticiones http en js

let request = new XMLHttpRequest();

request.open('GET', 'https://reqres.in/api/users', true);
request.send(null);

request.onreadystatechange = (state) => {
  if (request.readyState === 4) {
    let resp = request.response;
    let obj = JSON.parse(resp);
    console.log(obj);
  }
};
