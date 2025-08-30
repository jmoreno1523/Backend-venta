// controllers/dashboardController.js
const Venta = require("../models/Venta");
const User = require("../models/User");
const Producto = require("../models/Producto"); // 👈 Importamos el modelo Producto

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsuarios = await User.countDocuments();
    const totalVentas = await Venta.countDocuments();

    const ingresosTotales = await Venta.aggregate([
      { $group: { _id: null, total: { $sum: "$precio" } } }
    ]);

    const ventasPorUsuario = await Venta.aggregate([
      { $group: { _id: "$usuario", ventas: { $sum: 1 } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "usuarioData"
        }
      },
      {
        $project: {
          usuario: { $arrayElemAt: ["$usuarioData.name", 0] },
          ventas: 1
        }
      }
    ]);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const maniana = new Date(hoy);
    maniana.setDate(hoy.getDate() + 1);

    const topHoy = await Venta.aggregate([
      { $match: { fecha: { $gte: hoy, $lt: maniana } } },
      { $group: { _id: "$usuario", ventas: { $sum: 1 } } },
      { $sort: { ventas: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "usuarioData"
        }
      },
      {
        $project: {
          usuario: { $arrayElemAt: ["$usuarioData.name", 0] },
          ventas: 1
        }
      }
    ]);

    const nuevosUsuariosHoy = await User.countDocuments({
      createdAt: { $gte: hoy, $lt: maniana }
    });

    const ingresosPorMesRaw = await Venta.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$fecha" },
            month: { $month: "$fecha" }
          },
          ingresos: { $sum: "$precio" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 }
    ]);

    const ingresosPorMes = ingresosPorMesRaw.map((d) => ({
      mes: `${d._id.month}/${d._id.year}`,
      ingresos: d.ingresos
    }));

    const ultimasVentas = await Venta.find()
      .sort({ fecha: -1 })
      .limit(5)
      .lean();

    // 👇 Nuevos: traer productos
    const productos = await Producto.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      usuarios: totalUsuarios,
      ventas: totalVentas,
      ingresos: ingresosTotales[0]?.total || 0,
      ventasPorUsuario,
      topHoy: topHoy[0] || null,
      nuevosUsuariosHoy,
      ingresosPorMes,
      ultimasVentas,
      productos // 👈 Se envía al frontend
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar dashboard" });
  }
};
