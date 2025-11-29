// =====================
// Configuración inicial
// =====================
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// =====================
// Middlewares
// =====================
app.use(cors());
app.use(express.json()); // Para recibir JSON en el body

// =====================
// Rutas principales
// =====================
app.use("/api/auth", require("./routes/authRoutes"));            // Registro y login
app.use("/api/users", require("./routes/userRoutes"));           // CRUD de usuarios
app.use("/api/ventas", require("./routes/ventaRouter"));         // Ventas
app.use("/api/dashboard", require("./routes/dashboardRouter"));  // Dashboard
app.use("/api/profile", require("./routes/profileRouter"));      // Perfil
app.use("/api/productos", require("./routes/productoRouter"));   // Productos
// Agrega esta línea con las otras rutas:
app.use("/api/carrito", require("./routes/carritoRouter"));

// =====================
// Ruta raíz (ping del servidor)
// =====================
app.get("/", (req, res) => {
  res.send("🚀 Servidor backend funcionando correctamente");
});

// =====================
// Conexión a MongoDB
// =====================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(PORT, () =>
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Error de conexión a MongoDB:", err.message);
    process.exit(1);
  });

// =====================
// Manejo de errores
// =====================

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ message: "❌ Ruta no encontrada" });
});

// Errores internos
app.use((err, req, res, next) => {
  console.error("❌ Error en el servidor:", err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});
