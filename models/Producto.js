const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true, default: "Sin descripción" },
    precio: { type: Number, required: true },
    imagen: { type: String, required: true, default: "https://via.placeholder.com/300x200" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Producto", ProductoSchema);
