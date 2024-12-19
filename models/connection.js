const mongoose = require("mongoose");

const connectionString = process.env.DATABASE_CONNECTION_STRING;

// Connexion à la base de données
mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
    .then(() => console.log("✅ Database connected"))
    .catch((error) => console.error('❌ Error to connect to database', error));
