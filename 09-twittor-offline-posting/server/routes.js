// Routes.js - Módulo de rutas
const express = require('express');
const router = express.Router();

const messages = [
  {
    _id: 123,
    user: 'spiderman',
    message: 'Hola, soy Spider-Man',
  },
  {
    _id: 1234,
    user: 'hulk',
    message: 'Hola, soy Hulk',
  },
];

// Get mensajes
router.get('/', function (req, res) {
  res.json(messages);
});

// Post mensaje
router.post('/', function (req, res) {
  // console.log(req.body);
  const message = {
    message: req.body.message,
    user: req.body.user,
    _id: req.body._id,
  };
  messages.push(message);
  console.log(messages);

  res.json({ ok: true, message });
});

module.exports = router;
