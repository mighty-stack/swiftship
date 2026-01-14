import { LogOut, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { signOut } from '../Store/Slices/authSlice'

const AdminNavbar = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(signOut())
  }

  return (
    <nav className="navbar navbar-custom px-4 py-3 d-flex justify-content-between align-items-center">
      <span className="navbar-brand mb-0 h4 text-white">Logistics Admin Panel</span>

      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center me-3 text-white">
          <User size={20} className="me-2" />
          <span>{user?.full_name || "Admin"}</span>
        </div>

        <button className="btn btn-link text-white" onClick={handleLogout}>
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  )
}

export default AdminNavbar
