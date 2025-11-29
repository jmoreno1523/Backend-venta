// models/Carrito.js
const mongoose = require("mongoose");

const carritoSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // No unique, para permitir múltiples carritos temporalmente
  productos: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
      nombre: String,
      precio: Number,
      cantidad: { type: Number, default: 1 }
    }
  ],
  total: { type: Number, default: 0 }
}, { timestamps: true });

// Índice compuesto para mejorar búsquedas
carritoSchema.index({ userId: 1 });

module.exports = mongoose.model("Carrito", carritoSchema);