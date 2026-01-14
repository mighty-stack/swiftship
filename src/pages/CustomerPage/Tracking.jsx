import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { MapPin, Package, Clock, CheckCircle, User, Phone } from 'lucide-react'
import Navbar from '../../components/Navbar'

function Tracking() {
  const { id } = useParams()
  const [shipment, setShipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadShipment()
  }, [id])

  const loadShipment = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await axios.get(
        `http://localhost:5001/shipments/${id}`, { 
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )

      setShipment(response.data)
    } catch (err) {
      setError('Failed to load shipment details')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-pending'
      case 'in-transit':
        return 'badge-in-transit'
      case 'delivered':
        return 'badge-delivered'
      case 'cancelled':
        return 'badge-cancelled'
      default:
        return 'badge-pending'
    }
  }

  const trackingSteps = [
    { status: 'pending', label: 'Order Placed', icon: <Package size={24} /> },
    { status: 'picked-up', label: 'Picked Up', icon: <Clock size={24} /> },
    { status: 'in-transit', label: 'In Transit', icon: <MapPin size={24} /> },
    { status: 'delivered', label: 'Delivered', icon: <CheckCircle size={24} /> },
  ]

  const getStepStatus = (step) => {
    const statusOrder = ['pending', 'picked-up', 'in-transit', 'delivered']
    const currentIndex = statusOrder.indexOf(shipment?.status)
    const stepIndex = statusOrder.indexOf(step)

    return stepIndex <= currentIndex ? 'completed' : 'pending'
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error || !shipment) {
    return (
      <div className="page-container">
        <div className="card-white" style={{ textAlign: 'center', padding: '48px' }}>
          <Package size={64} color="#EF4444" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ color: '#EF4444' }}>Shipment Not Found</h3>
          <p style={{ color: '#6B7280' }}>{error || 'Unable to find shipment details'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="container">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1
            className="section-title"
            style={{ textAlign: 'center', marginBottom: '32px', fontSize: '32px' }}
          >
            Track Your Shipment
          </h1>

          {/* Shipment Header */}
          <div className="card-white" style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <h3
                  style={{
                    color: '#2563EB',
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  Tracking ID: {shipment.tracking_id}
                </h3>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>
                  Booked on {new Date(shipment.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`badge-status ${getStatusBadgeClass(shipment.status)}`}>
                {shipment.status}
              </span>
            </div>
          </div>

          {/* Shipment Progress */}
          <div className="card-white" style={{ marginBottom: '24px' }}>
            <h3
              style={{
                color: '#2563EB',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '24px',
              }}
            >
              Shipment Progress
            </h3>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '24px',
                  left: '0',
                  right: '0',
                  height: '2px',
                  backgroundColor: '#E5E7EB',
                  zIndex: 0,
                }}
              ></div>

              {trackingSteps.map((step, index) => {
                const isCompleted = getStepStatus(step.status) === 'completed'
                return (
                  <div
                    key={index}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: isCompleted ? '#2563EB' : '#E5E7EB',
                        color: isCompleted ? '#FFFFFF' : '#9CA3AF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {step.icon}
                    </div>
                    <p
                      style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: isCompleted ? '#2563EB' : '#9CA3AF',
                        textAlign: 'center',
                      }}
                    >
                      {step.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="card-white" style={{ marginBottom: '24px' }}>
            <h3
              style={{
                color: '#2563EB',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '24px',
              }}
            >
              Live Tracking Map
            </h3>
            <div
              className="map-container"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F3F4F6',
              }}
            >
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <MapPin size={64} color="#9CA3AF" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '8px' }}>
                  Google Maps Integration Placeholder
                </p>
                <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
                  Real-time tracking map would be displayed here
                </p>
              </div>
            </div>
          </div>

          {/* Pickup + Delivery */}
          <div className="row">
            <div className="col-md-6">
              <div className="card-custom" style={{ height: '100%' }}>
                <h4
                  style={{
                    color: '#2563EB',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '16px',
                  }}
                >
                  Pickup Details
                </h4>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <MapPin size={20} color="#F97316" />
                  <div>
                    <p style={{ fontWeight: '500', marginBottom: '4px' }}>
                      {shipment.pickup_address}
                    </p>
                    <p style={{ color: '#6B7280', fontSize: '14px' }}>
                      {shipment.pickup_city}, {shipment.pickup_state}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card-custom" style={{ height: '100%' }}>
                <h4
                  style={{
                    color: '#2563EB',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '16px',
                  }}
                >
                  Delivery Details
                </h4>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <MapPin size={20} color="#10B981" />
                  <div>
                    <p style={{ fontWeight: '500', marginBottom: '4px' }}>
                      {shipment.delivery_address}
                    </p>
                    <p style={{ color: '#6B7280', fontSize: '14px' }}>
                      {shipment.delivery_city}, {shipment.delivery_state}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <User size={20} color="#6B7280" />
                  <p style={{ fontSize: '14px' }}>{shipment.receiver_name}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Phone size={20} color="#6B7280" />
                  <p style={{ fontSize: '14px' }}>{shipment.receiver_phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Package Info */}
          <div className="card-white">
            <h4
              style={{
                color: '#2563EB',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              Package Information
            </h4>
            <div className="row">
              <div className="col-md-4">
                <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>
                  Package Type
                </p>
                <p style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                  {shipment.package_type}
                </p>
              </div>
              <div className="col-md-4">
                <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>
                  Weight
                </p>
                <p style={{ fontWeight: '500' }}>{shipment.weight} kg</p>
              </div>
              <div className="col-md-4">
                <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>
                  Price
                </p>
                <p style={{ fontWeight: '500', color: '#2563EB' }}>
                  ₦{shipment.price?.toLocaleString()}
                </p>
              </div>
              <div className="col-12" style={{ marginTop: '16px' }}>
                <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>
                  Description
                </p>
                <p style={{ fontWeight: '500' }}>{shipment.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tracking
