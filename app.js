var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*Ruta principal (GET) que se encarga de renderizar la vista 'index.pug' con un título y mensaje*/
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', message: 'Bienvenido a la Página Principal' });
});

/*Ruta para el formulario*/
app.get('/form', (req, res) => {
  res.render('form', { title: 'Formulario', error: null });
});

/* Ruta para procesar el formulario */
app.post('/submit', (req, res) => {
  const { name, age, email } = req.body;
  /* Verificación de errores */
  if (!name || !age || !email) {
    return res.render('form', { title: 'Formulario', error: 'Por favor llene todos los campos' });
  }

  res.redirect(`/confirm?name=${name}&age=${age}&email=${email}`);
});

/*Ruta para mostrar la confirmación */
app.get('/confirm', (req, res) => {
  const { name, age, email } = req.query;
  res.render('confirm', { title: 'Confirmación', name, age, email });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
