var express = require('express');
var router = express.Router();
var bd = require('./bd');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.get('/calendari', function (req, res, next) {
  res.render('calendari');
});

router.get('/informacio', function (req, res, next) {
  res.render('informacio');
});

router.get('/serveis', function (req, res, next) {
  res.render('serveis');
});

router.post('/desa', function (req, res, next) {
  bd.desaUsuariBD(req, res, next);
});

router.get('/get-data', function (req, res, next) {
  bd.obtenirDadesBD(req, res, next);
});

router.post('/save-data', function (req, res, next) {
  bd.guardarDadesBD(req, res, next);
});

module.exports = router;
