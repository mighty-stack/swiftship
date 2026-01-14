import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { UserPlus } from "lucide-react";

const RegisterSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  phone: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Invalid phone number")
    .required("Phone number is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
  role: Yup.string().required("Please select a role"),
});

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("");
      setSuccess("");

      const res = await axios.post("http://localhost:5001/auth/register", {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: values.role,
      });

      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <UserPlus size={48} color="#2563EB" style={{ margin: "0 auto" }} />
        </div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join our logistics platform today</p>

        {error && <div className="alert-custom alert-error">{error}</div>}
        {success && <div className="alert-custom alert-success">{success}</div>}

        <Formik
          initialValues={{
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            role: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <Field
                  type="text"
                  name="fullName"
                  className={`form-control-custom ${
                    errors.fullName && touched.fullName ? "error" : ""
                  }`}
                />
                {errors.fullName && touched.fullName && (
                  <span className="error-message">{errors.fullName}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <Field
                  type="email"
                  name="email"
                  className={`form-control-custom ${
                    errors.email && touched.email ? "error" : ""
                  }`}
                />
                {errors.email && touched.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <Field
                  type="tel"
                  name="phone"
                  className={`form-control-custom ${
                    errors.phone && touched.phone ? "error" : ""
                  }`}
                />
                {errors.phone && touched.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <Field
                  type="password"
                  name="password"
                  className={`form-control-custom ${
                    errors.password && touched.password ? "error" : ""
                  }`}
                />
                {errors.password && touched.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className={`form-control-custom ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "error"
                      : ""
                  }`}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <span className="error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="role" className="form-label">
                  Register As
                </label>

                <Field
                  as="select"
                  name="role"
                  id="role"
                  className={`form-control-custom ${
                    errors.role && touched.role ? "error" : ""
                  }`}
                >
                  <option value="">Select role</option>
                  <option value="customer">Customer</option>
                  <option value="driver">Driver</option>
                </Field>

                {errors.role && touched.role && (
                  <span className="error-message">{errors.role}</span>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary-custom"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </Form>
          )}
        </Formik>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p>
            Already have an account?{" "}
            <Link to="/login" className="link-primary">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
