const crypto = require("crypto");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/GP1", { useNewUrlParser: true });
mongoose.set("strictQuery", false);

const userSchema = new mongoose.Schema(
   {
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
   },
   { versionKey: false }
);

const eventsSchema = new mongoose.Schema(
   {
      user: { type: String, required: true },
      date: { type: String, required: true },
      hora: { type: String, required: true },
      servei: { type: String, required: true },
      tipus: { type: String, required: true },
      descripcio: { type: String, required: false },
   },
   { versionKey: false }
);

const Usuari = mongoose.model("usuaris", userSchema);
const Event = mongoose.model("events", eventsSchema);

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
};

exports.desaEsdevenimentBD = async function (req, res, next) {
   const event = await req.body;
   console.log(event);
   const nouEsdeveniment = new Event(event);

   try {
      await nouEsdeveniment.save()
      console.log(`Esdeveniment afegit correctament`);
      res.sendStatus(200);
   } catch (err) {
      console.log(err);
      res.sendStatus(500);
   }
};

exports.esborraEsdevenimentBD = async function (req, res, next) {
   const event = await req.body;
   try {
      await Event.deleteOne({ _id: event._id });
      console.log(`Esdeveniment amb id ${event._id} eliminat.`);
      res.sendStatus(200);
   } catch (err) {
      console.log(err);
      res.sendStatus(500);
   }
};

async function login(username, password, res) {
   const existeix = await Usuari.exists({ username: username });
   if (!existeix) {
      const hashedPassword = hashPassword(password);
      const nouUsuari = new Usuari({
         username: username,
         password: hashedPassword,
      });
      await nouUsuari.save();
      console.log("Usuari creat.");
      fPosaCookie(nouUsuari._id, username, res);
   } else {
      let user = await Usuari.findOne({ username: username }).select(
         "password"
      );
      const [salt, hashedPassword] = user.password.split("$");
      const hash = crypto
         .pbkdf2Sync(password, salt, 2048, 32, "sha512")
         .toString("hex");
      if (hash === hashedPassword) {
         console.log("Iniciant sessió...");
         fPosaCookie(user._id, username, res);
      } else {
         let missatge = "Contrasenya incorrecta.";
         res.redirect("/login?missatge=" + encodeURIComponent(missatge));
      }
   }
}

function hashPassword(password) {
   const salt = crypto.randomBytes(16).toString("hex");
   const hash = crypto
      .pbkdf2Sync(password, salt, 2048, 32, "sha512")
      .toString("hex");

   return [salt, hash].join("$");
}

function fPosaCookie(idUsuari, username, res) {
   let cookies = [`id=${idUsuari}`, `user=${username}`];
   console.log(cookies);
   res.setHeader("Set-Cookie", cookies, {
      httpOnly: false,
      maxAge: 60 * 15, // 15 minuts
   });
   res.redirect("/inici");
}
