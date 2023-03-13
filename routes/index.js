const cookieParser = require('cookie-parser');
var express = require('express');
var router = express.Router();
var bd = require('./bd');

router.get('/', function (req, res, next) {
  res.render('inici');
});

router.get('/login', function (req, res, next) {
  res.clearCookie("user");
  res.clearCookie("id");
  res.render('login');
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

router.get('/get-data', function (req, res, next) {
  bd.obtenirDadesBD(req, res, next);
});

router.get('/get-admin', function (req, res, next) {
  bd.obtenirAdminBD(req, res, next);
});

router.post('/save-data', function (req, res, next) {
  bd.guardarDadesBD(req, res, next);
});

module.exports = router;
