import { Link } from "react-router-dom"


function Navbar() {
  return (
    <nav style={styles.navbar}>

      <div style={styles.logo}>
        <STU-Hou></STU-Hou>
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

      <Link to="/tenant/login" style={styles.loginBtn}>
        Tenant Login
      </Link>

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
    padding: "22px 7%",
    background: "rgba(6, 90, 99, 0.75)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)"
  },

  logo: {
    fontSize: "1.4rem",
    fontWeight: "700",
    letterSpacing: "1px",
    color: "#B8FFF1"
  },

  links: {
    display: "flex",
    gap: "28px"
  },

  link: {
    color: "rgba(255,255,255,0.8)",
    fontSize: "0.95rem"
  },

  loginBtn: {
    background: "#4BC7B0",
    color: "#08363C",
    border: "none",
    padding: "12px 18px",
    borderRadius: "14px",
    fontWeight: "600",
    cursor: "pointer"
  }

}

export default Navbar