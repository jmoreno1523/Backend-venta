const Carrito = require("../models/Carrito");
const Producto = require("../models/Producto");

exports.agregarAlCarrito = async (req, res) => {
  try {
    let { userId, productoId, cantidad = 1 } = req.body;
    cantidad = Number(cantidad);

    if (!userId || !productoId) {
      return res.status(400).json({ success: false, message: "userId y productoId son requeridos" });
    }

    if (isNaN(cantidad) || cantidad <= 0) {
      return res.status(400).json({ success: false, message: "La cantidad debe ser un número válido" });
    }

    const producto = await Producto.findById(productoId);
    if (!producto) return res.status(404).json({ success: false, message: "Producto no encontrado" });

    let carrito = await Carrito.findOne({ userId });
    if (!carrito) carrito = new Carrito({ userId, productos: [], total: 0 });

    const productoExistente = carrito.productos.find(p => p.productoId.toString() === productoId);

    if (productoExistente) {
      productoExistente.cantidad += cantidad;
    } else {
      carrito.productos.push({ productoId: producto._id, nombre: producto.nombre, precio: producto.precio, cantidad });
    }

    carrito.total = carrito.productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    await carrito.save();

    res.json({ success: true, message: "Producto agregado al carrito", data: { producto: producto.nombre, cantidad, totalCarrito: carrito.total } });

  } catch (error) {
    console.error("Error en agregarAlCarrito:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

exports.obtenerCarrito = async (req, res) => {
  try {
    const { userId } = req.params;
    const carrito = await Carrito.findOne({ userId });
    if (!carrito) return res.json({ success: true, productos: [], total: 0 });
    res.json({ success: true, productos: carrito.productos, total: carrito.total });
  } catch (error) {
    console.error("Error en obtenerCarrito:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

exports.limpiarCarrito = async (req, res) => {
  try {
    const { userId } = req.body;
    await Carrito.findOneAndDelete({ userId });
    res.json({ success: true, message: "Carrito limpiado exitosamente" });
  } catch (error) {
    console.error("Error en limpiarCarrito:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};
