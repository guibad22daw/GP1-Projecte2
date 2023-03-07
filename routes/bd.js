
const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/GP1', { useNewUrlParser: true })
mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema({
   username: { type: String, required: true, unique: true },
   password: { type: String, required: true },
}, { versionKey: false });

const eventsSchema = new mongoose.Schema({
   user: { type: String, required: true },
   date: { type: String, required: true },
   title: { type: String, required: true },
}, { versionKey: false });

const Usuari = mongoose.model('usuaris', userSchema);
const Event = mongoose.model('events', eventsSchema);

exports.desaUsuariBD = function (req, res, next) {
   const username = req.body.username;
   const password = req.body.password;
   login(username, password, res);
};

exports.obtenirDadesBD = async function (req, res, next) {
   const all = await Event.find({});
   if (all) {
      res.send(JSON.stringify(all));
   } else {
      console.log("Error");
   }
}

exports.guardarDadesBD = async function (req, res, next) {
   const events = await req.body;
   await Event.deleteMany({});

   Event.insertMany(events).then(function () {
      console.log("Dades inserides");
      res.sendStatus(200);
   }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
   })
}

async function login(username, password, res) {
   const existeix = await Usuari.exists({ username: username });
   if (!existeix) {
      const hashedPassword = hashPassword(password);
      const nouUsuari = new Usuari({ username: username, password: hashedPassword });
      await nouUsuari.save()
      console.log("Usuari creat.");
      fPosaCookie(nouUsuari._id, username, res);
   } else {
      let user = await Usuari.findOne({ username: username }).select('password');
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