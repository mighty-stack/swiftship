import { useEffect, useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../Store/Hooks'
import { fetchUsers, updateUser, deleteUser } from '../../Store/Slices/userSlice'
import EditUserModal from '../../components/EditUserModal'
import AdminNavBar from '../../components/AdminNavBar'
import AdminSideBar from '../../components/AdminSideBar'
import '../../Styles/Admin.css'

const UserManagement = () => {
  const dispatch = useAppDispatch()
  const { users, loading } = useAppSelector((state) => state.users)

  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleEdit = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await dispatch(deleteUser(id))
    }
  }

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'danger',
      driver: 'warning',
      customer: 'info',
    }
    return `badge bg-${colors[role] || 'secondary'}`
  }

  const getStatusBadge = (status) => {
    const colors = {
      active: 'success',
      inactive: 'secondary',
      suspended: 'danger',
    }
    return `badge bg-${colors[status] || 'secondary'}`
  }

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
        <h2 className="mb-4">User Management</h2>

        <div className="card">
          <div className="card-body">

            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-header">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
                    >
                      <td>{user.full_name}</td>
                      <td>{user.email}</td>

                      <td>
                        <span className={getRoleBadge(user.role)}>
                          {user.role}
                        </span>
                      </td>

                      <td>{user.phone || '-'}</td>

                      <td>
                        <span className={getStatusBadge(user.status)}>
                          {user.status}
                        </span>
                      </td>

                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(user._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>
        </div>

        {showModal && selectedUser && (
          <EditUserModal
            user={selectedUser}
            onClose={() => {
              setShowModal(false)
              setSelectedUser(null)
            }}
            onSave={(updates) => {
              dispatch(updateUser({ id: selectedUser._id, updates }))
              setShowModal(false)
              setSelectedUser(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default UserManagement
