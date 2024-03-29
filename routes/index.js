var express = require('express');
var router = express.Router();
var bd = require('./bd');

router.get('/', function (req, res, next) {
  res.redirect('/inici');
});

router.get('/login', function (req, res, next) {
  const missatge = req.query.missatge;
  res.clearCookie("user");
  res.clearCookie("id");
  console.log('missatge :>> ', missatge);
  res.render('login',{missatge});
});

router.get('/inici', function (req, res, next) {
  let idUsuari = req.cookies.id;
  let user = req.cookies.user;
  if (user && idUsuari) res.render('inici');
  else res.redirect('/login')
});

router.get('/informacio', function (req, res, next) {
  res.render('informacio');
});

router.get('/serveis', function (req, res, next) {
  res.render('serveis');
});

router.get('/contacte', function (req, res, next) {
  res.render('contacte');
});

router.get('/error', function (req, res, next) {
  res.render('error');
});

router.post('/desa', function (req, res, next) {
  bd.desaUsuariBD(req, res, next);
});

router.get('/obtenirDades', function (req, res, next) {
  bd.obtenirDadesBD(req, res, next);
});

router.post('/desaEsdeveniment', function (req, res, next) {
  bd.desaEsdevenimentBD(req, res, next);
});

router.post('/esborraEsdeveniment', function (req, res, next) {
  bd.esborraEsdevenimentBD(req, res, next);
});

module.exports = router;
