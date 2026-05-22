// src/context/AdminAuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminAuthContext = createContext()

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    const adminData = localStorage.getItem('adminData')
    
    if (adminToken && adminData) {
      setAdmin(JSON.parse(adminData))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Mock admin login - ready for backend
    if (email === 'admin@example.com' && password === 'admin123') {
      const adminData = {
        id: 'ADMIN001',
        name: 'System Administrator',
        email: email,
        role: 'super_admin'
      }
      const token = 'mock_admin_token_' + Date.now()
      
      localStorage.setItem('adminToken', token)
      localStorage.setItem('adminData', JSON.stringify(adminData))
      setAdmin(adminData)
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
    setAdmin(null)
    navigate('/admin/login')
  }

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}