import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { LogIn } from 'lucide-react';

import { setUser } from '../Store/Slices/authSlice';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');

const handleSubmit = async (values, { setSubmitting }) => {
  try {
    setError('');

    const res = await axios.post(
      "http://localhost:5001/auth/login",
      {
        email: values.email,
        password: values.password,
      }
    );

    const { user, token } = res.data;

    // SAVE TOKEN HERE
    localStorage.setItem("token", token);

    // Save to Redux
    dispatch(setUser(user));

    // Redirect based on role
    if (user.role === "admin") navigate("/admin/dashboard");
    else if (user.role === "driver") navigate("/driver/dashboard");
    else navigate("/customer/dashboard");

  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Failed to login. Please try again."
    );
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <LogIn size={48} color="#2563EB" style={{ margin: '0 auto' }} />
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {error && (
          <div className="alert-custom alert-error">
            {error}
          </div>
        )}

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className={`form-control-custom ${errors.email && touched.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && touched.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className={`form-control-custom ${errors.password && touched.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                />
                {errors.password && touched.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary-custom"
                style={{ width: '100%', marginTop: '12px' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link to="/register" className="link-primary">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
