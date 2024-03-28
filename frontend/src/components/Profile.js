import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MdNoAccounts, MdOutlineAccountCircle, MdOutlineSearch } from "react-icons/md";
import { useSelector } from "react-redux";
import Header from "../partials/Header";

const Profile = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const orderDetails = []; // Your order details array

  useEffect(() => {
    console.log(user);
  }, [user]);



  return (
    <div>
      {isAuthenticated ? (
        <>
          <Header />
          <div className="container">
            <h1>Account</h1>
            <div className="user-info">
              <MdOutlineAccountCircle size={100} className="user-info-img" />
              <div className="user-info-details">
                <div>
                  <strong>Name : </strong> <span>{user.name}</span>
                </div>
                <div>
                  <strong>Email : </strong> <span>{user.email}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <h2 className="">Your Orders</h2>
            <div className="d-flex justify-content-center flex-wrap">
              {orderDetails && orderDetails.length > 0 ? (
                orderDetails.map((order) => {
                  return (
                    <div className="m-3">
                      <Link to={`/products/${order._id}`}>
                        <div
                          className="order-container shadow d-flex justify-content-between flex-column "
                          key={order._id}
                        >
                          <div className="p-2">
                            <img src={order.image} alt="" />
                          </div>
                          <h5 className="text-center color-black">
                            {order.name}
                          </h5>
                        </div>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="p-2 d-flex justify-content-center flex-column align-items-center">
                  <MdOutlineSearch size={100} />
                  <h2>No Orders Yet !</h2>{" "}
                  <Link to="/products" className="py-5">
                    <div className="buy-now-button w-100">Order Now</div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div>
          <div className="d-flex justify-content-center pt-5 flex-column align-items-center ">
            <MdNoAccounts size={100} />
            <h2>Not Logged In </h2>
            <Link to="/user/login" className="py-5">
              <div className="buy-now-button w-100">Sign In</div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
