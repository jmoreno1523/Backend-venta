const Carrito = require("../models/Carrito");
const Producto = require("../models/Producto");

// Agregar al carrito - CORREGIDO
exports.agregarAlCarrito = async (req, res) => {
  try {
    const { userId, productoId } = req.body;

    // Validar que vengan los datos necesarios
    if (!userId || !productoId) {
      return res.status(400).json({ 
        success: false, 
        message: "Faltan datos: userId y productoId son requeridos" 
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
      carrito = new Carrito({ 
        userId, 
        productos: [], 
        total: 0 
      });
    }

    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.productos.find(
      p => p.productoId.toString() === productoId
    );

    if (productoExistente) {
      // Si ya existe, incrementar cantidad
      productoExistente.cantidad += 1;
    } else {
      // Si no existe, agregar nuevo producto
      carrito.productos.push({
        productoId: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
      });
    }

    // Calcular total CORREGIDO (precio * cantidad)
    carrito.total = carrito.productos.reduce(
      (sum, p) => sum + (p.precio * p.cantidad), 
      0
    );

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
    console.error("Error al agregar al carrito:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor: " + error.message 
    });
  }
};

// Ver carrito - CORREGIDO
exports.obtenerCarrito = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validar que venga el userId
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId es requerido" 
      });
    }

    const carrito = await Carrito.findOne({ userId });
    
    if (!carrito) {
      return res.json({ 
        success: true, 
        productos: [], 
        total: 0,
        message: "Carrito vacío" 
      });
    }

    res.json({
      success: true,
      productos: carrito.productos,
      total: carrito.total,
      cantidadProductos: carrito.productos.reduce((sum, p) => sum + p.cantidad, 0)
    });

  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor: " + error.message 
    });
  }
};

// Limpiar carrito - CORREGIDO
exports.limpiarCarrito = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId es requerido" 
      });
    }

    const resultado = await Carrito.findOneAndDelete({ userId });

    if (!resultado) {
      return res.json({ 
        success: true, 
        message: "El carrito ya estaba vacío" 
      });
    }

    res.json({ 
      success: true, 
      message: "Carrito limpiado correctamente" 
    });

  } catch (error) {
    console.error("Error al limpiar carrito:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor: " + error.message 
    });
  }
};

// Nuevo método: Eliminar producto del carrito
exports.eliminarDelCarrito = async (req, res) => {
  try {
    const { userId, productoId } = req.body;

    if (!userId || !productoId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId y productoId son requeridos" 
      });
    }

    const carrito = await Carrito.findOne({ userId });
    if (!carrito) {
      return res.status(404).json({ 
        success: false, 
        message: "Carrito no encontrado" 
      });
    }

    // Filtrar el producto a eliminar
    carrito.productos = carrito.productos.filter(
      p => p.productoId.toString() !== productoId
    );

    // Recalcular total
    carrito.total = carrito.productos.reduce(
      (sum, p) => sum + (p.precio * p.cantidad), 
      0
    );

    await carrito.save();

    res.json({
      success: true,
      message: "Producto eliminado del carrito",
      carrito: {
        productos: carrito.productos,
        total: carrito.total
      }
    });

  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor: " + error.message 
    });
  }
};