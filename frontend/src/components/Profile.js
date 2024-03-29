import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdNoAccounts, MdOutlineAccountCircle, MdOutlineSearch } from "react-icons/md";
import { useSelector } from "react-redux";
import Header from "../partials/Header";

const Profile = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await fetch("/api/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          // Filter orders for the currently logged-in user
          const filteredOrders = data.orders.filter(order => order.user === user._id);
          setUserOrders(filteredOrders);
          console.log('filtered order for profile', filteredOrders)
        } else {
          console.error("Error fetching user orders");
        }
      } catch (error) {
        console.error("Error fetching user orders", error);
      }
    };

    if (isAuthenticated) {
      fetchUserOrders();
    }
  }, [isAuthenticated, user._id]);

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
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date & Time</th>
                  <th>Product Name</th>
                  <th>Product Price</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  
                </tr>
              </thead>
              <tbody>
                {userOrders.map(order => (
                  order.orderItems.map(item => (
                    <tr key={order._id + item._id}>
                      <td>{order._id}</td>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                      <td>{item.name}</td>
                      <td>Rs.{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>{order.orderStatus}</td>
                      
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
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
