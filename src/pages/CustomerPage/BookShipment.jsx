import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import Navbar from '../../components/Navbar'


import { Package, MapPin, Truck } from 'lucide-react'

const BookShipmentSchema = Yup.object().shape({
  pickupAddress: Yup.string()
    .min(5, 'Address must be at least 5 characters')
    .required('Pickup address is required'),
  pickupCity: Yup.string().required('Pickup city is required'),
  pickupState: Yup.string().required('Pickup state is required'),
  deliveryAddress: Yup.string()
    .min(5, 'Address must be at least 5 characters')
    .required('Delivery address is required'),
  deliveryCity: Yup.string().required('Delivery city is required'),
  deliveryState: Yup.string().required('Delivery state is required'),
  packageType: Yup.string().required('Package type is required'),
  weight: Yup.number()
    .min(0.1, 'Weight must be greater than 0')
    .required('Weight is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Package description is required'),
  receiverName: Yup.string().required('Receiver name is required'),
  receiverPhone: Yup.string()
    .matches(/^[0-9]{10,15}$/, 'Invalid phone number')
    .required('Receiver phone is required'),
})

function BookShipment() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const [error, setError] = useState('') 

  const calculatePrice = (weight, packageType) => {
    let basePrice = 1000
    let weightCharge = weight * 100
    let typeMultiplier = packageType === 'fragile' ? 1.5 : packageType === 'express' ? 2 : 1
    return Math.round((basePrice + weightCharge) * typeMultiplier)
  }

const handleSubmit = async (values, { setSubmitting }) => {
  try {
    setError('');

    const price = calculatePrice(values.weight, values.packageType);
    const trackingId = 'TRK' + Date.now().toString().slice(-8);

    
    const shipmentRes = await axios.post(
      "http://localhost:5001/customer/shipments",
      {
        tracking_id: trackingId,
        pickup_address: values.pickupAddress,
        pickup_city: values.pickupCity,
        pickup_state: values.pickupState,
        delivery_address: values.deliveryAddress,
        delivery_city: values.deliveryCity,
        delivery_state: values.deliveryState,
        package_type: values.packageType,
        weight: values.weight,
        package_description: values.description,
        receiver_name: values.receiverName,
        receiver_phone: values.receiverPhone,
        price
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      }
    );

    const payRes = await axios.post(
      "http://localhost:5001/payment/init",
      {
        email: user.email,
        amount: price,
        shipmentId: shipmentRes.data.id
      }
    );

    window.location.href = payRes.data.authorization_url;

  } catch (err) {
    setError(err.response?.data?.message || "Payment failed");
  } finally {
    setSubmitting(false);
  }
};
  return (
    <div className="page-container">
      <Navbar />
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '32px', fontSize: '32px' }}>
            Book a New Shipment
          </h1>

          {error && (
            <div className="alert-custom alert-error">
              {error}
            </div>
          )}

          <Formik
            initialValues={{
              pickupAddress: '',
              pickupCity: '',
              pickupState: '',
              deliveryAddress: '',
              deliveryCity: '',
              deliveryState: '',
              packageType: '',
              weight: '',
              description: '',
              receiverName: '',
              receiverPhone: '',
            }}
            validationSchema={BookShipmentSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, values }) => (
              <Form>
                <div className="card-white">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <MapPin size={24} color="#2563EB" />
                    <h3 style={{ color: '#2563EB', fontSize: '20px', fontWeight: '600', margin: 0 }}>
                      Pickup Information
                    </h3>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="pickupAddress" className="form-label">Pickup Address</label>
                        <Field
                          type="text"
                          name="pickupAddress"
                          id="pickupAddress"
                          className={`form-control-custom ${errors.pickupAddress && touched.pickupAddress ? 'error' : ''}`}
                          placeholder="Enter pickup address"
                        />
                        {errors.pickupAddress && touched.pickupAddress && (
                          <span className="error-message">{errors.pickupAddress}</span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="pickupCity" className="form-label">City</label>
                        <Field
                          type="text"
                          name="pickupCity"
                          id="pickupCity"
                          className={`form-control-custom ${errors.pickupCity && touched.pickupCity ? 'error' : ''}`}
                          placeholder="Enter city"
                        />
                        {errors.pickupCity && touched.pickupCity && (
                          <span className="error-message">{errors.pickupCity}</span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="pickupState" className="form-label">State</label>
                        <Field
                          type="text"
                          name="pickupState"
                          id="pickupState"
                          className={`form-control-custom ${errors.pickupState && touched.pickupState ? 'error' : ''}`}
                          placeholder="Enter state"
                        />
                        {errors.pickupState && touched.pickupState && (
                          <span className="error-message">{errors.pickupState}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-white">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Truck size={24} color="#F97316" />
                    <h3 style={{ color: '#F97316', fontSize: '20px', fontWeight: '600', margin: 0 }}>
                      Delivery Information
                    </h3>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="deliveryAddress" className="form-label">Delivery Address</label>
                        <Field
                          type="text"
                          name="deliveryAddress"
                          id="deliveryAddress"
                          className={`form-control-custom ${errors.deliveryAddress && touched.deliveryAddress ? 'error' : ''}`}
                          placeholder="Enter delivery address"
                        />
                        {errors.deliveryAddress && touched.deliveryAddress && (
                          <span className="error-message">{errors.deliveryAddress}</span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="deliveryCity" className="form-label">City</label>
                        <Field
                          type="text"
                          name="deliveryCity"
                          id="deliveryCity"
                          className={`form-control-custom ${errors.deliveryCity && touched.deliveryCity ? 'error' : ''}`}
                          placeholder="Enter city"
                        />
                        {errors.deliveryCity && touched.deliveryCity && (
                          <span className="error-message">{errors.deliveryCity}</span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="deliveryState" className="form-label">State</label>
                        <Field
                          type="text"
                          name="deliveryState"
                          id="deliveryState"
                          className={`form-control-custom ${errors.deliveryState && touched.deliveryState ? 'error' : ''}`}
                          placeholder="Enter state"
                        />
                        {errors.deliveryState && touched.deliveryState && (
                          <span className="error-message">{errors.deliveryState}</span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="receiverName" className="form-label">Receiver Name</label>
                        <Field
                          type="text"
                          name="receiverName"
                          id="receiverName"
                          className={`form-control-custom ${errors.receiverName && touched.receiverName ? 'error' : ''}`}
                          placeholder="Enter receiver name"
                        />
                        {errors.receiverName && touched.receiverName && (
                          <span className="error-message">{errors.receiverName}</span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="receiverPhone" className="form-label">Receiver Phone</label>
                        <Field
                          type="tel"
                          name="receiverPhone"
                          id="receiverPhone"
                          className={`form-control-custom ${errors.receiverPhone && touched.receiverPhone ? 'error' : ''}`}
                          placeholder="Enter receiver phone"
                        />
                        {errors.receiverPhone && touched.receiverPhone && (
                          <span className="error-message">{errors.receiverPhone}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-white">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Package size={24} color="#38BDF8" />
                    <h3 style={{ color: '#38BDF8', fontSize: '20px', fontWeight: '600', margin: 0 }}>
                      Package Details
                    </h3>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="packageType" className="form-label">Package Type</label>
                        <Field
                          as="select"
                          name="packageType"
                          id="packageType"
                          className={`form-control-custom ${errors.packageType && touched.packageType ? 'error' : ''}`}
                        >
                          <option value="">Select package type</option>
                          <option value="standard">Standard</option>
                          <option value="fragile">Fragile</option>
                          <option value="express">Express</option>
                        </Field>
                        {errors.packageType && touched.packageType && (
                          <span className="error-message">{errors.packageType}</span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="weight" className="form-label">Weight (kg)</label>
                        <Field
                          type="number"
                          name="weight"
                          id="weight"
                          step="0.1"
                          className={`form-control-custom ${errors.weight && touched.weight ? 'error' : ''}`}
                          placeholder="Enter weight"
                        />
                        {errors.weight && touched.weight && (
                          <span className="error-message">{errors.weight}</span>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="description" className="form-label">Package Description</label>
                        <Field
                          as="textarea"
                          name="description"
                          id="description"
                          rows="4"
                          className={`form-control-custom ${errors.description && touched.description ? 'error' : ''}`}
                          placeholder="Describe the package contents"
                        />
                        {errors.description && touched.description && (
                          <span className="error-message">{errors.description}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {values.weight && values.packageType && (
                    <div className="alert-custom alert-success" style={{ marginTop: '16px' }}>
                      <strong>Estimated Cost:</strong> ₦{calculatePrice(values.weight, values.packageType).toLocaleString()}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="btn-secondary-custom"
                    onClick={() => navigate('/dashboard')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-custom"
                    disabled={isSubmitting}
                    style={{ minWidth: '200px' }}
                  >
                    {isSubmitting ? 'Processing...' : 'Book Shipment & Pay'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default BookShipment