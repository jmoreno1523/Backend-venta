// controllers/carritoController.js
const Carrito = require("../models/Carrito");
const Producto = require("../models/Producto");

// Agregar al carrito - CORREGIDO
exports.agregarAlCarrito = async (req, res) => {
  try {
    const { userId, productoId } = req.body;

    console.log("Datos recibidos:", { userId, productoId }); // Para debug

    // Validaciones
    if (!userId || !productoId) {
      return res.status(400).json({ 
        success: false, 
        message: "Faltan datos requeridos: userId y productoId" 
      });
    }

    // Verificar que el producto existe
    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({ 
        success: false, 
        message: "Producto no encontrado" 
      });
    }

    // Buscar carrito existente
    let carrito = await Carrito.findOne({ userId });

    if (!carrito) {
      // Crear nuevo carrito si no existe
      carrito = new Carrito({ 
        userId, 
        productos: [], 
        total: 0 
      });
    }

    // Verificar si el producto ya está en el carrito
    const productoExistenteIndex = carrito.productos.findIndex(
      p => p.productoId && p.productoId.toString() === productoId
    );

    if (productoExistenteIndex !== -1) {
      // Incrementar cantidad si ya existe
      carrito.productos[productoExistenteIndex].cantidad += 1;
    } else {
      // Agregar nuevo producto
      carrito.productos.push({
        productoId: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
      });
    }

    // Calcular total (precio * cantidad)
    carrito.total = carrito.productos.reduce(
      (total, producto) => total + (producto.precio * producto.cantidad), 
      0
    );

    await carrito.save();

    res.json({
      success: true,
      message: "Producto agregado al carrito correctamente",
      carrito: {
        userId: carrito.userId,
        productos: carrito.productos,
        total: carrito.total,
        cantidadTotal: carrito.productos.reduce((sum, p) => sum + p.cantidad, 0)
      }
    });

  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
};

// Obtener carrito - CORREGIDO
exports.obtenerCarrito = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId es requerido" 
      });
    }

    const carrito = await Carrito.findOne({ userId });

    if (!carrito || carrito.productos.length === 0) {
      return res.json({ 
        success: true, 
        productos: [], 
        total: 0,
        message: "Carrito vacío" 
      });
    }

    res.json({
      success: true,
      userId: carrito.userId,
      productos: carrito.productos,
      total: carrito.total,
      cantidadProductos: carrito.productos.reduce((sum, p) => sum + p.cantidad, 0)
    });

  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
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

    res.json({ 
      success: true, 
      message: resultado ? "Carrito limpiado correctamente" : "El carrito ya estaba vacío" 
    });

  } catch (error) {
    console.error("Error al limpiar carrito:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
};

// Nuevo: Eliminar producto específico del carrito
exports.eliminarProducto = async (req, res) => {
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
      (total, producto) => total + (producto.precio * producto.cantidad), 
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
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
};