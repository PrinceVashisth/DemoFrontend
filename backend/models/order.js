const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, "Add your Address"],
    },
    city: {
      type: String,
      required: [true, "Add your City"],
    },
    state: {
      type: String,
      required: [true, "Add your State"],
    },
    pincode: {
      type: Number,
      required: [true, "Add your pincode"],
      minLength: [6, "cannot exceed more than 6 characters"],
    },
    phoneNo: {
      type: Number,
      unique: [true, "Phone number already exists"],
      match: /^\d{10}$/,
      required: [true, " enter a valid Phone No"],
    },
  },

  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required:true,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required:true,
      },
    },
  ],
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true,
  },
  paymentInfo: {
    id: {
      type: String,
      required: [true, "Payment Id is Required"],
    },
    status: {
      type: String,
      required: true,
    },
    mode:{
      type: String,
      enum: ['Cash','Online'],
      default:"Cash",
      required: true,
    }
  },
  paidAt: {
    type: Date,
    required: true,
  },
  itemsPrice: {
    type: Number,
    default: 0,
    required: true,
  },
  taxPrice: {
    type: Number,
    default: 0,
    required: true,
  },
  shippingPrice: {
    type: Number,
    default: 0,
    required: true,
  },
  totalPrice: {
    type: Number,
    default: 0,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", orderSchema);