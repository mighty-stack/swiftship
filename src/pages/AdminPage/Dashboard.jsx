import { useEffect, useState } from 'react'
import { Package, Users, Truck, CheckCircle } from 'lucide-react'
import axios from 'axios'
import '../../Styles/Admin.css'
import AdminNavBar from '../../components/AdminNavBar'
import AdminSideBar from '../../components/AdminSideBar'
import { Route } from 'react-router-dom'

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeShipments: 0,
    driversOnline: 0,
    completedOrders: 0,
    totalUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [shipmentsRes, driversRes, completedRes, usersRes] = await Promise.all([
        axios.get('/admin/stats/active-shipments'),
        axios.get('/admin/stats/drivers-online'),
        axios.get('/admin/stats/completed-shipments'),
        axios.get('/admin/stats/total-users'),
      ])

      setStats({
        activeShipments: shipmentsRes.data.count,
        driversOnline: driversRes.data.count,
        completedOrders: completedRes.data.count,
        totalUsers: usersRes.data.count,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      title: 'Active Shipments',
      value: stats.activeShipments,
      icon: Package,
      color: 'primary',
    },
    {
      title: 'Drivers Online',
      value: stats.driversOnline,
      icon: Truck,
      color: 'success',
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders,
      icon: CheckCircle,
      color: 'info',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'warning',
    },
  ]

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
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
        <h2 className="mb-4">Dashboard</h2>

        <div className="container-fluid">
          <div className="row">
            {cards.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.title} className="col-md-6 col-lg-3 mb-4">
                  <div className={`card dashboard-card dashboard-card-${card.color}`}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="card-subtitle mb-2">{card.title}</p>
                          <h3 className="card-title mb-0">{card.value}</h3>
                        </div>
                        <div className={`dashboard-icon dashboard-icon-${card.color}`}>
                          <Icon size={32} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
