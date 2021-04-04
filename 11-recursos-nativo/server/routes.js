// Routes.js - Módulo de rutas
var express = require('express');
var router = express.Router();
var push = require('./push');

const mensajes = [
  {
    _id: 'XXX',
    user: 'spiderman',
    mensaje: 'Hola Mundo Cruel',
  },
];

// Get mensajes
router.get('/', function (req, res) {
  // res.json('Obteniendo mensajes');
  res.json(mensajes);
});

// Post mensaje
router.post('/', function (req, res) {
  const { mensaje, user, lat, lng, foto } = req.body;

  console.log(lat, lng);

  const message = {
    mensaje,
    user,
    lat,
    lng,
    foto,
  };

  mensajes.push(message);

  console.log(mensajes);

  res.json({
    ok: true,
    message,
  });
});

// Almacenar la subscripción
router.post('/subscribe', (req, res) => {
  const subscription = req.body;
  push.addSubscription(subscription);
  res.json('Subscripción');
});

// Obtener un key público
router.get('/key', (req, res) => {
  const key = push.getKey();

  res.send(key);
});

// Enviar una notificación push a quién queramos
// Es algo que se controla del lado del servidor
router.post('/push', (req, res) => {
  push.sendPush(req.body);

  res.json('Notificación enviada');
});

module.exports = router;
