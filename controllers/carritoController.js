const Carrito = require("../models/Carrito");
const Producto = require("../models/Producto");

// Agregar al carrito con cantidad
exports.agregarAlCarrito = async (req, res) => {
  try {
    const { userId, productoId, cantidad = 1 } = req.body;

    // Validar datos requeridos
    if (!userId || !productoId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId y productoId son requeridos" 
      });
    }

    // Buscar producto
    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({ 
        success: false, 
        message: "Producto no encontrado" 
      });
    }

    // Buscar o crear carrito
    let carrito = await Carrito.findOne({ userId });
    if (!carrito) {
      carrito = new Carrito({ userId, productos: [], total: 0 });
    }

    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.productos.find(
      p => p.productoId.toString() === productoId
    );

    if (productoExistente) {
      // Si ya existe, aumentar cantidad
      productoExistente.cantidad += cantidad;
    } else {
      // Si no existe, agregar nuevo producto
      carrito.productos.push({
        productoId: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidad
      });
    }

    // Recalcular total
    carrito.total = carrito.productos.reduce(
      (sum, p) => sum + (p.precio * p.cantidad), 0
    );

    await carrito.save();

    res.json({
      success: true,
      message: "Producto agregado al carrito",
      producto: producto.nombre,
      cantidad: cantidad,
      total: carrito.total
    });

  } catch (error) {
    console.error("Error en agregarAlCarrito:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
};

// Ver carrito
exports.obtenerCarrito = async (req, res) => {
  try {
    const { userId } = req.params;

    const carrito = await Carrito.findOne({ userId });
    if (!carrito) {
      return res.json({ 
        success: true, 
        productos: [], 
        total: 0 
      });
    }

    res.json({
      success: true,
      productos: carrito.productos,
      total: carrito.total
    });

  } catch (error) {
    console.error("Error en obtenerCarrito:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
};

// Limpiar carrito
exports.limpiarCarrito = async (req, res) => {
  try {
    const { userId } = req.body;

    await Carrito.findOneAndDelete({ userId });

    res.json({ 
      success: true, 
      message: "Carrito limpiado exitosamente" 
    });

  } catch (error) {
    console.error("Error en limpiarCarrito:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
};