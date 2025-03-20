import React, { useEffect, useState } from "react";
import {Modal, Button, Form} from "react-bootstrap";
import { db, auth } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, addDoc, updateDoc, doc } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
const AdminPage = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", deleteUrl:"",description: "" ,imageUrl: "",stock: "" }); 
  const [editProductData, setEditProductData] = useState({ name: "", price: "", description: "" ,stock: "" });
  const [show,setShow] = useState(false);
  const handleClose = () => setShow(false);
  useEffect(() => {
    fetchData_user();
    fetchData_order();
    fetchData_product();
  }, []);
  const fetchData_user = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const fetchData_order=async()=>{
    try {
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      setOrders(ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); 
    } catch (error) {
      console.error("Error fetching orders data:", error);
    }
  }
  const fetchData_product=async()=>{
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      setProducts(productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), price: Number(doc.data().price) ,stock: Number(doc.data().stock),description: doc.data().description,imageUrl: doc.data().imageUrl,deleteUrl: doc.data().deleteUrl})));  
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }
  const updateOrderStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
    fetchData_order();
  };

  const deleteUser = async (userId) => {
    await deleteDoc(doc(db, "users", userId));
    fetchData_user();
  };
  const addProduct = async () => {
    await addDoc(collection(db, "products"), newProduct);
    setNewProduct({ name: "", price: "", description: "" ,imageUrl: "",deleteUrl:"",stock: "" });
    fetchData_product();
  };

//Sony Bravia XR OLED A95K	Televisions	$2499	10 Sony’s 65-inch 4K OLED TV with Cognitive Processor XR, Dolby Vision, XR Motion Clarity, and Acoustic Surface Audio+. Perfect for gaming with HDMI 2.1, 120Hz refresh rate, and VRR support
  const editProduct = (product) => {
    setEditProductData(product||{ name: "", price: "", description: "" }); // Set the selected product data
    setShow(true); // Open the edit form
};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProductData((prev) => ({ ...prev, [name]: value }));
};
const updateProduct = async () => {
  try {
      const productRef = doc(db, "products", editProductData.id);
      await updateDoc(productRef, {
          name: editProductData.name,
          price: Number(editProductData.price),
          description: editProductData.description,
          imageUrl: editProductData.imageUrl,
          stock: Number(editProductData.stock)
      });
      setShow(false); // Close the edit form
      fetchData_product(); // Refresh product list
  } catch (error) {
      console.error("Error updating product:", error);
  }
};

  const deleteProduct = async (productId,DeleteUrl) => {
    await deleteDoc(doc(db, "products", productId));
    deleteImage(DeleteUrl);
    fetchData_product();
  };
  const deleteImage = async (deleteUrl) => {
    try {
      console.log(deleteUrl);
        const response = await fetch(deleteUrl, { method: "DELETE" });

        if (response.ok) {
            console.log("Image deleted successfully");
        } else {
            console.error("Failed to delete image");
        }
    } catch (error) {
        console.error("Error deleting image:", error);
    }
};


  const handleLogout = async () => {
    const navigate = useNavigate();
    await auth.signOut();
    navigate("/");
  };


const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append("image", file);
  formData.append("key", "b3d6b9691d9b30ce26c378c31c67a928");
  try {
    const response = await axios.post("https://api.imgbb.com/1/upload", formData);
    setNewProduct({ ...newProduct, imageUrl: response.data.data.url ,deleteUrl: response.data.data.delete_url });
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};
const deleteOrder = async (orderId) => {
  if (!window.confirm("Are you sure you want to delete this order?")) return;
  try {
    await deleteDoc(doc(db, "orders", orderId));
    fetchData_order();
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};


  const orderStatusData = [
    { name: "Processing", value: orders.filter(o => o.status === "Processing").length },
    { name: "Shipped", value: orders.filter(o => o.status === "Shipped").length },
    { name: "Delivered", value: orders.filter(o => o.status === "Delivered").length },
  ];

  const COLORS = ["#FFBB28", "#FF8042", "#0088FE"];

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h2>Admin Panel</h2>
        <button onClick={handleLogout} className="btn btn-danger w-100 mb-3">Logout</button>
        <div onClick={() => setSelectedTab("dashboard")} className="p-2" style={{ cursor: "pointer" }}>📊 Dashboard</div>
        <div onClick={() => setSelectedTab("users")} className="p-2" style={{ cursor: "pointer" }}>👥 Users</div>
        <div onClick={() => setSelectedTab("orders")} className="p-2" style={{ cursor: "pointer" }}>📦 Orders</div>
        <div onClick={() => setSelectedTab("products")} className="p-2" style={{ cursor: "pointer" }}>🛒 Products</div>
      </div>

      {/* Main Content */}
      <div className="p-4 flex-grow-1">
        <button onClick={fetchData_order} className="btn btn-primary mb-3">🔄 Refresh Data</button>

        {/* Dashboard */}
        {selectedTab === "dashboard" && (
          <div>
            <h2>📊 Analytics Dashboard</h2>
            <h4>Total Orders: {orders.length}</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orders.map((_, i) => ({ day: `Day ${i + 1}`, count: i + 1 }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Users Table */}
        {selectedTab === "users" && (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    console.log(user),
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.fullName || "No Name"}</td>
                      <td>{user.email || "No Email"}</td>
                      <td>{user.role}</td>
                      <td><button onClick={() => deleteUser(user.id)} className="btn btn-danger btn-sm">Delete</button></td>
                    </tr>
                  ))
                ) : <tr><td colSpan="4">No users found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Table */}
        {selectedTab === "orders" && (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr><th>Order ID</th><th>Product</th><th>Buyer</th><th>Status</th></tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order?.items?.map((item, index) => (
                          <p key={index}>{item.name}</p>
                          ))}
                      </td>
                      <td>{order?.customer?.name || "Unknown Buyer"}</td>
                      <td>
                        <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td>
          <button onClick={() => deleteOrder(order.id)} className="btn btn-danger btn-sm">
            🗑️ Delete
          </button>
        </td>
                    </tr>
                  ))
                ) : <tr><td colSpan="4">No orders found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* Products Table */}
        {selectedTab === "products" && (
  <>
    <h2>🛒 Manage Products</h2>
    <h4>📦 Total Products: {products.length}</h4>
    <div className="mb-3">
      <h4>Add New Product</h4>
      <input type="text" className="form-control mb-2" placeholder="Product Name" value={newProduct.name||""} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
      <input type="number" className="form-control mb-2" placeholder="Price" value={newProduct.price||0} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
      <input type="text" className="form-control mb-2" placeholder="Category" value={newProduct.category||""} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
      <textarea className="form-control mb-2" placeholder="Description" value={newProduct.description||""} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}></textarea>
      <input type="file" className="form-control mb-2" onChange={handleImageUpload} />
      <input type="number" className="form-control mb-2" placeholder="Stock Quantity" value={newProduct.stock||1} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
      <button onClick={addProduct} className="btn btn-success">➕ Add Product</button>
    </div>
    <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editProductData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={editProductData.price}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={editProductData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={editProductData.stock}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={updateProduct}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    
    <h4>📋 Product List</h4>
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            {console.log(product)}
            {console.log(product.imageUrl)}
            <td><img src={product.imageUrl} alt={product.name} width="150" height="150" /></td>
            <td>{product.name}</td>
            <td>{product.category}</td>
            <td>${product.price}</td>
            <td>{product.stock}</td>
            <td>
              <button onClick={() => editProduct(product)} className="btn btn-warning btn-sm">✏️ Edit</button>
              <button onClick={() => deleteProduct(product.id,product.deleteUrl)} className="btn btn-danger btn-sm ms-2">🗑️ Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
)
}
      </div>
    </div>
  );
};

export default AdminPage;
