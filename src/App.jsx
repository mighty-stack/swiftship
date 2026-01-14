import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "./Store/Hooks";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Components
import Login from "./components/Login";
import Register from "./components/Register";

// Home Page
import Home from "./pages/HomePage";

// Customer Pages
import CustomerDashboard from "./pages/CustomerPage/Dashboard";
import BookShipment from "./pages/CustomerPage/BookShipment";
import PaymentUI from "./pages/CustomerPage/PaymentUI";
import Tracking from "./pages/CustomerPage/Tracking";
import CustomerProfile from "./pages/CustomerPage/Profile";

// Driver Pages
import DriverDashboard from "./pages/DriverPage/Dashboard";
import JobDetails from "./pages/DriverPage/JobDetails";
import Earnings from "./pages/DriverPage/Earnings";
import DriverProfile from "./pages/DriverPage/Profile";

// Admin Pages
import AdminDashboard from "./pages/AdminPage/Dashboard";
import ReportPage from "./pages/AdminPage/ReportPage";
import ShipmentManagementPage from "./pages/AdminPage/ShipmentManagementPage";
import UserManagement from "./pages/AdminPage/UserManagementPage";

// -----------------------------
// Protected Route Component
// -----------------------------
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;

  return children;
};

// -----------------------------
// App Component
// -----------------------------
const App = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);


  return (
    <>

      <Routes>

        {/* HOME ROUTE */}
        <Route path="/" element={<Home />} />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DEFAULT LOGICALLY REDIRECT ROOT-LOGINS */}
        <Route
          path="/redirect"
          element={
            user ? (
              user.role === "driver" ? (
                <Navigate to="/driver/dashboard" replace />
              ) : (
                <Navigate to="/customer/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* CUSTOMER ROUTES */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/book-shipment"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
            <BookShipment />
            </ProtectedRoute>
          }
        />

        <Route
         path="/payment-success" 
         element={
         <PaymentUI />
         }
        />


        <Route
          path="/customer/tracking/:id"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
            <Tracking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/profile"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerProfile />
            </ProtectedRoute>
          }
        />

        {/* DRIVER ROUTES */}
        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute allowedRoles={["driver"]}>
            <DriverDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver/jobs/:jobId"
          element={
            <ProtectedRoute allowedRoles={["driver"]}>
            <JobDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver/earnings"
          element={
            <ProtectedRoute allowedRoles={["driver"]}>
            <Earnings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver/profile"
          element={
            <ProtectedRoute allowedRoles={["driver"]}>
            <DriverProfile />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
           </ProtectedRoute>
          }
        />

        <Route
          path="/admin/shipments"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
            <ShipmentManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
            <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
            <ReportPage />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
