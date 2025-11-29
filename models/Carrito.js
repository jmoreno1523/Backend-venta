const mongoose = require("mongoose");

const carritoSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  productos: [
    {
      productoId: String,
      nombre: String,
      precio: Number,
      cantidad: { type: Number, default: 1 }
    }
  ],
  total: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Carrito", carritoSchema);