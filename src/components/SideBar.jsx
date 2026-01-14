import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, DollarSign, User, LogOut, Truck } from 'lucide-react'
import { useAppDispatch } from '../Store/Hooks'
import { signOut } from '../Store/Slices/authSlice'
import Button from './Button'

const Sidebar = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(signOut())
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Truck size={32} />
        <h3>Driver Portal</h3>
      </div>
      <nav className="sidebar-nav">
        <Link to="/driver/dashboard" className={`sidebar-link ${isActive('/driver/dashboard') ? 'active' : ''}`}>
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/driver/earnings" className={`sidebar-link ${isActive('/driver/earnings') ? 'active' : ''}`}>
          <DollarSign size={20} />
          <span>Earnings</span>
        </Link>
        <Link to="/driver/profile" className={`sidebar-link ${isActive('/driver/profile') ? 'active' : ''}`}>
          <User size={20} />
          <span>Profile</span>
        </Link>

        <Link to="/driver/jobs/:jobId" className={`sidebar-link ${isActive('/driver/jobs/:jobId') ? 'active' : ''}`}>
          <Truck size={20} />
          <span>Jobs</span>
        </Link>

      </nav>
      <Button onClick={handleLogout} className="sidebar-logout">
        <LogOut size={20} />
        <span>Logout</span>
      </Button>
    </div>
  )
}

export default Sidebar
