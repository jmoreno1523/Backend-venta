const express = require("express");
const router = express.Router();
const Venta = require("../models/Venta");

// =====================
// Crear una venta
// =====================
router.post("/", async (req, res) => {
  try {
    const { usuario, cliente, productos, total } = req.body;

    if ((!usuario && !cliente) || !productos || productos.length === 0 || !total) {
      return res.status(400).json({ message: "Faltan datos en la venta" });
    }

    const nuevaVenta = new Venta({
      usuario: usuario || null, // si existe usuario lo guardamos
      cliente: cliente || null, // si es invitado lo guardamos como string
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
});

// =====================
// Obtener todas las ventas
// =====================
router.get("/", async (req, res) => {
  try {
    const ventas = await Venta.find().populate("usuario", "nombre email");
    res.json(ventas);
  } catch (error) {
    console.error("❌ Error al obtener ventas:", error.message);
    res
      .status(500)
      .json({ message: "Error en el servidor al obtener ventas" });
  }
});

module.exports = router;







