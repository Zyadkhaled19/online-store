const Order = require("../model/Order");
const Cart = require("../model/cart.model");
const Product = require("../model/product.model");

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    const userId = req.user._id;

    if (!items || items.length === 0 || !shippingAddress) {
      return res
        .status(400)
        .json({ message: "Cannot place an order with empty items" });
    }

    const quantities = new Map();
    for (const item of items) {
      const productId = item.productId;
      const quantity = Number(item.quantity);
      if (!productId || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Invalid order item" });
      }
      quantities.set(
        productId.toString(),
        (quantities.get(productId.toString()) || 0) + quantity,
      );
    }

    const orderItems = [];
    const changedProducts = [];
    let totalPrice = 0;

    for (const [productId, quantity] of quantities) {
      const product = await Product.findById(productId);
      if (!product) {
        for (const changed of changedProducts) {
          await Product.findByIdAndUpdate(changed.id, {
            $inc: { stock: changed.quantity },
          });
        }
        return res
          .status(404)
          .json({ message: "One or more products were not found" });
      }

      const updated = await Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true },
      );
      if (!updated) {
        for (const changed of changedProducts) {
          await Product.findByIdAndUpdate(changed.id, {
            $inc: { stock: changed.quantity },
          });
        }
        return res
          .status(409)
          .json({ message: `${product.name} does not have enough stock` });
      }

      changedProducts.push({ id: product._id, quantity });
      totalPrice += product.price * quantity;
      orderItems.push({
        productId: product._id,
        quantity,
        price: product.price,
      });
    }

    const newOrder = new Order({
      userId,
      items: orderItems,
      totalPrice,
      shippingAddress,
    });

    let savedOrder;
    try {
      savedOrder = await newOrder.save();
    } catch (error) {
      for (const changed of changedProducts) {
        await Product.findByIdAndUpdate(changed.id, {
          $inc: { stock: changed.quantity },
        });
      }
      throw error;
    }

    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res
      .status(201)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};
