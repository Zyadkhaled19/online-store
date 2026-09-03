const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcript = require("bcrypt");

const signToken = (userId, role) =>
  jwt.sign({ id: userId, role }, process.env.SECERT_KEY, {
    expiresIn: process.env.EXPIREIN,
  });

exports.reqister = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password, age, confirmpassword } =
      req.body;
    const user = new User({
      name,
      email,
      phoneNumber,
      password,
      age,
      confirmpassword,
    });
    await user.save();
    const token = signToken(user._id, user.role);
    res.status(201).json({
      status: "successfully",
      token,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcript.compare(password, user.password))) {
      return res.status(401).json({
        msg: "Invalid email or password",
      });
    }
    const token = signToken(user._id, user.role);
    res.status(200).json({
      status: "successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};
