// routes/productoRouter.js
const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");

// GET /api/productos -> devolver siempre un array
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

// POST /api/productos -> crear producto con descripcion
router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen } = req.body;

    if (!nombre || precio == null) {
      return res.status(400).json({ message: "Nombre y precio son obligatorios" });
    }

    const nuevoProducto = new Producto({
      nombre,
      descripcion: descripcion || "Sin descripción",
      precio: Number(precio),
      imagen: imagen || "https://via.placeholder.com/300x200"
    });

    const guardado = await nuevoProducto.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ message: "Error al crear producto" });
  }
});

// GET /api/productos/:id
router.get("/:id", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
});

// DELETE /api/productos/:id
router.delete("/:id", async (req, res) => {
  try {
    const eliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
});

module.exports = router;



