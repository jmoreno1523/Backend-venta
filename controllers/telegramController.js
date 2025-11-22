const Producto = require("../models/Producto");

// Formato especial para Telegram (mensajes cortos)
exports.obtenerProductosTelegram = async (req, res) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    
    // Formatear para Telegram (más simple)
    const productosFormateados = productos.map(p => ({
      id: p._id,
      nombre: p.nombre,
      precio: p.precio,
      descripcion: p.descripcion.substring(0, 50) + (p.descripcion.length > 50 ? '...' : '') // Acortar descripción
    }));

    res.json({
      success: true,
      productos: productosFormateados,
      total: productos.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Buscar producto por ID para Telegram
exports.obtenerProductoTelegram = async (req, res) => {
  try {
    const { id } = req.params;
    
    const producto = await Producto.findById(id);
    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.json({
      success: true,
      producto: {
        id: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        descripcion: producto.descripcion,
        imagen: producto.imagen
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};