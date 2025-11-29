const express = require("express");
const router = express.Router();
const carritoController = require("../controllers/carritoController");

// Agregar producto al carrito
router.post("/agregar", carritoController.agregarAlCarrito);

// Obtener carrito del usuario
router.get("/:userId", carritoController.obtenerCarrito);

// Eliminar producto del carrito
router.post("/eliminar", carritoController.eliminarDelCarrito);

// Limpiar carrito completo
router.post("/limpiar", carritoController.limpiarCarrito);

module.exports = router;