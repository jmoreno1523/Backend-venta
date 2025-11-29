// controllers/ventaController.js
const Venta = require("../models/Venta");
const Carrito = require("../models/Carrito");

exports.crearVenta = async (req, res) => {
  try {
    const { usuario, cliente, productos, total } = req.body;

    if ((!usuario && !cliente) || !productos || productos.length === 0 || !total) {
      return res.status(400).json({ message: "Faltan datos en la venta" });
    }

    const nuevaVenta = new Venta({
      usuario: usuario || null,
      cliente: cliente || null,
      productos,
      total,
      fecha: new Date(),
    });

    await nuevaVenta.save();
    res
      .status(201)
      .json({ message: "✅ Venta registrada correctamente", venta: nuevaVenta });
  } catch (error) {
    console.error("❌ Error al registrar venta:", error.message);
    res
      .status(500)
      .json({ message: "Error en el servidor al registrar venta" });
  }
};

exports.listarVentas = async (req, res) => {
  try {
    const ventas = await Venta.find().populate("usuario", "nombre email");
    res.json(ventas);
  } catch (error) {
    console.error("❌ Error al obtener ventas:", error.message);
    res
      .status(500)
      .json({ message: "Error en el servidor al obtener ventas" });
  }
};