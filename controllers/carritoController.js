// controllers/carritoController.js
const Carrito = require("../models/Carrito");
const Producto = require("../models/Producto");

exports.agregarAlCarrito = async (req, res) => {
  try {
    const { userId, productoId } = req.body;

    console.log("📥 Datos recibidos:", { userId, productoId });

    // Buscar producto
    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    // Buscar o crear carrito
    let carrito = await Carrito.findOne({ userId });
    if (!carrito) {
      carrito = new Carrito({ userId, productos: [], total: 0 });
    }

    // Verificar si el producto ya está en el carrito
    const productoIndex = carrito.productos.findIndex(
      p => p.productoId.toString() === productoId
    );

    if (productoIndex !== -1) {
      // Si ya existe, incrementar cantidad
      carrito.productos[productoIndex].cantidad += 1;
    } else {
      // Si no existe, agregar nuevo producto
      carrito.productos.push({
        productoId: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
      });
    }

    // Calcular total
    carrito.total = carrito.productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

    await carrito.save();

    res.json({
      success: true,
      message: "Producto agregado al carrito",
      carrito: {
        productos: carrito.productos,
        total: carrito.total
      }
    });

  } catch (error) {
    console.error("❌ Error al agregar al carrito:", error);
    res.status(500).json({ success: false, message: "Error: " + error.message });
  }
};

// OBTENER CARRITO - AHORA POR BODY
exports.obtenerCarrito = async (req, res) => {
  try {
    const { userId } = req.body; // Ahora viene por body, no por params

    console.log("🔍 Buscando carrito para usuario:", userId);

    const carrito = await Carrito.findOne({ userId });
    if (!carrito) {
      return res.json({ success: true, productos: [], total: 0 });
    }

    res.json({
      success: true,
      productos: carrito.productos,
      total: carrito.total
    });

  } catch (error) {
    console.error("❌ Error al obtener carrito:", error);
    res.status(500).json({ success: false, message: "Error: " + error.message });
  }
};

exports.limpiarCarrito = async (req, res) => {
  try {
    const { userId } = req.body;

    await Carrito.findOneAndDelete({ userId });

    res.json({ success: true, message: "Carrito limpiado" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error: " + error.message });
  }
};