import "../Styles/Footer.css"


const Footer = () => {
  return (
    <footer className="footer">
      <h3>SwiftShip Logistics</h3>
      <p>Fast • Reliable • Secure Delivery</p>

      <div className="footer-links">
        <a href="#home">Home</a>
        <a href="#services">Services</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#about">About</a>
      </div>

      <p className="copy">© {new Date().getFullYear()} SwiftShip Logistics • All Rights Reserved.</p>
    </footer>
  )
}

export default Footer

