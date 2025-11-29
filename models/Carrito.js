const mongoose = require("mongoose");

const carritoSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  productos: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
      nombre: { type: String, required: true },
      precio: { type: Number, required: true },
      cantidad: { type: Number, default: 1 },
      imagen: { type: String }
    }
  ],
  total: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Carrito", carritoSchema);