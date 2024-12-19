var express = require("express")
var router = express.Router()

const Review = require("../models/reviews")
const User = require('../models/users')

// Route pour récupérer l'ensembles des avis postés sur un lieu
router.get("/:idPlace", async (req, res) =>{
    try {
        const reviews = await Review.find({place: req.params.idPlace}).populate("user")
        res.json({result: true, reviews: reviews})
    } catch(err) {
        res.json({result: false, error: "❌ (Backend:Reviews:/:idPlace): " + err.message})
        console.log(err)
    }
})


// Route pour ajouter un avis sur un lieu
router.post("/:userToken/:idPlace", async (req, res) => {
    try {
        const user = await User.findOne({token: req.params.userToken})

        if (user === null) {
            res.json({ result: false, error: "User not found" });
            return;
        }

        const newReview = new Review ({
            user: user._id,
            place: req.params.idPlace,
            createdAt: new Date(),
            note: req.body.note,
            content: req.body.content
        })
        const newDoc = await newReview.save()
        res.json({result: true, review: newDoc})
    } catch(err) {
        res.json({result: false, error: "❌ (Backend:Reviews:/userToken/:idPlace): " + err.message})
    }
})

module.exports = router;