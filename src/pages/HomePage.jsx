import { motion } from "framer-motion";
import CountUp from "react-countup";
import Slider from "react-slick";
import "../Styles/HomePage.css";
import Footer from "./Footer";
import Header from "./Header";
import Lottie from "lottie-react";
import truckAnim from "../assets/truck.json";
import { Link } from "react-router-dom";

const testimonials = [
  {
    name: "John Daniel",
    text: "Fast delivery and professional service. Amazing experience!",
  },
  {
    name: "Sarah Johnson",
    text: "My package arrived in perfect condition and earlier than expected!",
  },
  {
    name: "Mike Anderson",
    text: "Reliable and affordable. I'll definitely use them again.",
  },
];

const Home = () => {
  const sliderSettings = {
    infinite: true,
    autoplay: true,
    speed: 800,
    slidesToShow: 1,
    arrows: false,
    dots: true,
  };

  return (
    <div className="home-wrapper">
      <Header />

      {/* HERO */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Fast • Reliable • Secure Delivery
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Your trusted logistics partner for local and interstate deliveries.
          </motion.p>

          <motion.button
            className="cta-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/login">Get Started</Link>
          </motion.button>
        </div>

        {/* TRUCK + DRIVER ANIMATED SIDE */}
        <motion.div
          className="hero-animation"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <Lottie
            animationData={truckAnim}
            loop={true}
            className="hero-lottie"
          />
        </motion.div>
      </section>

      {/* ABOUT */}

      {/* ABOUT SECTION */}
      <section className="about-section" id="about">
        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>About Us</h2>
          <p>
            At <span className="highlight">SwiftShip Logistics</span>, we
            redefine delivery through speed, reliability, and trust. Our mission
            is simple — to ensure every parcel, document, and cargo reaches its
            destination safely and on time.
          </p>

          <p>
            Backed by a strong network of verified drivers and cutting-edge
            tracking technology, we offer complete transparency from pickup to
            drop-off. Whether it’s a same-day local delivery or an interstate
            shipment, our team ensures smooth coordination every step of the
            way.
          </p>

          <p>
            Our commitment to innovation, customer satisfaction, and
            professionalism has made us one of the most reliable logistics
            partners for businesses and individuals alike. We handle every
            delivery as if it were our own.
          </p>

          <div className="about-highlights">
            <div>
              <h3>🚚 1200+ Deliveries</h3>
              <p>Completed successfully across multiple cities.</p>
            </div>
            <div>
              <h3>👨‍💼 Trusted Drivers</h3>
              <p>Verified professionals trained for safety and service.</p>
            </div>
            <div>
              <h3>💡 Smart Tracking</h3>
              <p>Real-time updates and live delivery progress monitoring.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SERVICES */}
      <section className="services-section" id="services">
        <h2>Our Services</h2>
        <div className="service-grid">
          {[
            "Local Delivery – Fast and reliable same-city pickups and drop-offs for individuals and small businesses.",
            "Parcel Shipping – Secure handling and transportation of parcels of all sizes with real-time tracking.",
            "Interstate Logistics – Long-distance transportation across multiple states with efficiency and safety.",
            "Corporate Delivery – Tailored delivery solutions for companies, including scheduled pickups and bulk dispatch.",
          ].map((service, i) => (
            <motion.div
               key={i}
              className="service-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              {service}
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        {[
          { value: 1200, label: "Deliveries Completed" },
          { value: 850, label: "Happy Clients" },
          { value: 120, label: "Active Drivers" },
        ].map((stat, i) => (
          <motion.div
            className="stat"
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            viewport={{ once: true }}
          >
            <CountUp end={stat.value} duration={2.5} />+<p>{stat.label}</p>
          </motion.div>
        ))}
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section" id="testimonials">
        <h2>What Our Clients Say</h2>

        <Slider {...sliderSettings}>
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-text">"{t.text}"</p>
              <h4 className="testimonial-name">- {t.name}</h4>
            </div>
          ))}
        </Slider>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
