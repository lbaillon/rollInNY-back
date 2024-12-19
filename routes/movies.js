var express = require("express"); // Import d'express
var router = express.Router(); // Création d'un router express

router.post("/", async (req, res) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${req.body.movieId}?api_key=${process.env.TMDB_API_KEY}`);
        const data = await response.json();
        res.json({result: true, movie: data});
    } catch(err) {
        res.json({result: false, error: "❌ (Backend:movies:/): " + err.message})
    }
})

module.exports = router