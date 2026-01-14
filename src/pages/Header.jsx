import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import "../Styles/Header.css"

const Header = () => {
  return (
    <header className="header">
      {/* LOGO */}
      <motion.div
        className="logo"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        SwiftShip<span>.</span>
      </motion.div>

      {/* NAV MENU */}
      <motion.nav
        className="nav-menu"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <a href="/">Home</a>
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#testimonials">Testimonials</a>
      </motion.nav>

      {/* LOGIN BUTTON */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/login" className="nav-cta">
          Login
        </Link>
      </motion.div>
    </header>
  )
}

export default Header
