// routes/carritoRouter.js
const express = require("express");
const router = express.Router();
const carritoController = require("../controllers/carritoController");

router.post("/agregar", carritoController.agregarAlCarrito);
router.get("/:userId", carritoController.obtenerCarrito); // GET con ID en URL
router.post("/limpiar", carritoController.limpiarCarrito);

module.exports = router;