const mongoose = require('mongoose')

const placeSchema = mongoose.Schema({ // Création du schéma pour les lieux
    title: String,
    address: String,
    overview: String,
    placePicture: String,
    coords: {lat: Number, lon: Number},
    moviesList: [Number],
    approved: Boolean
})

const Place = mongoose.model('places', placeSchema)
module.exports = Place