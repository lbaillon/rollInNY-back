require("dotenv").config(); // Import pour utiliser les variables d'environnement
require("./models/connection"); // Import pour se connecter à la base de données

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var placesRouter = require("./routes/places"); // Import des routes pour les lieux
var usersRouter = require("./routes/users"); // Import des routes pour les utilisateurs
var favoritesRouter = require("./routes/favorites"); // Import des routes pour les favoris
var reviewsRouter = require("./routes/reviews")
var moviesRouter = require("./routes/movies");

var app = express();

const cors = require("cors"); 
app.use(cors());

const fileUpload = require('express-fileupload');

app.use(fileUpload({
  useTempFiles: true,          // Permet d'utiliser un chemin temporaire pour les fichiers
  tempFileDir: '/tmp/',        // Emplacement des fichiers temporaires
}));


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/places", placesRouter); // Création de la route pour les lieux
app.use("/users", usersRouter); // Création de la route pour les utilisateurs
app.use("/favorites", favoritesRouter); // Création de la route pour les favoris
app.use("/reviews", reviewsRouter); // Création de la route pour les reviews
app.use("/movies", moviesRouter); // Création de la route pour les films

module.exports = app;
