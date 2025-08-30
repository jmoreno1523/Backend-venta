const mongoose = require("mongoose");

const ventaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // cuando hay login
  cliente: { type: String, required: false }, // cuando es invitado
  productos: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" }, // opcional, si tienes coleccion productos
      nombre: { type: String, required: true },
      precio: { type: Number, required: true },
      cantidad: { type: Number, required: true, default: 1 },
    },
  ],
  total: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Venta", ventaSchema);



