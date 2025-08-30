
// routes/profileRouter.js
const express = require("express");
const router = express.Router();

// Ruta de prueba para el perfil
router.get("/", (req, res) => {
  res.json({
    success: true,
    user: {
      name: "Admin Demo",
      email: "admin@demo.com"
    }
  });
});

module.exports = router;
