const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Crear usuario (registro)
exports.crearUsuario = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verificar si ya existe un usuario con ese email
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "El usuario ya existe" });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    user = new User({
      name,
      email,
      password: hashedPassword
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Contraseña incorrecta" });
    }

    res.json({
      success: true,
      message: "Login exitoso",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
