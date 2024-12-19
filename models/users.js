const mongoose = require('mongoose')

const userSchema = mongoose.Schema({ // Création du schéma pour les utilisateurs
    username: String,
    email: String,
    token: String,
    password: String,
    createdAt: Date,
    favoritePlaces: [{type: mongoose.Schema.Types.ObjectId, ref: 'places'}],
    placesPicture: [{place: {type: mongoose.Schema.Types.ObjectId, ref: 'places'}, picture: String}]
})

const User = mongoose.model('users', userSchema)
module.exports = User