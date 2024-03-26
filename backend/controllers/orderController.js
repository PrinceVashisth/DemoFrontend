const Order = require("../models/order");
const Product = require("../models/products");
const User = require("../models/reg");
const catchAsyncError = require('../Middleware/catchAsyncError');
const ErrorHandler = require("../utils/errorhandler");


//creating order details
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id, // here i am getting req.user._id but in getMyOrders i get nothing
  });

  res.status(201).json({
    status: true,
    order,
  });
});

// get single product -- admin
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Product not found with this Id"), 404);
  }
  console.log(req.user._id);

  res.status(201).json({
    status: true,
    order,
  });
});

//get all orders when user is logged in
exports.myOrder = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  console.log(orders);

  res.status(201).json({
    status: true,
    orders,
  });
});

//get all orders -- admin
exports.getAllOrder = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(201).json({
    status: true,
    totalAmount,
    orders,
  });
});

//update Order status,stock,quantity -- admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const orders = await Order.findById(req.params.id);

  if (!orders) {
    return next(new ErrorHander("Order doesn't exist with this Id"), 404);
  }

  if (orders.orderStatus == "Delivered") {
    return next(new ErrorHander("You have Already Delivered this order"), 400);
  }

  orders.orderItems.forEach(async (ord) => {
    await updateStock(ord.product, ord.quantity);
  });

  orders.orderStatus = req.body.status;

  if (req.body.status == "Delivered") {
    orders.deliveredAt = Date.now();
  }

  await orders.save({ validateBeforeSave: false });
  res.status(201).json({
    status: true,
  });
});

//function for updatin the stock
async function updateStock(id, qty) {
  const product = await Product.findById({ _id: id });
  product.stock = product.stock - qty;
  await product.save({ validateBeforeSave: false });
}

//function to delete order
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById({ _id: req.params.id });

  if (!order) {
    return next(new ErrorHander("Order with this is has not been found"), 404);
  }

  await order.deleteOne();

  res.status(200).json({
    status: true,
    message: "Successfully Deleted Order",
  });
});