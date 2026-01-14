import { useFormik } from 'formik'
import * as Yup from 'yup'
import { X } from 'lucide-react'

const validationSchema = Yup.object({
  full_name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string(),
  role: Yup.string().oneOf(['admin', 'customer', 'driver']).required('Role is required'),
  status: Yup.string().oneOf(['active', 'inactive', 'suspended']).required('Status is required'),
})

const EditUserModal = ({ user, onClose, onSave }) => {
  const formik = useFormik({
    initialValues: {
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status,
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values)
    },
  })

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit User</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="full_name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.full_name && formik.errors.full_name ? 'is-invalid' : ''
                  }`}
                  id="full_name"
                  {...formik.getFieldProps('full_name')}
                />
                {formik.touched.full_name && formik.errors.full_name && (
                  <div className="invalid-feedback">{formik.errors.full_name}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control ${
                    formik.touched.email && formik.errors.email ? 'is-invalid' : ''
                  }`}
                  id="email"
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="invalid-feedback">{formik.errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  {...formik.getFieldProps('phone')}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  Role
                </label>
                <select
                  className={`form-select ${
                    formik.touched.role && formik.errors.role ? 'is-invalid' : ''
                  }`}
                  id="role"
                  {...formik.getFieldProps('role')}
                >
                  <option value="customer">Customer</option>
                  <option value="driver">Driver</option>
                  <option value="admin">Admin</option>
                </select>
                {formik.touched.role && formik.errors.role && (
                  <div className="invalid-feedback">{formik.errors.role}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  className={`form-select ${
                    formik.touched.status && formik.errors.status ? 'is-invalid' : ''
                  }`}
                  id="status"
                  {...formik.getFieldProps('status')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                {formik.touched.status && formik.errors.status && (
                  <div className="invalid-feedback">{formik.errors.status}</div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditUserModal
