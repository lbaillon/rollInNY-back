var express = require("express"); 
var router = express.Router();

const { checkBody } = require("../modules/checkBody");
const User = require("../models/users"); 
const Place = require("../models/places");
const uid2 = require("uid2");
const bcrypt = require("bcryptjs");

// Route pour s'inscrire avec un compte classique
router.post("/signup/classic", async (req, res) => {
  if (!checkBody(req.body, ["username", "email", "password"])) {
    res.json({ result: false, error: "❌ (Backend:Users:/signup/classic): Please complete all fields." });
    return;
  }

  try {
    const user = await User.findOne({ email: { $regex: new RegExp(req.body.email, "i") } });

    if (user === null) {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        token: uid2(32),
        password: bcrypt.hashSync(req.body.password, 10),
        createdAt: new Date(),
        favoritePlaces: [],
        placesPictures: [],
      });
      try {
        const newDoc = await newUser.save();
        res.json({ result: true, username: newDoc.username, email: newDoc.email, token: newDoc.token, id: newDoc._id });
      } catch (err) {
        res.json({ result: false, error: "❌ (Backend:Users:/signup/classic): Can't save new user in database" });
      }
    } else { // Sinon, si l'utilisateur existe déjà
      res.json({ result: false, error: "❌ (Backend:Users:/signup/classic): Cet utilisateur existe déjà." });
      return;
    }
  } catch (err) { // Si une erreur survient lors de la recherche de l'utilisateur
    res.json({ result: false, error: "❌ (Backend:Users:/signup/classic): Can't find any user in database" });
  }
});

// Route pour se connecter avec un compte classique
router.post("/signin/classic", async (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Veuillez indiquer tous les champs." });
    return;
  }

  try {
    const user = await User.findOne({ email: { $regex: new RegExp(req.body.email, "i") } });

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      res.json({ result: true, username: user.username, email: user.email, token: user.token, id: user._id });
    } else {
      res.json({ result: false, error: "❌ (Backend:Users:/signin/classic): User not found or wrong password" });
    }
  } catch (err) {
    res.json({ result: false, error: "❌ (Backend:Users:/signin/classic): Can't find user in database" });
  }
});

// Route pour ajouter un lieu aux favoris d'un utilisateur
router.put("/likePlace/:userToken/:idPlace", async (req, res) => {
  try {
    const user = await User.findOne({ token: req.params.userToken });
    if (user === null) {
      res.json({ result: false, error: "❌ (Backend:Users:/likePlace/:userToken/:idPlace): User not found" });
      return;
    }

    const place = await Place.findById(req.params.idPlace);
    if (!place) {
      res.json({ result: false, error: "❌ (Backend:Users:/likePlace/:userToken/:idPlace): Place not found" });
      return;
    }

    if (user.favoritePlaces.includes(place._id)) {
      await User.updateOne({ _id: user._id }, { $pull: { favoritePlaces: place._id } });
      res.json({ result: true, status: "Removed", message: "Removed to favorites !" }); 
    } else {
      await User.updateOne({ _id: user._id }, { $push: { favoritePlaces: place._id } });
      res.json({ result: true, status: "Added", message: "Added to favorites !" });
    }
  } catch (err) {
    res.json({result: false, error: "❌ (Backend:Users:/likePlace/:userToken/:idPlace): " + err.message});
  }
});

// Route pour vérifier si un lieu est dans les favoris d'un utilisateur
router.get('/isLiked/:userToken/:idPlace', async (req, res) => {
  try {
    const user = await User.findOne({ token: req.params.userToken });
    if (user === null) {
      res.json({ result: false, error: "❌ (Backend:Users:/isLiked/:userToken/:idPlace): User not found" });
      return;
    }

    const place = await Place.findById(req.params.idPlace);
    if (!place) {
      res.json({ result: false, error: "❌ (Backend:Users:/isLiked/:userToken/:idPlace): Place not found" });
      return;
    }

    if (user.favoritePlaces.includes(place._id)) {
      res.json({result: true, message: "Place is liked"});
    } else {
      res.json({result: false, message: "Place is not liked"});
    }
  } catch(err) {
    res.json({result: false, error: "❌ (Backend:Users:/isLiked/:userToken/:idPlace): " + err.message});
  }
});

module.exports = router;