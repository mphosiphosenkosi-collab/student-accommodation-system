// src/pages/public/TenantLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function TenantLogin() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("tenantToken");
    if (token) {
      navigate("/tenant/dashboard", { replace: true });
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (loginError) setLoginError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, accept any email/password
      // In production, this would validate against backend
      
      const mockUser = {
        id: "TEN-001",
        name: formData.email.split('@')[0],
        email: formData.email,
        role: "tenant",
        studentId: "STU2024001",
        property: "Mbombela Heights",
        roomNumber: "203"
      };
      
      // Store auth data
      localStorage.setItem("tenantToken", "mock-jwt-token-12345");
      localStorage.setItem("tenantUser", JSON.stringify(mockUser));
      
      setIsLoading(false);
      navigate("/tenant/dashboard", { replace: true });
    }, 1000);
  };

  const handleDemoLogin = () => {
    setFormData({
      email: "thabo@studentstay.co.za",
      password: "demo123"
    });
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #065A63 0%, #0B6B73 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      position: "relative"
    },
    card: {
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(12px)",
      borderRadius: "28px",
      padding: "48px 40px",
      width: "100%",
      maxWidth: "440px",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
    },
    logoContainer: {
      textAlign: "center",
      marginBottom: "32px"
    },
    logo: {
      fontSize: "48px",
      marginBottom: "8px"
    },
    logoText: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#B7E5CD",
      margin: 0
    },
    title: {
      color: "#fff",
      textAlign: "center",
      marginBottom: "12px",
      fontSize: "clamp(1.8rem, 5vw, 2rem)",
      fontWeight: "700"
    },
    subtitle: {
      color: "rgba(255,255,255,0.7)",
      textAlign: "center",
      marginBottom: "32px",
      fontSize: "14px"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    label: {
      color: "#B8FFF1",
      fontSize: "13px",
      fontWeight: "500",
      letterSpacing: "0.5px"
    },
    inputWrapper: {
      position: "relative"
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: "14px",
      border: "1px solid rgba(255,255,255,0.15)",
      background: "rgba(255,255,255,0.05)",
      color: "#fff",
      fontSize: "15px",
      outline: "none",
      transition: "all 0.3s ease",
      boxSizing: "border-box"
    },
    inputError: {
      borderColor: "#EF4444",
      background: "rgba(239, 68, 68, 0.1)"
    },
    passwordToggle: {
      position: "absolute",
      right: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      color: "rgba(255,255,255,0.6)",
      cursor: "pointer",
      fontSize: "16px"
    },
    errorText: {
      color: "#EF4444",
      fontSize: "12px",
      marginTop: "4px"
    },
    loginError: {
      background: "rgba(239, 68, 68, 0.15)",
      border: "1px solid rgba(239, 68, 68, 0.3)",
      color: "#EF4444",
      padding: "12px 16px",
      borderRadius: "12px",
      marginBottom: "20px",
      textAlign: "center",
      fontSize: "13px"
    },
    button: {
      padding: "14px 20px",
      background: "#4BC7B0",
      color: "#065A63",
      border: "none",
      borderRadius: "14px",
      fontWeight: "700",
      fontSize: "15px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "8px"
    },
    buttonDisabled: {
      background: "rgba(75, 199, 176, 0.6)",
      cursor: "not-allowed"
    },
    demoButton: {
      background: "transparent",
      border: "1px solid rgba(255,255,255,0.2)",
      color: "#B8FFF1",
      marginTop: "0"
    },
    footer: {
      marginTop: "28px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    },
    footerLink: {
      color: "rgba(255,255,255,0.6)",
      fontSize: "13px",
      textDecoration: "none",
      transition: "color 0.3s ease"
    },
    homeLink: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      color: "#4BC7B0",
      textDecoration: "none",
      fontSize: "13px",
      fontWeight: "500",
      transition: "color 0.3s ease"
    },
    divider: {
      position: "relative",
      textAlign: "center",
      margin: "16px 0 8px",
      color: "rgba(255,255,255,0.4)",
      fontSize: "12px"
    },
    demoNote: {
      background: "rgba(75, 199, 176, 0.1)",
      borderRadius: "8px",
      padding: "8px",
      textAlign: "center",
      fontSize: "11px",
      color: "rgba(255,255,255,0.5)",
      marginTop: "16px"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}></div>
          <h3 style={styles.logoText}>StudentStay</h3>
        </div>
        
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to manage your accommodation</p>
        
        {loginError && <div style={styles.loginError}>{loginError}</div>}
        
        <form onSubmit={handleLogin} style={styles.form}>
          {/* Email Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="student@example.com"
              style={{
                ...styles.input,
                ...(errors.email && styles.inputError)
              }}
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.email && <div style={styles.errorText}>{errors.email}</div>}
          </div>
          
          {/* Password Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                style={{
                  ...styles.input,
                  ...(errors.password && styles.inputError)
                }}
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              <button
                type="button"
                style={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <div style={styles.errorText}>{errors.password}</div>}
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isLoading && styles.buttonDisabled)
            }}
            disabled={isLoading}
            onMouseEnter={(e) => {
              if (!isLoading) e.target.style.background = "#3db39e";
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.target.style.background = "#4BC7B0";
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        {/* Demo Login Button */}
        <div style={styles.divider}>or</div>
        <button
          type="button"
          style={{
            ...styles.button,
            ...styles.demoButton
          }}
          onClick={handleDemoLogin}
          disabled={isLoading}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255,255,255,0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
          }}
        >
          Use Demo Credentials
        </button>
        
        <div style={styles.demoNote}>
          ⚡ Demo Mode: Any email/password works
        </div>
        
        <div style={styles.footer}>
          <Link to="/" style={styles.homeLink}>
            ← Back to Home
          </Link>
          <a href="#" style={styles.footerLink}>
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}

export default TenantLogin;