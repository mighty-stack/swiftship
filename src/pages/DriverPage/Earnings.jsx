import { useEffect } from "react"
import MainLayout from "../../components/MainLayout"
import { useAppDispatch, useAppSelector } from "../../Store/Hooks"
import { fetchEarnings } from "../../Store/Slices/earningsSlice"
import { DollarSign, TrendingUp, Clock } from "lucide-react"
import "./Driver.css"

const Earnings = () => {
  const dispatch = useAppDispatch()

  const {
    earnings,
    totalEarnings,
    pendingEarnings,
    loading,
  } = useAppSelector((state) => state.earnings)

  useEffect(() => {
    dispatch(fetchEarnings())
  }, [dispatch])

  if (loading) {
    return (
      <MainLayout>
        <div className="container-fluid py-4">
          <div className="text-center">Loading earnings...</div>
        </div>
      </MainLayout>
    )
  }

  const paidEarnings = totalEarnings - pendingEarnings

  return (
    <MainLayout>
      <div className="container-fluid py-4">
        <h2 className="page-title">Earnings</h2>

        {/* ==== Stats Widgets ==== */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Earnings</div>
              <div className="stat-value">${totalEarnings.toFixed(2)}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon paid">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Paid</div>
              <div className="stat-value">${paidEarnings.toFixed(2)}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Pending</div>
              <div className="stat-value">${pendingEarnings.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* ==== Earnings Table ==== */}
        <div className="card mt-4">
          <div className="card-header">
            <h5>Earnings History</h5>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Job ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Paid Date</th>
                  </tr>
                </thead>

                <tbody>
                  {earnings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center">
                        No earnings yet
                      </td>
                    </tr>
                  ) : (
                    earnings.map((earning) => (
                      <tr key={earning._id}>
                        <td>
                          {new Date(earning.createdAt).toLocaleDateString()}
                        </td>

                        <td>
                          #{earning.jobId?.slice(0, 8) || "N/A"}
                        </td>

                        <td>
                          <span className="badge badge-secondary">
                            {earning.type.replace("_", " ")}
                          </span>
                        </td>

                        <td className="earning-amount">
                          ${Number(earning.amount).toFixed(2)}
                        </td>

                        <td>
                          <span
                            className={`badge badge-${
                              earning.status === "paid"
                                ? "success"
                                : earning.status === "pending"
                                ? "warning"
                                : "info"
                            }`}
                          >
                            {earning.status}
                          </span>
                        </td>

                        <td>
                          {earning.paidAt
                            ? new Date(earning.paidAt).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Earnings
