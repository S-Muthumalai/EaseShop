// import React, { useEffect, useState } from "react";
// import { db, auth } from "../firebase";
// import { collection, getDocs, deleteDoc, addDoc, updateDoc, doc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,PieChart } from "recharts";

// const AdminPage = () => {
//   const [selectedTab, setSelectedTab] = useState("dashboard");
//   const [users, setUsers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "" });
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const usersSnapshot = await getDocs(collection(db, "users"));
//       setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

//       const ordersSnapshot = await getDocs(collection(db, "orders"));
//       setOrders(ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

//       const productsSnapshot = await getDocs(collection(db, "products"));
//       setProducts(productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), price: Number(doc.data().price) })));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       const orderRef = doc(db, "orders", orderId);
//       await updateDoc(orderRef, { status: newStatus });
//       setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
//     } catch (error) {
//       console.error("Error updating order status:", error);
//     }
//   };

//   const deleteUser = async (userId) => {
//     await deleteDoc(doc(db, "users", userId));
//     setUsers(users.filter(user => user.id !== userId));
//   };

//   const addProduct = async () => {
//     if (!auth.currentUser) {
//       alert("You need to be logged in as an admin to add products.");
//       return;
//     }
  
//     if (!newProduct.name || !newProduct.price || !newProduct.description) {
//       alert("Please fill all product fields");
//       return;
//     }
  
//     try {
//       const productData = { ...newProduct, price: Number(newProduct.price) || 0 };
//       const docRef = await addDoc(collection(db, "products"), productData);
//       setProducts([...products, { id: docRef.id, ...productData }]);
//       setNewProduct({ name: "", price: "", description: "" });
//     } catch (error) {
//       console.error("Error adding product:", error);
//     }
//   };
  
//   const editProduct = async (productId, updatedData) => {
//     try {
//         const productRef = doc(db, "products", productId);
//         await updateDoc(productRef, updatedData);
//         console.log("Product updated successfully!");
//     } catch (error) {
//         console.error("Error updating product:", error);
//     }
// };


//   const deleteProduct = async (productId) => {
//     await deleteDoc(doc(db, "products", productId));
//     setProducts(products.filter(product => product.id !== productId));
//   };

//   const handleLogout = async () => {
//     await auth.signOut();
//     navigate("/login");
//   };
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const objectUrl = URL.createObjectURL(file);
//       setNewProduct({ ...newProduct, imageUrl: objectUrl });
//     }
//   };
  
import React, { useEffect, useState } from "react";
import { db, auth ,storage} from "../firebase";
import { collection, getDocs, deleteDoc, addDoc, updateDoc, doc } from "firebase/firestore";
import {ref,uploadBytes,getDownloadURL} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const AdminPage = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const ordersSnapshot = await getDocs(collection(db, "orders"));
      setOrders(ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const productsSnapshot = await getDocs(collection(db, "products"));
      setProducts(productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), price: Number(doc.data().price) })));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const deleteUser = async (userId) => {
    await deleteDoc(doc(db, "users", userId));
    setUsers(users.filter(user => user.id !== userId));
  };

  const addProduct = async () => {
    if (!auth.currentUser) {
      alert("You need to be logged in as an admin to add products.");
      return;
    }
  
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      alert("Please fill all product fields");
      return;
    }
  
    try {
      const productData = { ...newProduct, price: Number(newProduct.price) || 0 };
      const docRef = await addDoc(collection(db, "products"), productData);
      setProducts([...products, { id: docRef.id, ...productData }]);
      setNewProduct({ name: "", price: "", description: "" });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  
  const editProduct = async (productId, updatedData) => {
    try {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, updatedData);
        console.log("Product updated successfully!");
    } catch (error) {
        console.error("Error updating product:", error);
    }
  };

  const deleteProduct = async (productId) => {
    await deleteDoc(doc(db, "products", productId));
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const storageRef = ref(storage, `product-images/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setNewProduct({ ...newProduct, imageUrl: downloadURL }); // Store the permanent URL
      console.log("Image uploaded successfully:", downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
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
        <button onClick={fetchData} className="btn btn-primary mb-3">🔄 Refresh Data</button>

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
))}</td>
                      <td>{order?.customer?.name || "Unknown Buyer"}</td>
                      <td>
                        <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
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
            <td><img src={product.imageUrl} alt={product.name} width="50" height="50" /></td>
            <td>{product.name}</td>
            <td>{product.category}</td>
            <td>${product.price}</td>
            <td>{product.stock}</td>
            <td>
              <button onClick={() => editProduct(product)} className="btn btn-warning btn-sm">✏️ Edit</button>
              <button onClick={() => deleteProduct(product.id)} className="btn btn-danger btn-sm ms-2">🗑️ Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
)}

      </div>
    </div>
  );
};

export default AdminPage;
