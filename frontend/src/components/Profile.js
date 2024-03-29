import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdNoAccounts, MdOutlineAccountCircle, MdOutlineSearch } from "react-icons/md";
import { useSelector } from "react-redux";
import Header from "../partials/Header";

const Profile = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [orderDetails, setOrderDetails] = useState([]); // Order details state

  useEffect(() => {
    // Fetch user's orders from backend when component mounts
    const fetchUserOrders = async () => {
      try {
        // Make API call to fetch user's orders
        const response = await fetch("/api/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials to send cookies
        });
        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data.orders); // Set order details state with fetched data
        } else {
          console.error("Error fetching user orders");
        }
      } catch (error) {
        console.error("Error fetching user orders", error);
      }
    };

    // Call fetchUserOrders function when component mounts
    fetchUserOrders();
  }, []); // Empty dependency array ensures useEffect runs only once after component mounts

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div>
      {isAuthenticated ? (
        <>
          <Header />
          <div className="container">
            <h1 className="my-4">Account</h1>
            <div className="card mb-4">
              <div className="card-body d-flex align-items-center">
                <MdOutlineAccountCircle size={70} className="user-info-img me-4" />
                <div>
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <h2 className="my-4">Your Orders</h2>
            <div className="row">
              {orderDetails && orderDetails.length > 0 ? (
                orderDetails.map((order) => {
                  return (
                    <div className="col-md-3 mb-4" key={order._id}>
                      <Link to={`/products/${order._id}`} className="text-decoration-none">
                        <div className="card">
                          <img src={order.image} className="card-img-top" alt={order.name} />
                          <div className="card-body">
                            <h5 className="card-title">{order.name}</h5>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="col-md-12 text-center">
                  <MdOutlineSearch size={70} />
                  <h2 className="mt-4">No Orders Yet!</h2>
                  <Link to="/products" className="btn btn-primary mt-4">Order Now</Link>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="container">
          <div className="d-flex justify-content-center align-items-center vh-100">
            <MdNoAccounts size={100} />
            <div>
              <h2 className="mt-4">Not Logged In</h2>
              <Link to="/user/login" className="btn btn-primary mt-4">Sign In</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
