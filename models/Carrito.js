const mongoose = require("mongoose");

const carritoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
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

carritoSchema.index({ userId: 1 });

module.exports = mongoose.model("Carrito", carritoSchema);
