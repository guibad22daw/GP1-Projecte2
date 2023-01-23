var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/calendari', function(req, res, next) {
  res.render('calendari');
});

router.get('/informacio', function(req, res, next) {
  res.render('informacio');
});

router.get('/serveis', function(req, res, next) {
  res.render('serveis');
});



module.exports = router;
