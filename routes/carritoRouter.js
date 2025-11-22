const express = require("express");
const router = express.Router();
const carritoController = require("../controllers/carritoController");

// Agregar producto al carrito
router.post("/agregar", carritoController.agregarAlCarrito);

// Obtener carrito del usuario
router.get("/:userId", carritoController.obtenerCarrito);

// Limpiar carrito
router.post("/limpiar", carritoController.limpiarCarrito);

// Finalizar compra
router.post("/comprar", carritoController.finalizarCompra);

module.exports = router;