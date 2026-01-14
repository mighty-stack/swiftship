import { LayoutDashboard, Users, Package, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

const AdminSidebar = ({ activePage, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, link: '/admin/dashboard' },
    { id: 'users', label: 'User Management', icon: Users, link: '/admin/users' },
    { id: 'shipments', label: 'Shipments', icon: Package, link: '/admin/shipments' },
    { id: 'reports', label: 'Reports', icon: BarChart3, link: '/admin/reports' },
  ]

  return (
    <div className="sidebar">
      <ul className="nav flex-column">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.id} className="nav-item">
              <Link
                to={item.link}
                className={`nav-link ${activePage === item.id ? 'active' : ''}`}
              >
                <Icon size={20} className="me-2" />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default AdminSidebar
