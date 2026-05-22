// src/pages/admin/Tenants.jsx - Cleaned & Backend Ready
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { adminService } from "../../services/adminService"

function Tenants() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [tenants, setTenants] = useState([])
  const [filteredTenants, setFilteredTenants] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [propertyFilter, setPropertyFilter] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState(null)
  const [properties, setProperties] = useState([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    studentId: "",
    idNumber: "",
    property: "",
    roomNumber: "",
    leaseStart: "",
    leaseEnd: "",
    monthlyRent: "",
    status: "active",
    emergencyContact: "",
    emergencyPhone: "",
    notes: ""
  })

  // Load data from service
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load properties and tenants in parallel
      const [propertiesData, tenantsData] = await Promise.all([
        adminService.getProperties(),
        adminService.getTenants()
      ])
      
      setProperties(propertiesData)
      setTenants(tenantsData)
      setFilteredTenants(tenantsData)
    } catch (error) {
      console.error("Error loading tenants data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter tenants based on search, status, and property
  useEffect(() => {
    let filtered = [...tenants]
    
    if (searchTerm) {
      filtered = filtered.filter(tenant => 
        tenant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.phone?.includes(searchTerm)
      )
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(tenant => tenant.status === statusFilter)
    }
    
    if (propertyFilter !== "all") {
      filtered = filtered.filter(tenant => tenant.propertyId === propertyFilter)
    }
    
    setFilteredTenants(filtered)
  }, [searchTerm, statusFilter, propertyFilter, tenants])

  const getStatusColor = (status) => {
    const colors = {
      active: { bg: "#10B98120", color: "#10B981", text: "Active" },
      inactive: { bg: "#6B728020", color: "#9CA3AF", text: "Inactive" },
      overdue: { bg: "#EF444420", color: "#EF4444", text: "Overdue" }
    }
    return colors[status] || colors.active
  }

  const getPaymentStatusColor = (paymentStatus) => {
    const colors = {
      "up-to-date": { bg: "#10B98120", color: "#10B981", text: "Up to Date" },
      pending: { bg: "#F59E0B20", color: "#F59E0B", text: "Pending" },
      overdue: { bg: "#EF444420", color: "#EF4444", text: "Overdue" }
    }
    return colors[paymentStatus] || colors.pending
  }

  const handleAddTenant = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.studentId) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const selectedProperty = properties.find(p => p.id === parseInt(formData.property))
      
      const newTenant = await adminService.createTenant({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        studentId: formData.studentId,
        fundingType: "Private", // Can be updated later
        propertyId: parseInt(formData.property),
        propertyName: selectedProperty?.name,
        roomId: null,
        roomNumber: formData.roomNumber,
        leaseStart: formData.leaseStart,
        leaseEnd: formData.leaseEnd,
        status: "active"
      })
      
      setTenants([...tenants, newTenant])
      setShowAddModal(false)
      resetForm()
      alert("Tenant added successfully!")
    } catch (error) {
      console.error("Error adding tenant:", error)
      alert("Failed to add tenant. Please try again.")
    }
  }

  const handleDeleteTenant = async (tenant) => {
    if (window.confirm(`Are you sure you want to delete ${tenant.name}? This action cannot be undone.`)) {
      try {
        await adminService.deleteTenant(tenant.id)
        setTenants(tenants.filter(t => t.id !== tenant.id))
        alert("Tenant deleted successfully!")
      } catch (error) {
        console.error("Error deleting tenant:", error)
        alert("Failed to delete tenant. Please try again.")
      }
    }
  }

  const handleToggleStatus = async (tenant) => {
    const newStatus = tenant.status === "active" ? "inactive" : "active"
    try {
      const updatedTenant = await adminService.updateTenant(tenant.id, { status: newStatus })
      setTenants(tenants.map(t => t.id === tenant.id ? updatedTenant : t))
      alert(`Tenant ${newStatus === "active" ? "activated" : "deactivated"} successfully!`)
    } catch (error) {
      console.error("Error toggling tenant status:", error)
      alert("Failed to update tenant status. Please try again.")
    }
  }

  const handleSendReminder = (tenant) => {
    // This will be connected to payment service
    alert(`Sending payment reminder to ${tenant.name}`)
  }

  const handleViewDetails = (tenant) => {
    setSelectedTenant(tenant)
    setShowViewModal(true)
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      studentId: "",
      idNumber: "",
      property: "",
      roomNumber: "",
      leaseStart: "",
      leaseEnd: "",
      monthlyRent: "",
      status: "active",
      emergencyContact: "",
      emergencyPhone: "",
      notes: ""
    })
  }

  const getAvailableRooms = () => {
    // This would fetch available rooms for the selected property from rooms service
    // For now, return mock rooms based on property
    if (formData.property) {
      const property = properties.find(p => p.id === parseInt(formData.property))
      if (property) {
        // Mock room numbers - in production, fetch from rooms service
        return ["101", "102", "103", "104", "105", "106", "201", "202", "203"]
      }
    }
    return []
  }

  // Calculate stats
  const totalTenants = tenants.length
  const activeTenants = tenants.filter(t => t.status === "active").length
  const overduePayments = tenants.filter(t => t.paymentStatus === "overdue").length
  const activeRate = totalTenants > 0 ? Math.round((activeTenants / totalTenants) * 100) : 0

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading tenants...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Tenant Management</h1>
          <p style={styles.subtitle}>Manage all tenants across properties</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={styles.addButton}>
          + Add New Tenant
        </button>
      </div>

      {/* Stats Summary */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div>
            <h3 style={styles.statValue}>{totalTenants}</h3>
            <p style={styles.statLabel}>Total Tenants</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div>
            <h3 style={styles.statValue}>{activeTenants}</h3>
            <p style={styles.statLabel}>Active Tenants</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⚠️</div>
          <div>
            <h3 style={styles.statValue}>{overduePayments}</h3>
            <p style={styles.statLabel}>Overdue Payments</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div>
            <h3 style={styles.statValue}>{activeRate}%</h3>
            <p style={styles.statLabel}>Active Rate</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filtersBar}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, student ID, or phone..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={styles.filterGroup}>
          <select 
            style={styles.select}
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
          >
            <option value="all">All Properties</option>
            {properties.map(prop => (
              <option key={prop.id} value={prop.id}>{prop.name}</option>
            ))}
          </select>
          
          <select 
            style={styles.select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Tenants Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableTh}>Tenant</th>
              <th style={styles.tableTh}>Contact</th>
              <th style={styles.tableTh}>Property/Room</th>
              <th style={styles.tableTh}>Monthly Rent</th>
              <th style={styles.tableTh}>Lease Period</th>
              <th style={styles.tableTh}>Payment Status</th>
              <th style={styles.tableTh}>Tenant Status</th>
              <th style={styles.tableTh}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map(tenant => {
              const status = getStatusColor(tenant.status)
              const paymentStatus = getPaymentStatusColor(tenant.paymentStatus)
              const nameParts = tenant.name?.split(" ") || ["", ""]
              
              return (
                <tr key={tenant.id} style={styles.tableRow}>
                  <td style={styles.tableTd}>
                    <div style={styles.tenantInfo}>
                      <div style={styles.tenantAvatar}>
                        {nameParts[0]?.[0]}{nameParts[1]?.[0]}
                      </div>
                      <div>
                        <strong>{tenant.name}</strong>
                        <br />
                        <span style={styles.tenantId}>ID: {tenant.studentId}</span>
                      </div>
                    </div>
                   </td>
                  <td style={styles.tableTd}>
                    {tenant.email}<br />
                    <span style={styles.phoneNumber}>{tenant.phone}</span>
                   </td>
                  <td style={styles.tableTd}>
                    <strong>{tenant.propertyName}</strong><br />
                    <span style={styles.roomNumber}>Room {tenant.roomNumber || "Not assigned"}</span>
                   </td>
                  <td style={styles.tableTd}>
                    <strong>R {tenant.monthlyRent?.toLocaleString() || "N/A"}</strong>
                   </td>
                  <td style={styles.tableTd}>
                    {tenant.leaseStart ? new Date(tenant.leaseStart).toLocaleDateString() : "N/A"}<br />
                    <span style={styles.leaseEnd}>
                      to {tenant.leaseEnd ? new Date(tenant.leaseEnd).toLocaleDateString() : "N/A"}
                    </span>
                   </td>
                  <td style={styles.tableTd}>
                    <span style={{...styles.statusBadge, background: paymentStatus.bg, color: paymentStatus.color}}>
                      {paymentStatus.text}
                    </span>
                   </td>
                  <td style={styles.tableTd}>
                    <span style={{...styles.statusBadge, background: status.bg, color: status.color}}>
                      {status.text}
                    </span>
                   </td>
                  <td style={styles.tableTd}>
                    <button onClick={() => handleViewDetails(tenant)} style={styles.viewBtn}>
                      View
                    </button>
                    {tenant.paymentStatus === "overdue" && (
                      <button onClick={() => handleSendReminder(tenant)} style={styles.reminderBtn}>
                        Remind
                      </button>
                    )}
                    <button 
                      onClick={() => handleToggleStatus(tenant)} 
                      style={{...styles.actionBtn, background: "rgba(245, 158, 11, 0.2)", color: "#F59E0B"}}
                    >
                      {tenant.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                    <button 
                      onClick={() => handleDeleteTenant(tenant)} 
                      style={{...styles.actionBtn, background: "rgba(239, 68, 68, 0.2)", color: "#EF4444"}}
                    >
                      Delete
                    </button>
                   </td>
                 </tr>
              )
            })}
          </tbody>
        </table>
        
        {filteredTenants.length === 0 && (
          <div style={styles.noResults}>
            <p>No tenants found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Add Tenant Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => {
          setShowAddModal(false)
          resetForm()
        }}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Tenant</h2>
              <button style={styles.closeButton} onClick={() => {
                setShowAddModal(false)
                resetForm()
              }}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.formGrid}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>First Name *</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      placeholder="First name"
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Last Name *</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Last name"
                    />
                  </div>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email *</label>
                    <input
                      type="email"
                      style={styles.input}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="tenant@student.ac.za"
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone *</label>
                    <input
                      type="tel"
                      style={styles.input}
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+27 71 234 5678"
                    />
                  </div>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Student ID *</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={formData.studentId}
                      onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                      placeholder="STU2024001"
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>ID Number</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={formData.idNumber}
                      onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                      placeholder="ID number"
                    />
                  </div>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Property *</label>
                    <select
                      style={styles.select}
                      value={formData.property}
                      onChange={(e) => setFormData({...formData, property: e.target.value, roomNumber: ""})}
                    >
                      <option value="">Select Property</option>
                      {properties.map(prop => (
                        <option key={prop.id} value={prop.id}>{prop.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Room Number</label>
                    <select
                      style={styles.select}
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                      disabled={!formData.property}
                    >
                      <option value="">Select Room (Optional)</option>
                      {getAvailableRooms().map(room => (
                        <option key={room} value={room}>{room}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Lease Start Date</label>
                    <input
                      type="date"
                      style={styles.input}
                      value={formData.leaseStart}
                      onChange={(e) => setFormData({...formData, leaseStart: e.target.value})}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Lease End Date</label>
                    <input
                      type="date"
                      style={styles.input}
                      value={formData.leaseEnd}
                      onChange={(e) => setFormData({...formData, leaseEnd: e.target.value})}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Monthly Rent (R)</label>
                    <input
                      type="number"
                      style={styles.input}
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData({...formData, monthlyRent: e.target.value})}
                      placeholder="4500"
                    />
                  </div>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Emergency Contact Name</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                      placeholder="Full name"
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Emergency Contact Phone</label>
                    <input
                      type="tel"
                      style={styles.input}
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                      placeholder="+27 82 123 4567"
                    />
                  </div>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Notes</label>
                  <textarea
                    style={styles.textarea}
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Any additional notes about the tenant..."
                  />
                </div>
              </div>
            </div>
            
            <div style={styles.modalFooter}>
              <button style={styles.cancelButton} onClick={() => {
                setShowAddModal(false)
                resetForm()
              }}>
                Cancel
              </button>
              <button style={styles.saveButton} onClick={handleAddTenant}>
                Add Tenant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Tenant Modal */}
      {showViewModal && selectedTenant && (
        <div style={styles.modalOverlay} onClick={() => setShowViewModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Tenant Details</h2>
              <button style={styles.closeButton} onClick={() => setShowViewModal(false)}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.viewHeader}>
                <div style={styles.viewAvatar}>
                  {selectedTenant.name?.split(" ").map(n => n[0]).join("") || "T"}
                </div>
                <div>
                  <h3 style={styles.viewName}>{selectedTenant.name}</h3>
                  <p style={styles.viewStudentId}>Student ID: {selectedTenant.studentId}</p>
                </div>
              </div>
              
              <div style={styles.detailsGrid}>
                <div style={styles.detailSection}>
                  <h4 style={styles.sectionTitle}>Contact Information</h4>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Email:</span>
                    <span>{selectedTenant.email}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Phone:</span>
                    <span>{selectedTenant.phone}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Student ID:</span>
                    <span>{selectedTenant.studentId}</span>
                  </div>
                </div>
                
                <div style={styles.detailSection}>
                  <h4 style={styles.sectionTitle}>Accommodation Details</h4>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Property:</span>
                    <span>{selectedTenant.propertyName}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Room Number:</span>
                    <span>{selectedTenant.roomNumber || "Not assigned"}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Funding Type:</span>
                    <span>{selectedTenant.fundingType || "Private"}</span>
                  </div>
                </div>
                
                <div style={styles.detailSection}>
                  <h4 style={styles.sectionTitle}>Lease Information</h4>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Lease Start:</span>
                    <span>{selectedTenant.leaseStart ? new Date(selectedTenant.leaseStart).toLocaleDateString() : "N/A"}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Lease End:</span>
                    <span>{selectedTenant.leaseEnd ? new Date(selectedTenant.leaseEnd).toLocaleDateString() : "N/A"}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Status:</span>
                    <span style={{color: selectedTenant.status === "active" ? "#10B981" : "#EF4444"}}>
                      {selectedTenant.status}
                    </span>
                  </div>
                </div>
                
                <div style={styles.detailSection}>
                  <h4 style={styles.sectionTitle}>Payment Information</h4>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Monthly Rent:</span>
                    <span>R {selectedTenant.monthlyRent?.toLocaleString() || "N/A"}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Payment Status:</span>
                    <span style={{color: selectedTenant.paymentStatus === "up-to-date" ? "#10B981" : "#F59E0B"}}>
                      {selectedTenant.paymentStatus || "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={styles.modalFooter}>
              <button style={styles.cancelButton} onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button 
                style={styles.saveButton} 
                onClick={() => {
                  setShowViewModal(false)
                  navigate("/admin/payments")
                }}
              >
                View Payments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "30px",
    color: "#fff"
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    color: "#fff"
  },

  loader: {
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
    color: "rgba(255,255,255,0.8)"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px"
  },

  title: {
    fontSize: "clamp(1.5rem, 4vw, 2rem)",
    fontWeight: "700",
    marginBottom: "8px"
  },

  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "0.95rem"
  },

  addButton: {
    padding: "12px 24px",
    background: "#4BC7B0",
    color: "#065A63",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    ':hover': {
      background: "#7EE8D7",
      transform: "translateY(-2px)"
    }
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  },

  statCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    border: "1px solid rgba(255,255,255,0.1)"
  },

  statIcon: {
    fontSize: "32px"
  },

  statValue: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "5px"
  },

  statLabel: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)"
  },

  filtersBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "30px"
  },

  searchBox: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "10px 15px",
    maxWidth: "400px"
  },

  searchIcon: {
    marginRight: "10px",
    fontSize: "16px"
  },

  searchInput: {
    flex: 1,
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
    '::placeholder': {
      color: "rgba(255,255,255,0.5)"
    }
  },

  filterGroup: {
    display: "flex",
    gap: "10px"
  },

  select: {
    padding: "8px 12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.85rem",
    cursor: "pointer"
  },

  tableContainer: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: "15px",
    padding: "20px",
    overflowX: "auto"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1000px"
  },

  tableHeader: {
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },

  tableTh: {
    textAlign: "left",
    padding: "15px 12px",
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500"
  },

  tableRow: {
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    ':hover': {
      background: "rgba(255,255,255,0.03)"
    }
  },

  tableTd: {
    padding: "15px 12px",
    fontSize: "0.9rem"
  },

  tenantInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },

  tenantAvatar: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #4BC7B0, #2FA7A0)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "16px"
  },

  tenantId: {
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.5)"
  },

  phoneNumber: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.6)"
  },

  roomNumber: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.6)"
  },

  leaseEnd: {
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.5)"
  },

  statusBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
    display: "inline-block"
  },

  viewBtn: {
    padding: "6px 12px",
    marginRight: "6px",
    background: "rgba(59, 130, 246, 0.2)",
    border: "none",
    borderRadius: "6px",
    color: "#3B82F6",
    cursor: "pointer",
    fontSize: "0.8rem",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(59, 130, 246, 0.3)"
    }
  },

  reminderBtn: {
    padding: "6px 12px",
    marginRight: "6px",
    background: "rgba(245, 158, 11, 0.2)",
    border: "none",
    borderRadius: "6px",
    color: "#F59E0B",
    cursor: "pointer",
    fontSize: "0.8rem",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(245, 158, 11, 0.3)"
    }
  },

  actionBtn: {
    padding: "6px 12px",
    marginRight: "6px",
    background: "rgba(239, 68, 68, 0.2)",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.8rem",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(239, 68, 68, 0.3)"
    }
  },

  noResults: {
    textAlign: "center",
    padding: "50px",
    color: "rgba(255,255,255,0.6)"
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },

  modal: {
    background: "linear-gradient(135deg, #065A63 0%, #0B6B73 100%)",
    borderRadius: "20px",
    maxWidth: "900px",
    width: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
    border: "1px solid rgba(255,255,255,0.2)"
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "25px 25px 15px 25px",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },

  modalTitle: {
    fontSize: "1.3rem",
    fontWeight: "600"
  },

  closeButton: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "24px",
    cursor: "pointer"
  },

  modalBody: {
    padding: "25px"
  },

  formGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  formRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px"
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },

  label: {
    fontSize: "0.85rem",
    fontWeight: "500",
    color: "rgba(255,255,255,0.9)"
  },

  input: {
    padding: "10px 12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
    '::placeholder': {
      color: "rgba(255,255,255,0.5)"
    }
  },

  textarea: {
    padding: "10px 12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit"
  },

  modalFooter: {
    padding: "20px 25px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end"
  },

  cancelButton: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer"
  },

  saveButton: {
    padding: "10px 20px",
    background: "#4BC7B0",
    color: "#065A63",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer"
  },

  viewHeader: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },

  viewAvatar: {
    width: "70px",
    height: "70px",
    background: "linear-gradient(135deg, #4BC7B0, #2FA7A0)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold"
  },

  viewName: {
    fontSize: "1.3rem",
    fontWeight: "700",
    marginBottom: "5px"
  },

  viewStudentId: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)"
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px"
  },

  detailSection: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    padding: "15px"
  },

  sectionTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#4BC7B0"
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)"
  },

  detailLabel: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)"
  },

  notes: {
    fontSize: "0.9rem",
    lineHeight: "1.5",
    color: "rgba(255,255,255,0.8)"
  }
}

// Add keyframes
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
document.head.appendChild(styleSheet)

export default Tenants