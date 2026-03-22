import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../components/axios";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import Navbar from "../../components/Navbar";

  const PaymentUI = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [status, setStatus] = useState("loading")
  const [message, setMessage] = useState("")
  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    const reference = new URLSearchParams(window.location.search).get("reference")

    if (!reference && location.state?.paymentUrl && !redirected) {
      window.location.href = location.state.paymentUrl
      setRedirected(true)
    }
  }, []);

  useEffect(() => {
    const reference = new URLSearchParams(window.location.search).get(
      "reference"
    )


    if (!reference) {
      setStatus("error")
      setMessage("Invalid payment reference")
      return
    }

    const verifyPayment = async () => {
      try {
        const res = await axios.get(
          `/payment/verify/${reference}`
        )

        if (res.data.success) {
          setStatus("success")
          setMessage("Payment successful! Redirecting...")

          setTimeout(() => {
            navigate("/dashboard")
          }, 2000)
        } else {
          setStatus("error")
          setMessage("Payment verification failed")
        }
      } catch (err) {
        setStatus("error")
        setMessage(
          err.response?.data?.message || "Payment verification failed"
        )
      }
    };

    verifyPayment()
  }, [navigate]);

  return (
    <div className="page-container">
      <Navbar />

      <div
        className="card-white"
        style={{
          maxWidth: "500px",
          margin: "80px auto",
          textAlign: "center",
          padding: "48px",
        }}
      >
        {status === "loading" && (
          <>
            <Loader size={48} className="spin" color="#2563EB" />
            <h3 style={{ marginTop: "16px" }}>Verifying payment...</h3>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle size={48} color="#10B981" />
            <h3 style={{ marginTop: "16px", color: "#10B981" }}>
              Payment Successful
            </h3>
            <p>{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle size={48} color="#EF4444" />
            <h3 style={{ marginTop: "16px", color: "#EF4444" }}>
              Payment Failed
            </h3>
            <p>{message}</p>

            <button
              className="btn-primary-custom"
              style={{ marginTop: "16px" }}
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentUI
