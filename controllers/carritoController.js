const Producto = require("../models/Producto");

// Almacenamiento temporal en memoria (puedes cambiarlo a Redis después)
const carritosTemp = new Map(); // { userId: { productos: [], total: 0 } }

exports.agregarAlCarrito = async (req, res) => {
  try {
    const { userId, productoId } = req.body;
    
    // Validar datos requeridos
    if (!userId || !productoId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId y productoId son requeridos" 
      });
    }
    
    // Buscar producto en la base de datos
    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({ 
        success: false, 
        message: "Producto no encontrado" 
      });
    }

    // Inicializar carrito si no existe
    if (!carritosTemp.has(userId)) {
      carritosTemp.set(userId, { productos: [], total: 0 });
    }

    const carrito = carritosTemp.get(userId);
    
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.productos.find(p => p.productoId.toString() === productoId);
    
    if (productoExistente) {
      // Si ya existe, aumentar cantidad
      productoExistente.cantidad += 1;
    } else {
      // Si no existe, agregar nuevo producto
      const productoEnCarrito = {
        productoId: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        imagen: producto.imagen
      };
      carrito.productos.push(productoEnCarrito);
    }
    
    // Recalcular total
    carrito.total = carrito.productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

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
    
    const carrito = carritosTemp.get(userId) || { productos: [], total: 0 };
    
    res.json({
      success: true,
      carrito: carrito.productos,
      total: carrito.total,
      cantidadProductos: carrito.productos.length
    });
  } catch (error) {
    console.error("Error en obtenerCarrito:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
};

exports.eliminarDelCarrito = async (req, res) => {
  try {
    const { userId, productoId } = req.body;
    
    if (!userId || !productoId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId y productoId son requeridos" 
      });
    }
    
    const carrito = carritosTemp.get(userId);
    if (!carrito) {
      return res.status(404).json({ 
        success: false, 
        message: "Carrito no encontrado" 
      });
    }

    // Filtrar el producto a eliminar
    carrito.productos = carrito.productos.filter(p => p.productoId.toString() !== productoId);
    
    // Recalcular total
    carrito.total = carrito.productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

    res.json({
      success: true,
      message: "Producto eliminado del carrito",
      carrito: carrito.productos,
      total: carrito.total
    });
  } catch (error) {
    console.error("Error en eliminarDelCarrito:", error);
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
    
    if (carritosTemp.has(userId)) {
      carritosTemp.set(userId, { productos: [], total: 0 });
    }
    
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