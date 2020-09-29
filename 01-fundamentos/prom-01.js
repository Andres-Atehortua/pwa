const sumarLento = (num) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num + 1);
    }, 1000);
  });
};

const sumarRapido = (num) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num + 1);
    }, 500);
  });
};

Promise.all([sumarRapido(10), sumarLento(5)]).then(console.log);
