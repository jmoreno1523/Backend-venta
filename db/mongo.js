// db/mongo.js
const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ ERROR: No se encontró MONGODB_URI en el archivo .env");
  process.exit(1);
}

// 👉 esta función conecta a la BD
const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
    });
    console.log("✅ Conectado a MongoDB con Mongoose");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

// 👈 aquí exportamos la función
module.exports = connectDB;


