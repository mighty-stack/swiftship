import { useState } from 'react'
import { useAppSelector } from '../Store/Hooks'

const AssignDriverModal = ({ shipment, onClose, onAssign }) => {
  const { users } = useAppSelector((state) => state.users)
  const drivers = users.filter((u) => u.role === 'driver' && u.status === 'active')
  const [selectedDriver, setSelectedDriver] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedDriver) {
      onAssign(selectedDriver)
    }
  }

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Assign Driver</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <p className="mb-3">
                Tracking Number: <strong>{shipment.tracking_number}</strong>
              </p>
              <div className="mb-3">
                <label htmlFor="driver" className="form-label">
                  Select Driver
                </label>
                <select
                  className="form-select"
                  id="driver"
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  required
                >
                  <option value="">Choose a driver...</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.full_name} - {driver.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-orange" disabled={!selectedDriver}>
                Assign Driver
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AssignDriverModal
