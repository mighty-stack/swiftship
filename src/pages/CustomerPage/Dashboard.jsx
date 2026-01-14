import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { Package, Clock, CheckCircle } from "lucide-react";
import Navbar from "../../components/Navbar";


const Dashboard = () => {
  const [customer, setCustomer] = useState({ firstname: "Customer" });
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");

    // Redirect to login if token missing
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        "http://localhost:5001/customer/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCustomer(response.data.customer);
      setShipments(response.data.shipments);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);

      if (err.response) {
        // Handle specific backend errors
        if (err.response.status === 401 || err.response.status === 403) {
          // Token invalid/expired or role denied
          localStorage.removeItem("token"); // clear invalid token
          navigate("/login"); // redirect to login
        } else {
          setError(err.response.data.message || "Unable to load dashboard data");
        }
      } else {
        setError("Network error, please try again");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "badge-pending";
      case "in-transit":
        return "badge-in-transit";
      case "delivered":
        return "badge-delivered";
      case "cancelled":
        return "badge-cancelled";
      default:
        return "badge-pending";
    }
  };

  const stats = [
    {
      title: "Total Shipments",
      value: shipments.length,
      icon: <Package size={32} />,
      color: "#2563EB",
    },
    {
      title: "In Transit",
      value: shipments.filter((s) => s.status === "in-transit").length,
      icon: <Clock size={32} />,
      color: "#38BDF8",
    },
    {
      title: "Delivered",
      value: shipments.filter((s) => s.status === "delivered").length,
      icon: <CheckCircle size={32} />,
      color: "#10B981",
    },
  ];

  if (loading) return <div className="page-container"><LoadingSpinner /></div>;
  if (error) return <div className="page-container"><ErrorMessage message={error} /></div>;

  return (
    <div className="page-container">
      <Navbar />
      <div className="dashboard-header">
        <div className="container">
          <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>
            Welcome back, {customer.firstname }!
          </h1>
          <p style={{ fontSize: "16px", opacity: 0.9 }}>
            Track and manage your shipments from one place.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="row" style={{ marginBottom: "32px", marginTop: "16px" }}>
          {stats.map((stat, index) => (
            <div key={index} className="col-md-4 col-sm-6" style={{ marginBottom: "20px" }}>
              <div className="card-white" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px" }}>
                <div style={{ color: stat.color }}>{stat.icon}</div>
                <div>
                  <div style={{ fontSize: "28px", fontWeight: "700", color: stat.color }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "14px", color: "#6B7280" }}>
                    {stat.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Recent Shipments</h2>
          <Link to="/customer/book-shipment">
            <button className="btn-secondary-custom">Book New Shipment</button>
          </Link>
        </div>

        {shipments.length === 0 ? (
          <div className="card-white" style={{ textAlign: "center", padding: "48px" }}>
            <Package size={64} color="#E5E7EB" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ color: "#6B7280", marginBottom: "8px" }}>No Shipments Found</h3>
            <p style={{ color: "#9CA3AF", marginBottom: "24px" }}>You don't have any shipments at the moment</p>
            <Link to="/customer/book-shipment">
              <button className="btn-primary-custom">Book Your First Shipment</button>
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Pickup</th>
                  <th>Delivery</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: "600", color: "#2563EB" }}>{s.tracking_id}</td>
                    <td>{s.pickup_address}</td>
                    <td>{s.delivery_address}</td>
                    <td><span className={`badge-status ${getStatusBadgeClass(s.status)}`}>{s.status}</span></td>
                    <td>{new Date(s.created_at).toLocaleDateString()}</td>
                    <td><Link to={`/tracking/${s._id}`} className="link-primary">Track</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
