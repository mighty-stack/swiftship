import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import MainLayout from "../../components/MainLayout"
import { useAppDispatch, useAppSelector } from "../../Store/Hooks"
import {
  fetchJobById,
  acceptJob,
  startJob,
  completeJob,
} from "../../Store/Slices/jobsSlice"
import {
  MapPin,
  Package,
  User,
  Phone,
  Clock,
  DollarSign,
  Weight,
} from "lucide-react"

const JobDetails = () => {
  const { jobId } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { currentJob } = useAppSelector((state) => state.jobs)

  const [actionLoading, setActionLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (jobId) dispatch(fetchJobById(jobId))
  }, [dispatch, jobId])

  const handleAction = async (action) => {
    if (!jobId) return

    setActionLoading(true)
    setAlert(null)

    try {
      if (action === "accept") {
        await dispatch(acceptJob(jobId)).unwrap()
        setAlert({ type: "success", message: "Job accepted successfully!" })
      } else if (action === "start") {
        await dispatch(startJob(jobId)).unwrap()
        setAlert({ type: "success", message: "Job started successfully!" })
      } else if (action === "complete") {
        await dispatch(completeJob(jobId)).unwrap()
        setAlert({
          type: "success",
          message: "Job completed! Payment added to earnings.",
        })
        setTimeout(() => navigate("/dashboard"), 2000)
      }
    } catch (error) {
      setAlert({ type: "error", message: error.message || "Action failed" })
    } finally {
      setActionLoading(false)
    }
  }

  if (!currentJob) {
    return (
      <MainLayout>
        <div className="container-fluid py-4">
          <div className="text-center">Loading job details...</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container-fluid py-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="page-title">Job Details</h2>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>

        {alert && (
          <div
            className={`alert alert-${
              alert.type === "success"
                ? "success"
                : alert.type === "error"
                ? "danger"
                : "info"
            }`}
          >
            {alert.message}
          </div>
        )}

        <div className="row">

          {/* ==== MAIN SHIPMENT DETAILS ==== */}
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header"><h5>Shipment Information</h5></div>

              <div className="card-body">
                {/* Pickup */}
                <div className="job-detail-section">
                  <h6 className="detail-title">
                    <MapPin size={18} /> Pickup Location
                  </h6>
                  <p className="detail-value">{currentJob.pickupAddress}</p>

                  <div className="detail-row">
                    <div><User size={16} /> {currentJob.pickupContact}</div>
                    <div><Phone size={16} /> {currentJob.pickupPhone}</div>
                  </div>

                  {currentJob.pickupTime && (
                    <div className="detail-row">
                      <Clock size={16} /> Scheduled:{" "}
                      {new Date(currentJob.pickupTime).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Delivery */}
                <div className="job-detail-section">
                  <h6 className="detail-title">
                    <MapPin size={18} /> Delivery Location
                  </h6>
                  <p className="detail-value">{currentJob.deliveryAddress}</p>

                  <div className="detail-row">
                    <div><User size={16} /> {currentJob.deliveryContact}</div>
                    <div><Phone size={16} /> {currentJob.deliveryPhone}</div>
                  </div>

                  {currentJob.deliveryTime && (
                    <div className="detail-row">
                      <Clock size={16} /> Expected:{" "}
                      {new Date(currentJob.deliveryTime).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Package details */}
                <div className="job-detail-section">
                  <h6 className="detail-title">
                    <Package size={18} /> Package Details
                  </h6>
                  <p className="detail-value">{currentJob.packageDescription}</p>

                  {currentJob.weight && (
                    <div className="detail-row">
                      <Weight size={16} /> Weight: {currentJob.weight} kg
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* ==== JOB STATUS + ACTIONS ==== */}
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-header"><h5>Job Status</h5></div>

              <div className="card-body">

                <div className="status-badge-large">
                  <span
                    className={`badge badge-${
                      currentJob.status === "delivered"
                        ? "success"
                        : currentJob.status === "in_progress"
                        ? "info"
                        : currentJob.status === "accepted"
                        ? "warning"
                        : "secondary"
                    }`}
                  >
                    {currentJob.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                <div className="payment-amount">
                  <DollarSign size={24} />
                  <div>
                    <div className="payment-label">Payment Amount</div>
                    <div className="payment-value">
                      ${currentJob.paymentAmount}
                    </div>
                  </div>
                </div>

                {/* ==== ACTION BUTTONS ==== */}
                <div className="job-actions">

                  {currentJob.status === "assigned" && (
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => handleAction("accept")}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Processing..." : "Accept Job"}
                    </button>
                  )}

                  {currentJob.status === "accepted" && (
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => handleAction("start")}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Processing..." : "Start Delivery"}
                    </button>
                  )}

                  {currentJob.status === "in_progress" && (
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => handleAction("complete")}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Processing..." : "Mark as Delivered"}
                    </button>
                  )}

                  {currentJob.status === "delivered" && (
                    <div className="alert alert-success mb-0">
                      Job completed successfully!
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* ==== TIMELINE ==== */}
            <div className="card">
              <div className="card-header"><h5>Timeline</h5></div>

              <div className="card-body">
                <div className="timeline">

                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-label">Created</div>
                      <div className="timeline-time">
                        {new Date(currentJob.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {currentJob.acceptedAt && (
                    <div className="timeline-item">
                      <div className="timeline-dot active"></div>
                      <div className="timeline-content">
                        <div className="timeline-label">Accepted</div>
                        <div className="timeline-time">
                          {new Date(currentJob.acceptedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentJob.startedAt && (
                    <div className="timeline-item">
                      <div className="timeline-dot active"></div>
                      <div className="timeline-content">
                        <div className="timeline-label">Started</div>
                        <div className="timeline-time">
                          {new Date(currentJob.startedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentJob.deliveredAt && (
                    <div className="timeline-item">
                      <div className="timeline-dot success"></div>
                      <div className="timeline-content">
                        <div className="timeline-label">Delivered</div>
                        <div className="timeline-time">
                          {new Date(currentJob.deliveredAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </MainLayout>
  )
}

export default JobDetails
