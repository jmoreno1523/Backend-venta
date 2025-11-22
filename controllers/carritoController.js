const Producto = require("../models/Producto");
const Venta = require("../models/Venta");

// Guardar carrito temporal para Telegram
const carritosTemp = new Map(); // { userId: { productos: [], total: 0 } }

exports.agregarAlCarrito = async (req, res) => {
  try {
    const { userId, productoId } = req.body;
    
    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    // Inicializar carrito si no existe
    if (!carritosTemp.has(userId)) {
      carritosTemp.set(userId, { productos: [], total: 0 });
    }

    const carrito = carritosTemp.get(userId);
    const productoEnCarrito = {
      productoId: producto._id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    };

    carrito.productos.push(productoEnCarrito);
    carrito.total += producto.precio;

    res.json({
      success: true,
      message: "Producto agregado al carrito",
      carrito: carrito.productos,
      total: carrito.total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.obtenerCarrito = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const carrito = carritosTemp.get(userId) || { productos: [], total: 0 };
    
    res.json({
      success: true,
      carrito: carrito.productos,
      total: carrito.total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.limpiarCarrito = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (carritosTemp.has(userId)) {
      carritosTemp.set(userId, { productos: [], total: 0 });
    }
    
    res.json({ success: true, message: "Carrito limpiado" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.finalizarCompra = async (req, res) => {
  try {
    const { userId, usuario, cliente } = req.body;
    
    const carrito = carritosTemp.get(userId);
    if (!carrito || carrito.productos.length === 0) {
      return res.status(400).json({ success: false, message: "Carrito vacío" });
    }

    const nuevaVenta = new Venta({
      usuario: usuario || null,
      cliente: cliente || "Cliente Telegram",
      productos: carrito.productos,
      total: carrito.total,
      fecha: new Date(),
    });

    await nuevaVenta.save();
    
    // Limpiar carrito después de la compra
    carritosTemp.set(userId, { productos: [], total: 0 });

    res.json({
      success: true,
      message: "Compra realizada exitosamente",
      venta: {
        id: nuevaVenta._id,
        total: nuevaVenta.total,
        productos: nuevaVenta.productos.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};