import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import '../../Styles/Admin.css'
import AdminNavBar from '../../components/AdminNavBar'
import AdminSideBar from '../../components/AdminSideBar'
import { Route } from 'react-router-dom'

const Reports = () => {
  const [deliveryData, setDeliveryData] = useState([])
  const [earningsData, setEarningsData] = useState([])
  const [statusData, setStatusData] = useState([])
  const [loading, setLoading] = useState(true)

  const COLORS = ['#1e40af', '#f97316', '#10b981', '#8b5cf6', '#ef4444']

  useEffect(() => {
    fetchReportsData()
  }, [])

  const fetchReportsData = async () => {
    try {
      const { data: shipments } = await axios.get('/reports/shipments')

      if (shipments) {
        processDeliveryData(shipments)
        processEarningsData(shipments)
        processStatusData(shipments)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const processDeliveryData = (shipments) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split('T')[0]
    })

    const data = last7Days.map((date) => {
      const delivered = shipments.filter(
        (s) => s.delivery_date?.startsWith(date) && s.status === 'delivered'
      ).length

      const cancelled = shipments.filter(
        (s) => s.created_at.startsWith(date) && s.status === 'cancelled'
      ).length

      return {
        date: new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        delivered,
        cancelled,
      }
    })

    setDeliveryData(data)
  }

  const processEarningsData = (shipments) => {
    const monthlyEarnings = {}

    shipments
      .filter((s) => s.status === 'delivered')
      .forEach((shipment) => {
        const month = new Date(shipment.delivery_date || shipment.created_at).toLocaleDateString(
          'en-US',
          { month: 'short' }
        )

        monthlyEarnings[month] = (monthlyEarnings[month] || 0) + Number(shipment.price)
      })

    const data = Object.entries(monthlyEarnings).map(([month, earnings]) => ({
      month,
      earnings,
    }))

    setEarningsData(data)
  }

  const processStatusData = (shipments) => {
    const statusCount = {}

    shipments.forEach((shipment) => {
      statusCount[shipment.status] = (statusCount[shipment.status] || 0) + 1
    })

    const data = Object.entries(statusCount).map(([name, value]) => ({
      name: name.replace('_', ' ').toUpperCase(),
      value,
    }))

    setStatusData(data)
  }

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '400px' }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-layout d-flex">
      <AdminSideBar />

      <div className="main-content p-4">
        <AdminNavBar />
        <h2 className="mb-4">Reports & Analytics</h2>

        <div className="row">
          {/*Daily Deliveries */}
          <div className="col-lg-8 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Daily Deliveries (Last 7 Days)</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={deliveryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="delivered" fill="#1e40af" name="Delivered" />
                    <Bar dataKey="cancelled" fill="#f97316" name="Cancelled" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/*Shipment Status */}
          <div className="col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Shipment Status Distribution</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/*Monthly Earnings */}
          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Monthly Earnings</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#f97316"
                      strokeWidth={3}
                      name="Earnings ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
