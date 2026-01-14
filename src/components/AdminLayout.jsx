import { useState } from 'react'
import AdminNavbar from './AdminNavBar'
import AdminSidebar from './AdminSideBar'

import Dashboard from '../pages/Dashboard'
import UserManagement from '../pages/UserManagement'
import Shipments from '../pages/Shipments'
import Reports from '../pages/Reports'

const AdminLayout = () => {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />
      case 'users':
        return <UserManagement />
      case 'shipments':
        return <Shipments />
      case 'reports':
        return <Reports />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="d-flex">
        <AdminSidebar activePage={activePage} onNavigate={setActivePage} />
        <main className="main-content flex-grow-1">
          <div className="container-fluid py-4">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
