// routes/carritoRouter.js
const express = require("express");
const router = express.Router();
const carritoController = require("../controllers/carritoController");

router.post("/agregar", carritoController.agregarAlCarrito);
router.post("/obtener", carritoController.obtenerCarrito); // Cambiado de GET a POST
router.post("/limpiar", carritoController.limpiarCarrito);

module.exports = router;