import {Link} from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{ padding: 12, borderBottom: '1px solid #eee' }}>
      <Link to="/customer/dashboard" style={{ marginRight: 12 }}>Dashboard</Link>
      <Link to="/customer/book-shipment" style={{ marginRight: 12 }}>Book</Link>
      <Link to="/customer/profile">Profile</Link>
      <Link to="/customer/tracking/:id" style={{ marginLeft: 12 }}>Track</Link>
    </nav>
  )
}

export default Navbar