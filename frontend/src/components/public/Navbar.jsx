// src/components/Navbar.jsx - Compact version with dropdown
import { Link } from "react-router-dom"
import { useState } from "react"

function Navbar() {
  const [showLoginMenu, setShowLoginMenu] = useState(false)

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}></Link>
      </div>

      <div style={styles.links}>
        <Link style={styles.link} to="/">
          Home
        </Link>
        <Link style={styles.link} to="/properties">
          Properties
        </Link>
        <Link style={styles.link} to="/apply">
          Apply
        </Link>
      </div>

      <div style={styles.buttonGroup}>
        <Link to="/tenant/login" style={styles.loginBtn}>
           Tenant Login
        </Link>
        <Link to="/admin/login" style={{...styles.loginBtn, ...styles.adminBtn}}>
           Admin Login
        </Link>
      </div>
    </nav>
  )
}

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 7%",
    background: "rgba(6, 90, 99, 0.85)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)"
  },

  logo: {
    fontSize: "1.5rem",
    fontWeight: "700",
    letterSpacing: "1px"
  },

  logoLink: {
    color: "#B8FFF1",
    textDecoration: "none"
  },

  links: {
    display: "flex",
    gap: "32px",
    alignItems: "center"
  },

  link: {
    color: "rgba(255,255,255,0.85)",
    fontSize: "0.95rem",
    textDecoration: "none",
    transition: "color 0.3s ease"
  },

  buttonGroup: {
    display: "flex",
    gap: "12px"
  },

  loginBtn: {
    background: "rgba(75, 199, 176, 0.15)",
    border: "1px solid rgba(75, 199, 176, 0.3)",
    color: "#4BC7B0",
    padding: "10px 20px",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    fontSize: "0.9rem",
    transition: "all 0.3s ease"
  },

  adminBtn: {
    background: "rgba(193, 120, 90, 0.15)",
    border: "1px solid rgba(193, 120, 90, 0.3)",
    color: "#C1785A"
  }
}

export default Navbar