import React, { useState } from "react";
import { Typography } from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import "./ConfirmOrder.css";
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import axios from "axios";
import {APP_ADDRESS, APP_DESC, APP_LOGO, APP_NAME, RAZORPAY_KEY_ID} from "../../constants/ServerConstant";
import {removeAllItemsFromCart} from "../../actions/CartAction";

const ConfirmOrders = () => {
  const dispatch = useDispatch();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  // const [paymentMode, setPaymentMode] = useState("Cash");
  const generatePaymentId = () => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substr(2, 5);
    return `receipt_order_${timestamp}-${randomString}`;
  };

  const navigate = useNavigate();
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const newOrder = {
    shippingInfo: {
      address: "",
      city: "",
      state: "",
      pincode: null,
      phoneNo: null,
    },
    orderItems: [],
    user: null,
    paymentInfo: {
      id: "",
      status: "",
      mode: "",
    },
    paidAt: null,
    itemsPrice: 0,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
    orderStatus: "",
    deliveredAt: null,
    createdAt: null,
  };

  const shippingCharges = subtotal > 1000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + tax + shippingCharges;
  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;


  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const proceedToPayment = async () => {
    const requestBody = {
      "amount": totalPrice,
      "receipt": generatePaymentId()
    }
    const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return false;
    }
    //initiate payment order
    const result = await axios.post(`/api/payment/initiate`, requestBody);

    if (!result) {
      alert("Server error. Are you online?");
      return false;
    }
    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: APP_NAME,
      description: APP_DESC,
      image: APP_LOGO,
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const result = await axios.post(`/api/payment/success`, data);

        if(result.data.msg === "success"){
           placeOrder(requestBody.receipt);
        }else{
          alert("try again");
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: shippingInfo.phoneNo,
      },
      notes: {
        address: APP_ADDRESS,
      },
      theme: {
        color: "#9E2A53",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
  const placeOrder = async (receipt) => {

    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
      address,
    };

    if (isAuthenticated) {
      newOrder.shippingInfo = shippingInfo;
      newOrder.shippingInfo.pincode = parseInt(shippingInfo.pinCode);
      newOrder.orderItems = cartItems;
      newOrder.user = user;
      newOrder.paymentInfo.mode = "Online";
      newOrder.paymentInfo.id = receipt;
      newOrder.paymentInfo.status = "paid";
      newOrder.itemsPrice = subtotal;
      newOrder.taxPrice = tax;
      newOrder.shippingPrice = shippingCharges;
      newOrder.totalPrice = totalPrice;
      newOrder.orderStatus = "Created";

      sessionStorage.setItem("orderInfo", JSON.stringify(newOrder));
      //console.log(newOrder)
      // navigate("/process/payment");

      const { data } = await axios.post(`/api/order/new`, newOrder);

      if (data.status === true) {
        //Todo: empty the cart items
        dispatch(removeAllItemsFromCart());
        //todo: navigate to the specific page accrodingly as of now redirecting to products page
        navigate("/products");
      } else {
        alert("something went wrong");
        //todo: show the usefull message accrodingly
      }
    } else {
      navigate("/user/login");
    }
  };

  return (
    <>
      {/* <Header /> */}
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>UserName</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="Product" />
                    <Link to={`/products/${item.product}`}>
                      {item.name}
                      {console.log(item.image)}
                    </Link>{" "}
                    <span>
                      {item.quantity} X ₹{item.price} ={" "}
                      <b>₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/*  */}
        <div>
          <div className="orderSummary">
            <Typography>Order Summery</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>₹{subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>₹{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>₹{tax}</span>
              </div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>₹{totalPrice}</span>
            </div>
            {/*<div className="orderSummaryTotal">
              <p>
                <b>Payment Mode:</b>
              </p>
              <span>
                <label>Cash on Delivery</label>
                <input
                  type="radio"
                  name="paymentMode"
                  value="Cash"
                  checked={paymentMode === "Cash"} // Check if payment mode is 'cash'
                  onChange={handlePaymentModeChange} // Call handler when 'cash' is selected
                />
                <label>Online</label>
                <input
                  type="radio"
                  name="paymentMode"
                  value="Online"
                  checked={paymentMode === "Online"} // Check if payment mode is 'online'
                  onChange={handlePaymentModeChange} // Call handler when 'online' is selected
                />
              </span>
            </div>*/}

            <button onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default ConfirmOrders;
