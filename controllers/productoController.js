const Producto = require("../models/Producto");

exports.crearProducto = async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
