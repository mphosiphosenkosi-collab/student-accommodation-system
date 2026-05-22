import { useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    setError("")
    
    // Simple validation - replace with actual API call
    if (email === "admin@example.com" && password === "admin123") {
      localStorage.setItem("adminToken", "mock-admin-token-123")
      localStorage.setItem("adminUser", JSON.stringify({
        name: "Admin User",
        email: email,
        role: "Administrator"
      }))
      navigate("/admin/dashboard", { replace: true })
    } else {
      setError("Invalid credentials. Use admin@example.com / admin123")
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          
          <h2>Admin Portal</h2>
        </div>
        <h1 style={styles.title}>Admin Access</h1>
        <p style={styles.subtitle}>Sign in to manage the platform</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email Address"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>
        
        <div style={styles.footer}>
          <p>Demo: admin@example.com / admin123</p>
          <a href="/" style={styles.homeLink}>← Back to Home</a>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px"
  },
  card: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid rgba(255,255,255,0.2)"
  },
  logo: {
    textAlign: "center",
    marginBottom: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    color: "#fff"
  },
  title: {
    color: "#fff",
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "1.8rem"
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: "30px"
  },
  error: {
    background: "rgba(239, 68, 68, 0.2)",
    border: "1px solid #EF4444",
    color: "#EF4444",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "1rem",
    outline: "none"
  },
  button: {
    padding: "12px",
    background: "#4BC7B0",
    color: "#065A63",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "10px"
  },
  footer: {
    marginTop: "30px",
    textAlign: "center",
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.6)"
  },
  homeLink: {
    display: "inline-block",
    marginTop: "10px",
    color: "#4BC7B0",
    textDecoration: "none"
  }
}

export default AdminLogin