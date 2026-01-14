import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import MainLayout from "../../components/MainLayout"
import { useAppDispatch, useAppSelector } from '../../Store/Hooks'
import { fetchDriverProfile, updateDriverProfile } from '../../Store/Slices/driverSlice'
import { User, Truck } from 'lucide-react'

const validationSchema = Yup.object({
  full_name: Yup.string().required('Full name is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10,15}$/, 'Phone number must be 10-15 digits')
    .required('Phone is required'),
  license_number: Yup.string().required('License number is required'),
  vehicle_type: Yup.string().required('Vehicle type is required'),
  vehicle_plate: Yup.string().required('Vehicle plate is required'),
  vehicle_model: Yup.string().required('Vehicle model is required'),
})

const Profile = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { profile, loading } = useAppSelector((state) => state.driver)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchDriverProfile(user.id))
    }
  }, [dispatch, user])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      license_number: profile?.license_number || '',
      vehicle_type: profile?.vehicle_type || '',
      vehicle_plate: profile?.vehicle_plate || '',
      vehicle_model: profile?.vehicle_model || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!user?.id) return
      try {
        await dispatch(updateDriverProfile({ userId: user.id, updates: values })).unwrap()
        setAlert({ type: 'success', message: 'Profile updated successfully!' })
        setTimeout(() => setAlert(null), 3000)
      } catch (error) {
        setAlert({ type: 'error', message: error.message || 'Failed to update profile' })
      }
    },
  })

  if (loading && !profile) {
    return (
      <MainLayout>
        <div className="container-fluid py-4">
          <div className="text-center">Loading profile...</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container-fluid py-4">
        <h2 className="page-title">Profile</h2>

        {alert && (
          <div className={`alert alert-${alert.type === 'success' ? 'success' : 'danger'}`}>
            {alert.message}
          </div>
        )}

        <div className="row">

          {/* ==== PERSONAL INFORMATION ==== */}
          <div className="col-lg-6">
            <div className="card mb-4">
              <div className="card-header">
                <h5><User size={20} /> Personal Information</h5>
              </div>
              <div className="card-body">
                <form onSubmit={formik.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="full_name">Full Name</label>
                    <input
                      id="full_name"
                      type="text"
                      className={`form-control ${formik.touched.full_name && formik.errors.full_name ? 'is-invalid' : ''}`}
                      {...formik.getFieldProps('full_name')}
                    />
                    {formik.touched.full_name && formik.errors.full_name && (
                      <div className="invalid-feedback">{formik.errors.full_name}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={profile?.email || ''}
                      disabled
                    />
                    <small className="form-text text-muted">Email cannot be changed</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      className={`form-control ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
                      {...formik.getFieldProps('phone')}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <div className="invalid-feedback">{formik.errors.phone}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="license_number">Driver's License Number</label>
                    <input
                      id="license_number"
                      type="text"
                      className={`form-control ${formik.touched.license_number && formik.errors.license_number ? 'is-invalid' : ''}`}
                      {...formik.getFieldProps('license_number')}
                    />
                    {formik.touched.license_number && formik.errors.license_number && (
                      <div className="invalid-feedback">{formik.errors.license_number}</div>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? 'Saving...' : 'Save Personal Info'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ==== VEHICLE INFORMATION ==== */}
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header">
                <h5><Truck size={20} /> Vehicle Information</h5>
              </div>
              <div className="card-body">
                <form onSubmit={formik.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="vehicle_type">Vehicle Type</label>
                    <select
                      id="vehicle_type"
                      className={`form-control ${formik.touched.vehicle_type && formik.errors.vehicle_type ? 'is-invalid' : ''}`}
                      {...formik.getFieldProps('vehicle_type')}
                    >
                      <option value="">Select vehicle type</option>
                      <option value="car">Car</option>
                      <option value="van">Van</option>
                      <option value="truck">Truck</option>
                      <option value="motorcycle">Motorcycle</option>
                    </select>
                    {formik.touched.vehicle_type && formik.errors.vehicle_type && (
                      <div className="invalid-feedback">{formik.errors.vehicle_type}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="vehicle_model">Vehicle Make & Model</label>
                    <input
                      id="vehicle_model"
                      type="text"
                      placeholder="e.g., Toyota Camry 2020"
                      className={`form-control ${formik.touched.vehicle_model && formik.errors.vehicle_model ? 'is-invalid' : ''}`}
                      {...formik.getFieldProps('vehicle_model')}
                    />
                    {formik.touched.vehicle_model && formik.errors.vehicle_model && (
                      <div className="invalid-feedback">{formik.errors.vehicle_model}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="vehicle_plate">License Plate Number</label>
                    <input
                      id="vehicle_plate"
                      type="text"
                      placeholder="e.g., ABC-1234"
                      className={`form-control ${formik.touched.vehicle_plate && formik.errors.vehicle_plate ? 'is-invalid' : ''}`}
                      {...formik.getFieldProps('vehicle_plate')}
                    />
                    {formik.touched.vehicle_plate && formik.errors.vehicle_plate && (
                      <div className="invalid-feedback">{formik.errors.vehicle_plate}</div>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? 'Saving...' : 'Save Vehicle Info'}
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  )
}

export default Profile
