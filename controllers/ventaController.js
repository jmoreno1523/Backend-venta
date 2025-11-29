// controllers/ventaController.js
const Venta = require("../models/Venta");
const Carrito = require("../models/Carrito");

exports.crearVenta = async (req, res) => {
  try {
    const { usuario, cliente, userId } = req.body;

    // Validar que tenemos un identificador
    if (!usuario && !cliente && !userId) {
      return res.status(400).json({ 
        success: false,
        message: "Se requiere usuario, cliente o userId" 
      });
    }

    // Obtener carrito del usuario
    const carrito = await Carrito.findOne({ userId: userId || usuario || cliente });
    
    if (!carrito || carrito.productos.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "No hay productos en el carrito para crear la venta" 
      });
    }

    // Crear venta con los productos del carrito
    const nuevaVenta = new Venta({
      usuario: usuario || null,
      cliente: cliente || usuario || userId,
      productos: carrito.productos,
      total: carrito.total,
      fecha: new Date(),
    });

    await nuevaVenta.save();

    // Limpiar carrito después de la venta
    await Carrito.findOneAndDelete({ userId: userId || usuario || cliente });

    res.status(201).json({
      success: true,
      message: "✅ Venta registrada correctamente",
      venta: nuevaVenta
    });

  } catch (error) {
    console.error("❌ Error al registrar venta:", error);
    res.status(500).json({ 
      success: false,
      message: "Error en el servidor al registrar venta" 
    });
  }
};