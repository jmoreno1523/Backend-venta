const express = require("express");
const router = express.Router();
const carritoController = require("../controllers/carritoController");

router.post("/agregar", carritoController.agregarAlCarrito);
router.get("/:userId", carritoController.obtenerCarrito);
router.post("/limpiar", carritoController.limpiarCarrito);
router.post("/eliminar", carritoController.eliminarDelCarrito); // Nueva ruta

module.exports = router;