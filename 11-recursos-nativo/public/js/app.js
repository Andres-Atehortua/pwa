var url = window.location.href;
var swLocation = '/twittor/sw.js';

var swReg;

if (navigator.serviceWorker) {
  if (url.includes('localhost')) {
    swLocation = '/sw.js';
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swLocation).then((reg) => {
      swReg = reg;
      swReg.pushManager.getSubscription().then(verifySubscription);
    });
  });
}

// Referencias de jQuery
var googleMapKey = 'AIzaSyA5mjCwx1TRLuBAjwQw84WE6h5ErSe7Uj8';

// Google Maps llaves alternativas - desarrollo
// AIzaSyDyJPPlnIMOLp20Ef1LlTong8rYdTnaTXM
// AIzaSyDzbQ_553v-n8QNs2aafN9QaZbByTyM7gQ
// AIzaSyA5mjCwx1TRLuBAjwQw84WE6h5ErSe7Uj8
// AIzaSyCroCERuudf2z02rCrVa6DTkeeneQuq8TA
// AIzaSyBkDYSVRVtQ6P2mf2Xrq0VBjps8GEcWsLU
// AIzaSyAu2rb0mobiznVJnJd6bVb5Bn2WsuXP2QI
// AIzaSyAZ7zantyAHnuNFtheMlJY1VvkRBEjvw9Y
// AIzaSyDSPDpkFznGgzzBSsYvTq_sj0T0QCHRgwM
// AIzaSyD4YFaT5DvwhhhqMpDP2pBInoG8BTzA9JY
// AIzaSyAbPC1F9pWeD70Ny8PHcjguPffSLhT-YF8

var titulo = $('#titulo');
var nuevoBtn = $('#nuevo-btn');
var salirBtn = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn = $('#post-btn');
var avatarSel = $('#seleccion');
var timeline = $('#timeline');

var modal = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns = $('.seleccion-avatar');
var txtMensaje = $('#txtMensaje');

var btnActivadas = $('.btn-noti-activadas');
var btnDesactivadas = $('.btn-noti-desactivadas');

var btnLocation = $('#location-btn');

var modalMapa = $('.modal-mapa');

var btnTomarFoto = $('#tomar-foto-btn');
var btnPhoto = $('#photo-btn');
let contenedorCamara = $('.camara-contenedor');

var lat = null;
var lng = null;
var foto = null;

// El usuario, contiene el ID del héroe seleccionado
var usuario;

// Inicialización de la cámara

const camara = new Camara(document.querySelector('#player'));

// Referencias de jQuery

var titulo = $('#titulo');
var nuevoBtn = $('#nuevo-btn');
var salirBtn = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn = $('#post-btn');
var avatarSel = $('#seleccion');
var timeline = $('#timeline');

var modal = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns = $('.seleccion-avatar');
var txtMensaje = $('#txtMensaje');

var btnActivadas = $('.btn-noti-activadas');
var btnDesactivadas = $('.btn-noti-desactivadas');

// El usuario, contiene el ID del hÃ©roe seleccionado
var usuario;

// ===== Codigo de la aplicación

function crearMensajeMapa(lat, lng, personaje) {
  let content = `
  <li class="animated fadeIn fast"
      data-tipo="mapa"
      data-user="${personaje}"
      data-lat="${lat}"
      data-lng="${lng}">
              <div class="avatar">
                  <img src="img/avatars/${personaje}.jpg">
              </div>
              <div class="bubble-container">
                  <div class="bubble">
                      <iframe
                          width="100%"
                          height="250"
                          frameborder="0" style="border:0"
                          src="https://www.google.com/maps/embed/v1/view?key=${googleMapKey}&center=${lat},${lng}&zoom=17" allowfullscreen>
                          </iframe>
                  </div>
                  
                  <div class="arrow"></div>
              </div>
          </li> 
  `;

  timeline.prepend(content);
}

function crearMensajeHTML(mensaje, personaje, lat, lng, foto) {
  var content = `
    <li class="animated fadeIn fast"
    data-mensaje="${mensaje}"
    data-user="${personaje}"
    data-tipo="mensaje"
    >
        <div class="avatar">
            <img src="img/avatars/${personaje}.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${personaje}</h3>
                <br/>
                ${mensaje}
            </div>
            ${
              foto
                ? `
            <br/>
            <img class="foto-mensaje" src="${foto}" />
            `
                : ''
            }
            <div class="arrow"></div>
        </div>
    </li>
    `;

  lat && lng && crearMensajeMapa(lat, lng, personaje);

  lat = null;
  lng = null;

  $('.modal-mapa').remove();

  timeline.prepend(content);
  cancelarBtn.click();
}

// Globals
function logIn(ingreso) {
  if (ingreso) {
    nuevoBtn.removeClass('oculto');
    salirBtn.removeClass('oculto');
    timeline.removeClass('oculto');
    avatarSel.addClass('oculto');
    modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
  } else {
    nuevoBtn.addClass('oculto');
    salirBtn.addClass('oculto');
    timeline.addClass('oculto');
    avatarSel.removeClass('oculto');

    titulo.text('Seleccione Personaje');
  }
}

// Seleccion de personaje
avatarBtns.on('click', function () {
  usuario = $(this).data('user');

  titulo.text('@' + usuario);

  logIn(true);
});

// Boton de salir
salirBtn.on('click', function () {
  logIn(false);
});

// Boton de nuevo mensaje
nuevoBtn.on('click', function () {
  modal.removeClass('oculto');
  modal.animate(
    {
      marginTop: '-=1000px',
      opacity: 1,
    },
    200
  );
});

// Boton de cancelar mensaje
cancelarBtn.on('click', function () {
  if (!modal.hasClass('oculto')) {
    modal.animate(
      {
        marginTop: '+=1000px',
        opacity: 0,
      },
      200,
      function () {
        modal.addClass('oculto');
        txtMensaje.val('');
      }
    );
  }
});

// Boton de enviar mensaje
postBtn.on('click', function () {
  var mensaje = txtMensaje.val();
  if (mensaje.length === 0) {
    cancelarBtn.click();
    return;
  }

  var data = {
    mensaje: mensaje,
    user: usuario,
    lat,
    lng,
    foto,
  };

  fetch('api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => console.log('app.js', res))
    .catch((err) => console.log('app.js error:', err));

  crearMensajeHTML(mensaje, usuario, lat, lng, foto);
  foto = null;
});

// Obtener mensajes del servidor
function getMensajes() {
  fetch('api')
    .then((res) => res.json())
    .then((posts) => {
      // console.log(posts);
      posts.forEach(({ mensaje, user, lat, lng, foto }) =>
        crearMensajeHTML(mensaje, user, lat, lng, foto)
      );
    });
}

getMensajes();

// Detectar cambios de conexión
function isOnline() {
  if (navigator.onLine) {
    // tenemos conexión
    // console.log('online');
    $.mdtoast('Online', {
      interaction: true,
      interactionTimeout: 1000,
      actionText: 'OK!',
    });
  } else {
    // No tenemos conexión
    $.mdtoast('Offline', {
      interaction: true,
      actionText: 'OK',
      type: 'warning',
    });
  }
}

window.addEventListener('online', isOnline);
window.addEventListener('offline', isOnline);

isOnline();

//NOTIFICACIONES

function verifySubscription(active) {
  if (active) {
    btnActivadas.removeClass('oculto');
    btnDesactivadas.addClass('oculto');
  } else {
    btnActivadas.addClass('oculto');

    btnDesactivadas.removeClass('oculto');
  }
}

// verifySubscription();

function sendAlerts(message) {
  const notificationOpts = {
    body: 'Este es el cuerpo de la notificacion',
    icon: './../img/icons/icon-72x72.png',
  };
  const notification = new Notification(message, notificationOpts);
  notification.onclick = () => console.log('clickeado');
}

function ask() {
  if (!window.Notification) {
    return console.log('Este navegador no soporta notificaciones');
  }

  if (Notification.permission === 'granted') {
    sendAlerts('Gracias bro');
  } else {
    Notification.requestPermission((permission) => {
      console.log(permission);
      if (permission === 'granted') {
        sendAlerts('Heeeeeey!');
      }
    });
  }
}

// ask();

//  Get key

async function getPublicKey() {
  const res = await fetch('api/key');
  const array = await res.arrayBuffer();
  const key = new Uint8Array(array);
  return key;
}

btnDesactivadas.on('click', () => {
  if (!swReg) {
    return console.log('No hay registro');
  }

  getPublicKey().then(function (key) {
    swReg.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: key,
      })
      .then((res) => res.toJSON())
      .then((subscription) => {
        // console.log(subscription);
        fetch('api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        })
          .then(verifySubscription)
          .catch(cancelSubscription);
      });
  });
});

function cancelSubscription() {
  swReg.pushManager.getSubscription().then((subs) => {
    subs.unsubscribe().then(() => verifySubscription(false));
  });
}

btnActivadas.on('click', () => cancelSubscription());

// Mostrar mapa

function mostrarMapaModal(lat, lng) {
  $('.modal-mapa').remove();

  var content = `
          <div class="modal-mapa">
              <iframe
                  width="100%"
                  height="250"
                  frameborder="0"
                  src="https://www.google.com/maps/embed/v1/view?key=${googleMapKey}&center=${lat},${lng}&zoom=17" allowfullscreen>
                  </iframe>
          </div>
  `;

  modal.append(content);
}

// obtener geolocalización

btnLocation.on('click', () => {
  if (navigator.geolocation) {
    $.mdtoast('Obteniendo coordenadas', {
      interaction: true,
      interactionTimeout: 2000,
      actionText: 'OK',
    });
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      lat = latitude;
      lng = longitude;
      mostrarMapaModal(latitude, longitude);
    });
  }
  console.log('localizacion');
});

// Boton camara

btnPhoto.on('click', () => {
  contenedorCamara.removeClass('oculto');
  camara.on();
});

// Tomar foto

btnTomarFoto.on('click', () => {
  foto = camara.takePhoto();
  camara.off();

  console.log(foto);
});

//SHARE API

timeline.on('click', 'li', function () {
  let tipo = $(this).data('tipo');
  let lat = $(this).data('lat');
  let lng = $(this).data('lng');
  let mensaje = $(this).data('mensaje');
  let user = $(this).data('user');

  const shareOpts = {
    title: user,
    text: mensaje,
  };

  if (tipo === 'mapa') {
    shareOpts.text = 'Mapa';
    shareOpts.url = `https://www.google.com/maps/@${lat},${lng},15z`;
  }

  navigator
    .share(shareOpts)
    .then(console.log('Todo bien'))
    .catch(console.log('todo mal'));
});
