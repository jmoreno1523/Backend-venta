const express = require("express");
const router = express.Router();
const telegramController = require("../controllers/telegramController");

// Productos formateados para Telegram
router.get("/productos", telegramController.obtenerProductosTelegram);

// Producto específico para Telegram
router.get("/productos/:id", telegramController.obtenerProductoTelegram);

module.exports = router;