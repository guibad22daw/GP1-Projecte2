var express = require('express');
var router = express.Router();
var monk = require('monk');
let fs = require('fs');
var cookie = require('cookie');
const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/GP1', { useNewUrlParser: true })

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/desa', function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  login(username, password, res);
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

router.get('/get-data', async function (req, res, next) {
  const Event = mongoose.model('events', eventsSchema);
  const all = await Event.find({});
  if(all) {
    res.send(JSON.stringify(all));
  } else {
    console.log("Error");
  }
});

const eventsSchema = new mongoose.Schema({
  user: { type: String, required: true },
  date: { type: String, required: true },
  title: { type: String, required: true },
}, {versionKey: false });

router.post('/save-data', async function (req, res, next) {
  const Event = mongoose.model('events');
  const events = await req.body;
  console.log(JSON.stringify(events));
  await Event.deleteMany({});

  Event.insertMany(events).then(function() {
    console.log("Dades inserides");
    res.sendStatus(200);
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(500);
  })
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { versionKey: false });

async function login(username, password, res) {
  const User = mongoose.model('usuaris', userSchema);
  const existeix = await User.findOne({ username: username });
  if (!existeix) {
    const hashedPassword = hashPassword(password);
    const nouUsuari = new User({ username: username, password: hashedPassword });
    await nouUsuari.save()
    console.log("Usuari creat.");
    fPosaCookie(nouUsuari._id, username, res);
  } else {
    let user = await User.findOne({ username: username }).select('password');
    const [salt, hashedPassword] = user.password.split('$');
    const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
    if (hash === hashedPassword) {
      console.log('Iniciant sessió...');
      fPosaCookie(user._id, username, res);
    } else {
      console.log("Error iniciant sessió.");
      res.redirect('/login');
    }
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');

  return [salt, hash].join('$');
}

function fPosaCookie(idUsuari, username, res) {
  let cookies = [
      `id=${idUsuari}`,
      `user=${username}`
  ];
  console.log(cookies);
  res.setHeader('Set-Cookie', cookies, {
      httpOnly: false,
      maxAge: 60 * 15 // 15 minuts
  });
  res.redirect('/calendari');
}

module.exports = router;
