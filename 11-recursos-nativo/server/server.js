const express = require('express');
const path = require('path');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Enable CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Directorio Público
app.use(express.static(path.resolve(__dirname, '../public')));

// Rutas
const routes = require('./routes');
app.use('/api', routes);

app.listen(process.env.PORT || 3000, (err) => {
  if (err) throw new Error(err);

  console.log(`Servidor corriendo en puerto ${process.env.PORT || 3000}`);
});
