import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Header from "./partials/AdminHeader";
import Left from "./partials/Left";
import "./OrderDash.css"; // Import CSS file for styling

function OrderDash() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statuses, setStatuses] = useState({}); // State to hold statuses for each order
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch orders from backend API
        const fetchOrders = async () => {
            try {
                const orderResponse = await fetch("/api/admin/order");
                if (orderResponse.ok) {
                    const orderData = await orderResponse.json();
                    setOrders(orderData.orders);

                    // Fetch user data
                    const userIds = orderData.orders.map(order => order.user._id);
                    const userResponse = await fetch(`/api/users?id=${userIds.join(',')}`);
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        setUsers(userData.users);
                    } else {
                        console.error("Error fetching user data");
                    }

                    // Initialize statuses state with default status for each order
                    const initialStatuses = {};
                    orderData.orders.forEach(order => {
                        initialStatuses[order._id] = "";
                    });
                    setStatuses(initialStatuses);
                } else {
                    console.error("Error fetching orders");
                }
            } catch (error) {
                console.error("Error fetching orders", error);
            }
        };
        fetchOrders();
    }, []);



    const openPopup = (order) => {
        setSelectedOrder(order);
    };

    const closePopup = () => {
        setSelectedOrder(null);
    };

    // Function to handle status change for a specific order
    const handleStatusChange = async (orderId) => {
        const newStatus = statuses[orderId];
        try {
            // Send a request to update order status
            const response = await fetch(`/api/admin/order/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }), // Send new status in the request body
            });
            console.log('new status change send on api', response)
            if (response.ok) {
                // If status update is successful, fetch updated orders
                const data = await response.json();
                setOrders(data.orders);
                // Clear status for the updated order
                setStatuses(prevStatuses => ({
                    ...prevStatuses,
                    [orderId]: ""
                }));
            } else {
                console.error("Error updating order status");
            }
        } catch (error) {
            console.error("Error updating order status", error);
        }
    };

    return (
        <>
            <Header />
            <section className="dash">
                <div className="container-fluid">
                    <div className="row">
                        <Left />
                        <div className="col-md-8">
                            <h1>Order Dashboard</h1>
                            <div>
                                <h2>Order List</h2>
                                <table className="table table-dark table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>S No.</th>
                                            <th>Customer Name</th>
                                            <th>Total Price</th>
                                            <th>Shipping Address</th>
                                            <th>Phone No.</th>
                                            <th>Current Status</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order, index) => (
                                            <tr key={order._id}>
                                                <td>{index + 1}</td>
                                                <td>{order.user.name}</td>
                                                <td>{order.totalPrice}</td>
                                                <td>
                                                    <p>{order.shippingInfo.address} {order.shippingInfo.city} {order.shippingInfo.state} {order.shippingInfo.pincode}</p>
                                                </td>
                                                <td>{order.shippingInfo.phoneNo}</td>
                                                <td>{order.orderStatus}</td>
                                                <td>
                                                    {/* Dropdown menu to select new status */}
                                                    <div className="input-group input-group-sm d-flex">
                                                    <select className="form-select form-select-sm" value={statuses[order._id]} onChange={(e) => setStatuses({...statuses, [order._id]: e.target.value})} disabled={order.orderStatus === "Delivered"}>
                                                            <option value="">Select Status</option>
                                                            <option value="Processing">Processing</option>
                                                            <option value="Order Accepted">Order Accepted</option>
                                                            <option value="In Progress">In Progress</option>
                                                            <option value="Out for Delivery">Out for Delivery</option>
                                                            <option value="Delivered">Delivered</option>
                                                        </select>
                                                        {/* Button to update status */}
                                                        <button onClick={() => handleStatusChange(order._id)} className="btn btn-success btn-sm">Update</button>
                                                    </div>
                                                </td>


                                                <td>
                                                    <button onClick={() => openPopup(order)} className="btn btn-warning btn-sm">Details</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {selectedOrder && (
                <div className="popup">
                    <div className="popup-content fullscreen">
                        <span className="close" onClick={closePopup}>&times;</span>
                        <h2>Order Details</h2>

                        <p><strong>Customer Name:</strong> {selectedOrder.user.name} <strong>User Email:</strong> {selectedOrder.user.email}</p>

                        <p><strong>Address:</strong> {selectedOrder.shippingInfo.address}, {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state}, {selectedOrder.shippingInfo.pincode}   <strong>Phone No.:</strong> {selectedOrder.shippingInfo.phoneNo}</p>
                        <h3>Ordered Items</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.orderItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td><img src={item.image} alt={item.name} style={{ width: "50px" }} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h3>Payment Information</h3>
                        <p><strong>Payment ID:</strong> {selectedOrder.paymentInfo.id}</p>
                        <p><strong>Status:</strong> {selectedOrder.paymentInfo.status}</p>
                        <p><strong>Mode:</strong> {selectedOrder.paymentInfo.mode}</p>
                        <p><strong>Total Price:</strong> {selectedOrder.paymentInfo.totalPrice}</p>
                        <h3>Order Information</h3>
                        <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
                        <p><strong>Created At:</strong> {selectedOrder.createdAt}</p>


                    </div>
                </div>
            )}
        </>
    );
}

export default OrderDash;
