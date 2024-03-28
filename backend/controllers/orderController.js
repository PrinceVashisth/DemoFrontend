const Order = require("../models/order");
const catchAsyncError = require("../Middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/reg"); 


exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user
  } = req.body;

  try {

    const userData = await User.findById(user);
    console.log('yha user data db mein save ho rha h', userData)
        if (!userData) {
            return next(new ErrorHandler("User not found", 404));
        }

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: userData
    });
console.log('yha complete order details', order)


    res.status(201).json({
      status: true,
      order,
    });
  } catch (error) {

    if (error.name === "MongoServerError" && error.code === 11000) {
      // Duplicate key error
      return next(
        new ErrorHandler("Phone number already exists in another order", 400)
      );
    } else {
      // Other errors
      return next(new ErrorHandler(error.message, 500));
    }
  }
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
    const user = User.findById(order.user);
    order.user = user;
    // console.log('user data:------', user)
  });
  res.status(201).json({
    status: true,
    totalAmount,
    orders,
  });
});

//update Order status,stock,quantity -- admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const orderId = req.params.id;
  const newStatus = req.body.status;

  // Check if the order exists
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  // Check if the new status is "Delivered" and the order has already been delivered
  if (newStatus === "Delivered" && order.orderStatus === "Delivered") {
    return next(new ErrorHandler("This order has already been delivered", 400));
  }

  // Update the order status
  order.orderStatus = newStatus;

  // If the new status is "Delivered", update deliveredAt timestamp
  if (newStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }

  // Save the updated order
  await order.save();

  // Send response
  res.status(200).json({
    status: true,
    message: "Order status updated successfully",
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

exports.updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const newStatus = req.body.status;

  try {
      // Find the order by ID
      const order = await Order.findById(orderId);
      if (!order) {
          return res.status(404).json({ error: 'Order not found' });
      }

      // Update the status of the order
      order.orderStatus = newStatus;
      
      // Save the updated order
      await order.save();

      // Fetch all orders again and send updated orders list as response
      const orders = await Order.find();
      res.json({ orders });
  } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};
