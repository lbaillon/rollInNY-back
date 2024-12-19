var express = require("express");
var router = express.Router();

const Place = require("../models/places");

router.get("/", async (req, res) => {
  try {
    const places = await Place.find();
    res.json({ result: true, places: places });
  } catch(err) {
    res.json({result: false, error: "❌ (Backend:places:/): " + err.message})
  }
});

// Route pour récupérer les places en fonction de l'id d'un film
router.post("/search", async (req, res) => {
  try {
    const places = await Place.aggregate([
      { $match: { moviesList: parseInt(req.body.idMovie) } },
      { $project: { _id: 1 } },
    ]);

    const idPlaces = places.map((place) => place._id.toString()); 
    res.json({ result: true, places: idPlaces });
  } catch (err) {
    res.json({ result: false, error: "❌ (Backend:places:/search): " + err.message});
  }
});

module.exports = router;
