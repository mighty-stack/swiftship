import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { User, Mail, Phone, Save } from "lucide-react";
import Navbar from "../../components/Navbar";
// import { setUser } from "../Store/Slices/authSlice";

const ProfileSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Invalid phone number")
    .required("Phone is required"),
  address: Yup.string().min(5, "Address too short"),
  city: Yup.string(),
  state: Yup.string(),
});

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5001/customer/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfileData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("");
      setSuccess("");

      const res = await axios.put(
        "http://localhost:5001/customer/profile",
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfileData(res.data.user);
      dispatch(setUser(res.data.user));

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const initialValues = {
    fullName: profileData?.fullName || "",
    phone: profileData?.phone || "",
    address: profileData?.address || "",
    city: profileData?.city || "",
    state: profileData?.state || "",
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="container">
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h1 className="section-title" style={{ textAlign: "center", marginBottom: "32px", fontSize: "32px" }}>
            My Profile
          </h1>

          <div className="card-white" style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "#2563EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "32px",
                  fontWeight: "700",
                }}
              >
                {initialValues.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: "24px", fontWeight: "600" }}>{initialValues.fullName}</h3>
                <p style={{ color: "#6B7280", fontSize: "14px" }}>
                  <Mail size={14} style={{ marginRight: "4px" }} />
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {error && <div className="alert-custom alert-error">{error}</div>}
          {success && <div className="alert-custom alert-success">{success}</div>}

          <div className="card-white">
            <h3 style={{ color: "#2563EB", fontSize: "20px", marginBottom: "24px" }}>Personal Information</h3>

            <Formik initialValues={initialValues} validationSchema={ProfileSchema} onSubmit={handleSubmit} enableReinitialize>
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} style={{ marginRight: "6px" }} /> Full Name
                    </label>
                    <Field name="fullName" className={`form-control-custom ${errors.fullName && touched.fullName ? "error" : ""}`} />
                    {errors.fullName && touched.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={16} style={{ marginRight: "6px" }} /> Phone
                    </label>
                    <Field name="phone" className={`form-control-custom ${errors.phone && touched.phone ? "error" : ""}`} />
                    {errors.phone && touched.phone && <span className="error-message">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <Field name="address" className="form-control-custom" />
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label">City</label>
                      <Field name="city" className="form-control-custom" />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">State</label>
                      <Field name="state" className="form-control-custom" />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary-custom" style={{ width: "100%", marginTop: "12px" }} disabled={isSubmitting}>
                    <Save size={16} style={{ marginRight: "8px" }} />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          <div className="card-custom">
            <h4 style={{ fontSize: "16px", marginBottom: "12px" }}>Account Details</h4>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
