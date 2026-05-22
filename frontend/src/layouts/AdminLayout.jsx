import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    const adminData = localStorage.getItem("adminUser")
    if (adminData) {
      setAdmin(JSON.parse(adminData))
    }
  }, [])

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminToken")
      localStorage.removeItem("adminUser")
      navigate("/", { replace: true })
    }
  }

  const isActive = (path) => {
    return location.pathname === `/admin${path}`
  }

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}></span>
          <h2 style={styles.logoText}>Admin Portal</h2>
        </div>
        
        <nav style={styles.nav}>
          <Link to="/admin/dashboard" style={isActive("/dashboard") ? styles.navLinkActive : styles.navLink}>
            Dashboard
          </Link>

          <Link to="/admin/properties" style={isActive("/properties") ? styles.navLinkActive : styles.navLink}>
            Properties
          </Link>

          <Link to="/admin/rooms" style={isActive("/rooms") ? styles.navLinkActive : styles.navLink}>

            Rooms
          </Link>

          <Link to="/admin/tenants" style={isActive("/tenants") ? styles.navLinkActive : styles.navLink}>
            Tenants
          </Link>

          <Link to="/admin/applications" style={isActive("/applications") ? styles.navLinkActive : styles.navLink}>
            Applications
          </Link>

          <Link to="/admin/payments" style={isActive("/payments") ? styles.navLinkActive : styles.navLink}>
            Payments
          </Link>

          <Link to="/admin/reports" style={isActive("/reports") ? styles.navLinkActive : styles.navLink}>
            Reports
          </Link>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.adminInfo}>
            <span style={styles.adminAvatar}>{admin?.avatar || ""}</span>
            <div>
              <p style={styles.adminName}>{admin?.name || "Admin"}</p>
              <p style={styles.adminRole}>{admin?.role || "Administrator"}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  },
  sidebar: {
    width: "280px",
    padding: "30px 20px",
    background: "rgba(30, 60, 114, 0.95)",
    backdropFilter: "blur(10px)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid rgba(255,255,255,0.1)",
    position: "sticky",
    top: 0,
    height: "100vh",
    overflowY: "auto"
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingBottom: "30px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "30px"
  },
  logoIcon: {
    fontSize: "28px"
  },
  logoText: {
    fontSize: "1.3rem",
    fontWeight: "700",
    margin: 0,
    color: "#fff"
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flex: 1
  },
  navLink: {
    padding: "12px 16px",
    borderRadius: "12px",
    textDecoration: "none",
    color: "rgba(255,255,255,0.8)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.3s ease",
    fontSize: "0.95rem",
    fontWeight: "500"
  },
  navLinkActive: {
    padding: "12px 16px",
    borderRadius: "12px",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.3s ease",
    fontSize: "0.95rem",
    fontWeight: "500",
    background: "rgba(75, 199, 176, 0.2)",
    color: "#4BC7B0",
    borderLeft: "3px solid #4BC7B0"
  },
  navIcon: {
    fontSize: "20px"
  },
  sidebarFooter: {
    marginTop: "auto",
    paddingTop: "20px",
    borderTop: "1px solid rgba(255,255,255,0.1)"
  },
  adminInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    marginBottom: "15px"
  },
  adminAvatar: {
    fontSize: "32px"
  },
  adminName: {
    fontSize: "0.9rem",
    fontWeight: "600",
    margin: 0
  },
  adminRole: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.6)",
    margin: 0
  },
  logoutButton: {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "12px",
    color: "#EF4444",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "all 0.3s ease"
  },
  logoutIcon: {
    fontSize: "20px"
  },
  main: {
    flex: 1,
    overflowX: "hidden"
  },
  content: {
    padding: "30px",
    overflowY: "auto"
  }
}

export default AdminLayout