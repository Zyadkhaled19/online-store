const User = require("../model/user.model");

exports.findUserByEmail = async (req, res, next) => {
  try {
    const email = req.query.email?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }

    const user = await User.findOne({ email }).select(
      "_id name email phoneNumber role",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

exports.changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be user or admin" });
    }

    if (req.user._id.toString() === req.params.id && role !== "admin") {
      return res
        .status(400)
        .json({ message: "You cannot remove your own admin role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true },
    ).select("_id name email phoneNumber role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User role updated successfully", data: user });
  } catch (error) {
    next(error);
  }
};
