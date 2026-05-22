// src/routes/AppRoutes.jsx - FIXED (removed strict role checking)

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"

/* PUBLIC PAGES */
import Home from "../pages/public/Home"
import Properties from "../pages/public/Properties"
import Apply from "../pages/public/Apply"

/* LAYOUTS */
import PublicLayout from "../layouts/PublicLayout"
import AdminLayout from "../layouts/AdminLayout"
import TenantLayout from "../layouts/TenantLayout"

/* ADMIN PAGES */
import AdminLogin from "../pages/admin/Login"
import AdminDashboard from "../pages/admin/Dashboard"
import AdminProperties from "../pages/admin/Properties"
import Rooms from "../pages/admin/Rooms"
import Tenants from "../pages/admin/Tenants"
import Applications from "../pages/admin/Applications"
import Payments from "../pages/admin/Payments"
import Reports from "../pages/admin/Reports"

/* TENANT PAGES */
import TenantDashboard from "../pages/tenant/Dashboard"
import TenantPayments from "../pages/tenant/Payments"
import TenantMaintenance from "../pages/tenant/Maintenance"
import TenantProfile from "../pages/tenant/Profile"
import TenantLogin from "../pages/tenant/Login"
import TenantDocuments from "../pages/tenant/TenantDocuments"

/* ========== SIMPLE PROTECTED ROUTES COMPONENT (FIXED) ========== */
const ProtectedRoute = ({ children, userType }) => {
  const [isValidating, setIsValidating] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  
  useEffect(() => {
    const validateAuth = () => {
      const token = localStorage.getItem(`${userType}Token`)
      
      // Simple validation - just check if token exists
      if (token) {
        setIsAuthorized(true)
      } else {
        setIsAuthorized(false)
      }
      setIsValidating(false)
    }
    
    validateAuth()
  }, [userType])
  
  if (isValidating) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading...</p>
      </div>
    )
  }
  
  if (!isAuthorized) {
    return <Navigate to={`/${userType}/login`} replace />
  }
  
  return children
}

/* ========== MAIN APP ROUTES ========== */
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* ========== PUBLIC ROUTES ========== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/apply" element={<Apply />} />
        </Route>

        {/* ========== TENANT ROUTES ========== */}
        {/* Tenant Login - Public access */}
        <Route path="/tenant/login" element={<TenantLogin />} />
        
        {/* Tenant Dashboard - Protected */}
        <Route 
          path="/tenant" 
          element={
            <ProtectedRoute userType="tenant">
              <TenantLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TenantDashboard />} />
          <Route path="payments" element={<TenantPayments />} />
          <Route path="maintenance" element={<TenantMaintenance />} />
          <Route path="profile" element={<TenantProfile />} />
          <Route path="documents" element={<TenantDocuments />} />
        </Route>

        {/* ========== ADMIN ROUTES (FIXED - NO STRICT ROLE CHECK) ========== */}
        {/* Admin Login - Public access */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Dashboard - Protected with simple token check */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute userType="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="applications" element={<Applications />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </BrowserRouter>
  )
}

/* ========== STYLES FOR LOADING STATES ========== */
const styles = {
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #065A63 0%, #0B6B73 100%)",
    color: "#fff"
  },
  
  spinner: {
    width: "50px",
    height: "50px",
    border: "3px solid rgba(255,255,255,0.2)",
    borderTop: "3px solid #4BC7B0",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  
  loadingText: {
    marginTop: "20px",
    fontSize: "1rem",
    color: "rgba(255,255,255,0.9)"
  }
}

// Add keyframes animation
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
document.head.appendChild(styleSheet)

export default AppRoutes