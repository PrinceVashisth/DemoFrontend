import React from "react";
import { Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import "./ConfirmOrder.css";
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";

const ConfirmOrders = () => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart );
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);


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

  const proceedToPayment = () => {
    console.log(user, isAuthenticated)
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
      address
    };
    newOrder.shippingInfo = shippingInfo;
    newOrder.orderItems = cartItems;
    newOrder.user = user.id;
    // newOrder.paymentInfo = paymentInfo,
    // newOrder.shippingPrice = shippingPrice


    sessionStorage.setItem("orderInfo", JSON.stringify(data));

    console.log(newOrder)
    // navigate("/process/payment");
  };

  return (
    <>
    <Header />
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
                    <Link to={`/product/${item.product}`}>
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
            <div className="orderSummaryTotal">
              <p>
                <b>Payment Mode:</b>
              </p>
              <span>
                <label>Cash on Delivery</label>
                <input type='radio' value={'Cash'} name="paymentInfo"></input>
                <label>Online</label>
                <input type='radio' value={'Online'} name="paymentInfo"></input>
                
                </span>
            </div>
                

            <button onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ConfirmOrders;
