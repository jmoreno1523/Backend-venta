const Carrito = require("../models/Carrito");
const Producto = require("../models/Producto");

exports.agregarAlCarrito = async (req, res) => {
  try {
    const { userId, productoId } = req.body;
    
    if (!userId || !productoId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId y productoId son requeridos" 
      });
    }
    
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
      productoExistente.cantidad += 1;
    } else {
      carrito.productos.push({
        productoId: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        imagen: producto.imagen
      });
    }
    
    // Recalcular total
    carrito.total = carrito.productos.reduce(
      (sum, p) => sum + (p.precio * p.cantidad), 0
    );
    
    carrito.updatedAt = new Date();
    await carrito.save();

    res.json({
      success: true,
      message: "Producto agregado al carrito",
      carrito: carrito.productos,
      total: carrito.total,
      productoAgregado: producto.nombre
    });
  } catch (error) {
    console.error("Error en agregarAlCarrito:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
};

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
    const carritoData = carrito || { productos: [], total: 0 };
    
    res.json({
      success: true,
      carrito: carritoData.productos,
      total: carritoData.total,
      cantidadProductos: carritoData.productos.length
    });
  } catch (error) {
    console.error("Error en obtenerCarrito:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
};

exports.limpiarCarrito = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId es requerido" 
      });
    }
    
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