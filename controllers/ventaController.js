
const Venta = require("../models/Venta");

exports.crearVenta = async (req, res) => {
  try {
    const venta = new Venta(req.body);
    await venta.save();
    res.json(venta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarVentas = async (req, res) => {
  try {
    const ventas = await Venta.find();
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
