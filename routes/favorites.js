var express = require("express"); // Import d'express
var router = express.Router(); // Création d'un router express

const User = require("../models/users"); // Import du modèle User
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

const tempDir = path.join(__dirname, "../tmp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Route pour obtenir les lieux favoris d'un utilisateur
router.get("/places/:userToken", async (req, res) => {
  try {
    const user = await User.findOne({ token: req.params.userToken }).populate("favoritePlaces");
    if (user === null) {
      // Condition pour dire que si l'utilisateur n'existe pas
      res.json({ result: false, error: "❌ (Backend:Favorites:/places/:userToken): User not found" });
      return;
    } else {
      res.json({ result: true, favoritePlaces: user.favoritePlaces });
    }
  } catch (err) {
    res.json({ result: false, error: "❌ (Backend:Favorites:/places/:userToken): " + err.message });
  }
});

// Route pour ajouter une photo sur un lieu aux favoris d'un utilisateur
router.post("/pictures", async (req, res) => {
  try {
    const photoFile = Array.isArray(req.files.photoFromFront)
      ? req.files.photoFromFront[req.files.photoFromFront.length - 1]
      : req.files.photoFromFront;

    if (!photoFile) {
      return res.json({ result: false, error: "❌ (Backend:Favorites:/pictures): No file received" });
    }

    const userToken = typeof req.body.userToken === "string" ? req.body.userToken.trim() : "";
    const idPlace = typeof req.body.idPlace === "string" ? req.body.idPlace.trim() : "";

    if (!userToken || !idPlace) {
      return res.json({ result: false, error: "❌ (Backend:Favorites:/pictures): Missing or invalid userToken or idPlace" });
    }
    // Construction sécurisée du dossier
    const folderPath = `usersPictures/${userToken}/${idPlace}`;

    // Upload direct à Cloudinary
    const resultCloudinary = await cloudinary.uploader.upload(photoFile.tempFilePath, {
      folder: folderPath,
      format: "webp",
    });

    res.json({ result: true, url: resultCloudinary.secure_url, publicId: resultCloudinary.public_id });
  } catch (err) {
    res.json({ result: false, error: "❌ (Backend:Favorites:/pictures): " + err.message });
  }
});

// Route pour récupérer les images d'un lieu d'un favoris d'un utilisateur
router.get("/pictures/:userToken/:idPlace", async (req, res) => {
  try {
    const userToken = typeof req.params.userToken === "string" ? req.params.userToken.trim() : "";
    const idPlace = typeof req.params.idPlace === "string" ? req.params.idPlace.trim() : "";
  
    if (!userToken || !idPlace) {
      return res.json({ result: false, error: "❌ (Backend:Favorites:/pictures/:userToken/:idPlace): Missing or invalid userToken or idPlace" });
    }
  
    const folderPath = `usersPictures/${userToken}/${idPlace}`;
  
    const resultCloudinary = await cloudinary.search
    .expression(`folder:${folderPath}`)
    .sort_by("public_id", "desc")
    .execute();
    
    const urls = resultCloudinary.resources.map((resource) => ({
      secure_url: resource.secure_url,
      public_id: resource.public_id,
    }));
    res.json({ result: true, urls: urls });
  } catch(err) {
    res.json({ result: false, error: "❌ (Backend:Favorites:/pictures/:userToken/:idPlace): " + err.message });
  }
});

// Route pour supprimer une image
router.delete("/pictures", async (req, res) => {
  try {
    const publicId = typeof req.body.publicId === "string" ? req.body.publicId.trim() : "";
  
    if (!publicId) {
      return res.json({ result: false, error: "Missing or invalid publicId" });
    }
    
    const result = await cloudinary.uploader.destroy(publicId);
  
    if (result.result === "ok") {
      res.json({ result: true, message: "Picture successfully deleted" });
    } else {
      res.json({ result: false, error: "Failed to delete picture" });
    }
  } catch(err) {
    res.json({ result: false, error: "❌ (Backend:Favorites:/pictures): " + err.message });
  }
});

module.exports = router;
