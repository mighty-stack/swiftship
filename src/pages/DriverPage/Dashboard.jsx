import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../../components/MainLayout"
import { useAppDispatch, useAppSelector } from "../../Store/Hooks"
import { fetchJobs } from "../../Store/Slices/jobsSlice"
import { Package, TrendingUp, CheckCircle } from "lucide-react"
import "./Driver.css"

const Dashboard = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { jobs, loading } = useAppSelector((state) => state.jobs)
  const [activeTab, setActiveTab] = useState("assigned")

  useEffect(() => {
    dispatch(fetchJobs())  
  }, [dispatch])

  // FILTER JOBS
  const assignedJobs = jobs.filter((job) => job.status === "assigned")
  const currentJobs = jobs.filter((job) =>
    ["accepted", "in_progress"].includes(job.status)
  )
  const completedJobs = jobs.filter((job) => job.status === "delivered")

  // TABLE VIEW
  const renderJobsTable = (jobsList) => (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Pickup</th>
            <th>Delivery</th>
            <th>Package</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {jobsList.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center">
                No jobs found
              </td>
            </tr>
          ) : (
            jobsList.map((job) => (
              <tr key={job._id}>
                <td>#{job._id.slice(0, 8)}</td>

                <td>{job.pickup_address}</td>
                <td>{job.delivery_address}</td>
                <td>{job.package_description}</td>

                <td>₦{job.payment_amount?.toLocaleString()}</td>

                <td>
                  <span
                    className={`badge badge-${
                      job.status === "delivered"
                        ? "success"
                        : job.status === "in_progress"
                        ? "info"
                        : job.status === "accepted"
                        ? "warning"
                        : "secondary"
                    }`}
                  >
                    {job.status.replace("_", " ")}
                  </span>
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => navigate(`/jobs/${job._id}`)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )

  // LOADING
  if (loading) {
    return (
      <MainLayout>
        <div className="container-fluid py-4 text-center">Loading...</div>
      </MainLayout>
    )
  }

  // MAIN VIEW
  return (
    <MainLayout>
      <div className="container-fluid py-4">
        <h2 className="page-title">Dashboard</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon assigned">
              <Package size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Assigned Jobs</div>
              <div className="stat-value">{assignedJobs.length}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon current">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Current Jobs</div>
              <div className="stat-value">{currentJobs.length}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Completed</div>
              <div className="stat-value">{completedJobs.length}</div>
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-header">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "assigned" ? "active" : ""}`}
                onClick={() => setActiveTab("assigned")}
              >
                Assigned Jobs ({assignedJobs.length})
              </button>

              <button
                className={`tab ${activeTab === "current" ? "active" : ""}`}
                onClick={() => setActiveTab("current")}
              >
                Current Jobs ({currentJobs.length})
              </button>

              <button
                className={`tab ${activeTab === "completed" ? "active" : ""}`}
                onClick={() => setActiveTab("completed")}
              >
                Completed Jobs ({completedJobs.length})
              </button>
            </div>
          </div>

          <div className="card-body">
            {activeTab === "assigned" && renderJobsTable(assignedJobs)}
            {activeTab === "current" && renderJobsTable(currentJobs)}
            {activeTab === "completed" && renderJobsTable(completedJobs)}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Dashboard
