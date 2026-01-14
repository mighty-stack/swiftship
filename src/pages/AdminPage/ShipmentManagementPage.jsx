import { useEffect, useState } from 'react'
import { Edit2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../Store/Hooks'
import { fetchShipments, assignDriver, updateShipment } from '../../Store/Slices/shipmentsSlice'
import { fetchUsers } from '../../Store/Slices/userSlice'
import AssignDriverModal from '../../components/AssignDriver'
import UpdateStatusModal from '../../components/UpdateStatus'
import AdminNavBar from '../../components/AdminNavBar'
import AdminSideBar from '../../components/AdminSideBar'
import '../../Styles/Admin.css'

const Shipments = () => {
  const dispatch = useAppDispatch()
  const { shipments, loading } = useAppSelector((state) => state.shipments)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState(null)

  useEffect(() => {
  
    dispatch(fetchShipments())
    dispatch(fetchUsers())
  }, [dispatch])

  const handleAssignDriver = (shipment) => {
    setSelectedShipment(shipment)
    setShowAssignModal(true)
  }

  const handleUpdateStatus = (shipment) => {
    setSelectedShipment(shipment)
    setShowStatusModal(true)
  }

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'secondary',
      assigned: 'info',
      in_transit: 'warning',
      delivered: 'success',
      cancelled: 'danger',
    }
    return `badge bg-${colors[status] || 'secondary'}`
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
        <h2 className="mb-4">Shipments Management</h2>
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-header">
                  <tr>
                    <th>Tracking #</th>
                    <th>Customer</th>
                    <th>Driver</th>
                    <th>Pickup</th>
                    <th>Delivery</th>
                    <th>Status</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {shipments.map((shipment, index) => (
                    <tr
                      key={shipment._id || shipment.id}
                      className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
                    >
                      <td className="fw-bold">{shipment.tracking_number}</td>
                      <td>{shipment.customer?.full_name || '-'}</td>

                      <td>
                        {shipment.driver?.full_name || (
                          <span className="text-muted">Unassigned</span>
                        )}
                      </td>

                      <td className="small">{shipment.pickup_address?.substring(0, 30)}...</td>
                      <td className="small">{shipment.delivery_address?.substring(0, 30)}...</td>

                      <td>
                        <span className={getStatusBadge(shipment.status)}>
                          {shipment.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td>${Number(shipment.price).toFixed(2)}</td>

                      <td>
                        <button
                          className="btn btn-sm btn-orange me-2"
                          onClick={() => handleAssignDriver(shipment)}
                        >
                          Assign Driver
                        </button>

                        <button
                          className="btn btn-sm btn-orange"
                          onClick={() => handleUpdateStatus(shipment)}
                        >
                          <Edit2 size={14} className="me-1" />
                          Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>

        {/* Assign Driver Modal */}
        {showAssignModal && selectedShipment && (
          <AssignDriverModal
            shipment={selectedShipment}
            onClose={() => {
              setShowAssignModal(false)
              setSelectedShipment(null)
            }}
            onAssign={(driverId) => {
              dispatch(assignDriver({ shipmentId: selectedShipment._id, driverId }))
              setShowAssignModal(false)
              setSelectedShipment(null)
            }}
          />
        )}

        {/* Update Status Modal */}
        {showStatusModal && selectedShipment && (
          <UpdateStatusModal
            shipment={selectedShipment}
            onClose={() => {
              setShowStatusModal(false)
              setSelectedShipment(null)
            }}
            onUpdate={(status) => {
              dispatch(updateShipment({ id: selectedShipment._id, updates: { status } }))
              setShowStatusModal(false)
              setSelectedShipment(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Shipments
