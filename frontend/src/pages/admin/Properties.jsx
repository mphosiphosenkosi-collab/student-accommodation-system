// src/pages/admin/Properties.jsx - Cleaned & Backend Ready
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { adminService } from "../../services/adminService"

function Properties() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactPerson: "",
    phone: "",
    email: "",
    totalRooms: "",
    amenities: []
  })

  const amenitiesList = ["WiFi", "Parking", "Security", "Laundry", "Gym", "Study Room", "Common Area", "Kitchen", "Pool", "Backup Power"]

  // Load properties from service
  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    setLoading(true)
    try {
      const data = await adminService.getProperties()
      setProperties(data)
      setFilteredProperties(data)
    } catch (error) {
      console.error("Error loading properties:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter properties based on search and status
  useEffect(() => {
    let filtered = [...properties]
    
    if (searchTerm) {
      filtered = filtered.filter(property => 
        property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(property => property.status === statusFilter)
    }
    
    setFilteredProperties(filtered)
  }, [searchTerm, statusFilter, properties])

  const getStatusColor = (status) => {
    const colors = {
      active: { bg: "#10B98120", color: "#10B981", text: "Active" },
      maintenance: { bg: "#F59E0B20", color: "#F59E0B", text: "Maintenance" },
      inactive: { bg: "#6B728020", color: "#9CA3AF", text: "Inactive" }
    }
    return colors[status] || colors.inactive
  }

  const handleAddProperty = async () => {
    if (!formData.name || !formData.address || !formData.totalRooms) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const newProperty = await adminService.createProperty({
        name: formData.name,
        address: formData.address,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        totalRooms: parseInt(formData.totalRooms),
        amenities: formData.amenities
      })
      
      setProperties([...properties, newProperty])
      setShowAddModal(false)
      resetForm()
      alert("Property added successfully!")
    } catch (error) {
      console.error("Error adding property:", error)
      alert("Failed to add property. Please try again.")
    }
  }

  const handleEditProperty = async () => {
    try {
      const updatedProperty = await adminService.updateProperty(selectedProperty.id, {
        name: formData.name,
        address: formData.address,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        totalRooms: parseInt(formData.totalRooms),
        amenities: formData.amenities,
        status: formData.status
      })
      
      setProperties(properties.map(p => p.id === selectedProperty.id ? updatedProperty : p))
      setShowEditModal(false)
      resetForm()
      alert("Property updated successfully!")
    } catch (error) {
      console.error("Error updating property:", error)
      alert("Failed to update property. Please try again.")
    }
  }

  const handleDeleteProperty = async (property) => {
    if (window.confirm(`Are you sure you want to delete ${property.name}? This action cannot be undone.`)) {
      try {
        await adminService.deleteProperty(property.id)
        setProperties(properties.filter(p => p.id !== property.id))
        alert(`${property.name} has been deleted successfully!`)
      } catch (error) {
        console.error("Error deleting property:", error)
        alert("Failed to delete property. Please try again.")
      }
    }
  }

  const handleToggleStatus = async (property) => {
    const newStatus = property.status === "active" ? "inactive" : "active"
    try {
      const updatedProperty = await adminService.updateProperty(property.id, { status: newStatus })
      setProperties(properties.map(p => p.id === property.id ? updatedProperty : p))
      alert(`Property ${newStatus === "active" ? "activated" : "deactivated"} successfully!`)
    } catch (error) {
      console.error("Error toggling status:", error)
      alert("Failed to update property status. Please try again.")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      contactPerson: "",
      phone: "",
      email: "",
      totalRooms: "",
      amenities: []
    })
    setSelectedProperty(null)
  }

  const openEditModal = (property) => {
    setSelectedProperty(property)
    setFormData({
      name: property.name,
      address: property.address || "",
      contactPerson: property.contactPerson || "",
      phone: property.phone || "",
      email: property.email || "",
      totalRooms: property.totalRooms,
      amenities: property.amenities || [],
      status: property.status
    })
    setShowEditModal(true)
  }

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleViewRooms = (propertyId) => {
    navigate(`/admin/rooms?property=${propertyId}`)
  }

  // Calculate stats
  const totalProperties = properties.length
  const totalRooms = properties.reduce((sum, p) => sum + (p.totalRooms || 0), 0)
  const occupiedRooms = properties.reduce((sum, p) => sum + ((p.totalRooms || 0) - (p.availableRooms || 0)), 0)
  const avgOccupancy = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading properties...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Property Management</h1>
          <p style={styles.subtitle}>Manage all student accommodation properties</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={styles.addButton}>
          + Add New Property
        </button>
      </div>

      {/* Stats Summary */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏠</div>
          <div>
            <h3 style={styles.statValue}>{totalProperties}</h3>
            <p style={styles.statLabel}>Total Properties</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🚪</div>
          <div>
            <h3 style={styles.statValue}>{totalRooms}</h3>
            <p style={styles.statLabel}>Total Rooms</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div>
            <h3 style={styles.statValue}>{occupiedRooms}</h3>
            <p style={styles.statLabel}>Occupied Rooms</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div>
            <h3 style={styles.statValue}>{avgOccupancy}%</h3>
            <p style={styles.statLabel}>Avg Occupancy</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filtersBar}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by property name or address..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={styles.filterButtons}>
          <button 
            onClick={() => setStatusFilter("all")}
            style={{...styles.filterButton, background: statusFilter === "all" ? "#4BC7B0" : "rgba(255,255,255,0.1)", color: statusFilter === "all" ? "#065A63" : "#fff"}}
          >
            All
          </button>
          <button 
            onClick={() => setStatusFilter("active")}
            style={{...styles.filterButton, background: statusFilter === "active" ? "#10B981" : "rgba(255,255,255,0.1)"}}
          >
            Active
          </button>
          <button 
            onClick={() => setStatusFilter("maintenance")}
            style={{...styles.filterButton, background: statusFilter === "maintenance" ? "#F59E0B" : "rgba(255,255,255,0.1)"}}
          >
            Maintenance
          </button>
          <button 
            onClick={() => setStatusFilter("inactive")}
            style={{...styles.filterButton, background: statusFilter === "inactive" ? "#6B7280" : "rgba(255,255,255,0.1)"}}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div style={styles.propertiesGrid}>
        {filteredProperties.map(property => {
          const status = getStatusColor(property.status)
          const occupancyRate = property.totalRooms > 0 
            ? Math.round(((property.totalRooms - (property.availableRooms || 0)) / property.totalRooms) * 100)
            : 0
          
          return (
            <div key={property.id} style={styles.propertyCard}>
              <div style={styles.propertyImage}>
                <span style={styles.propertyImagePlaceholder}>🏠</span>
                <div style={{...styles.statusBadge, background: status.bg, color: status.color}}>
                  {status.text}
                </div>
              </div>
              
              <div style={styles.propertyContent}>
                <h3 style={styles.propertyName}>{property.name}</h3>
                <p style={styles.propertyAddress}>{property.address}</p>
                
                <div style={styles.propertyStats}>
                  <div style={styles.stat}>
                    <span>🚪</span>
                    <span>{(property.totalRooms - (property.availableRooms || 0))}/{property.totalRooms} rooms</span>
                  </div>
                  <div style={styles.stat}>
                    <span>📊</span>
                    <span>{occupancyRate}% occupied</span>
                  </div>
                </div>
                
                <div style={styles.amenities}>
                  {property.amenities?.slice(0, 4).map((amenity, idx) => (
                    <span key={idx} style={styles.amenityTag}>{amenity}</span>
                  ))}
                  {property.amenities?.length > 4 && (
                    <span style={styles.amenityTag}>+{property.amenities.length - 4}</span>
                  )}
                </div>
                
                <div style={styles.contactInfo}>
                  {property.contactPerson && (
                    <span style={styles.contactText}>👤 {property.contactPerson}</span>
                  )}
                  {property.phone && (
                    <span style={styles.contactText}>📞 {property.phone}</span>
                  )}
                </div>
                
                <div style={styles.propertyActions}>
                  <button onClick={() => handleViewRooms(property.id)} style={styles.actionBtn}>
                    View Rooms
                  </button>
                  <button onClick={() => openEditModal(property)} style={{...styles.actionBtn, background: "rgba(59, 130, 246, 0.2)", color: "#3B82F6"}}>
                    Edit
                  </button>
                  <button onClick={() => handleToggleStatus(property)} style={{...styles.actionBtn, background: "rgba(245, 158, 11, 0.2)", color: "#F59E0B"}}>
                    {property.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => handleDeleteProperty(property)} style={{...styles.actionBtn, background: "rgba(239, 68, 68, 0.2)", color: "#EF4444"}}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredProperties.length === 0 && (
        <div style={styles.noResults}>
          <p>No properties found matching your criteria</p>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => {
          setShowAddModal(false)
          resetForm()
        }}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Property</h2>
              <button style={styles.closeButton} onClick={() => {
                setShowAddModal(false)
                resetForm()
              }}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Property Name *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Mbombela Heights"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Address *</label>
                  <textarea
                    style={styles.textarea}
                    rows="2"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="124 Samora Machel Drive, Mbombela"
                  />
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Total Rooms *</label>
                    <input
                      type="number"
                      style={styles.input}
                      value={formData.totalRooms}
                      onChange={(e) => setFormData({...formData, totalRooms: e.target.value})}
                      placeholder="e.g., 12"
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Contact Person</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                      placeholder="Property manager name"
                    />
                  </div>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Contact Phone</label>
                    <input
                      type="tel"
                      style={styles.input}
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+27 13 123 4567"
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Contact Email</label>
                    <input
                      type="email"
                      style={styles.input}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="info@property.co.za"
                    />
                  </div>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Amenities</label>
                  <div style={styles.amenitiesGrid}>
                    {amenitiesList.map(amenity => (
                      <label key={amenity} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                        />
                        <span>{amenity}</span>
                      </label>
                    ))}
                  </div>
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
              <button style={styles.saveButton} onClick={handleAddProperty}>
                Add Property
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Property Modal */}
      {showEditModal && selectedProperty && (
        <div style={styles.modalOverlay} onClick={() => {
          setShowEditModal(false)
          resetForm()
        }}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Property</h2>
              <button style={styles.closeButton} onClick={() => {
                setShowEditModal(false)
                resetForm()
              }}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Property Name *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Address *</label>
                  <textarea
                    style={styles.textarea}
                    rows="2"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Total Rooms *</label>
                    <input
                      type="number"
                      style={styles.input}
                      value={formData.totalRooms}
                      onChange={(e) => setFormData({...formData, totalRooms: e.target.value})}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Status</label>
                    <select
                      style={styles.select}
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Contact Person</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Contact Phone</label>
                    <input
                      type="tel"
                      style={styles.input}
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Contact Email</label>
                  <input
                    type="email"
                    style={styles.input}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Amenities</label>
                  <div style={styles.amenitiesGrid}>
                    {amenitiesList.map(amenity => (
                      <label key={amenity} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                        />
                        <span>{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={styles.modalFooter}>
              <button style={styles.cancelButton} onClick={() => {
                setShowEditModal(false)
                resetForm()
              }}>
                Cancel
              </button>
              <button style={styles.saveButton} onClick={handleEditProperty}>
                Save Changes
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

  filterButtons: {
    display: "flex",
    gap: "10px"
  },

  filterButton: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.3s ease"
  },

  propertiesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: "25px"
  },

  propertyCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "transform 0.3s ease",
    ':hover': {
      transform: "translateY(-5px)"
    }
  },

  propertyImage: {
    height: "140px",
    background: "linear-gradient(135deg, #4BC7B0, #2FA7A0)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  propertyImagePlaceholder: {
    fontSize: "50px"
  },

  statusBadge: {
    position: "absolute",
    top: "15px",
    right: "15px",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600"
  },

  propertyContent: {
    padding: "20px"
  },

  propertyName: {
    fontSize: "1.2rem",
    fontWeight: "700",
    marginBottom: "8px"
  },

  propertyAddress: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.6)",
    marginBottom: "15px",
    lineHeight: "1.4"
  },

  propertyStats: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
    padding: "10px 0",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },

  stat: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "0.85rem"
  },

  amenities: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "15px"
  },

  amenityTag: {
    padding: "4px 10px",
    background: "rgba(75, 199, 176, 0.2)",
    borderRadius: "12px",
    fontSize: "0.75rem",
    color: "#4BC7B0"
  },

  contactInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginBottom: "15px",
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.5)"
  },

  contactText: {
    display: "inline-block"
  },

  propertyActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },

  actionBtn: {
    flex: 1,
    padding: "8px 12px",
    background: "rgba(255,255,255,0.1)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.8rem",
    transition: "all 0.3s ease",
    ':hover': {
      transform: "scale(0.98)"
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
    maxWidth: "800px",
    width: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
    border: "1px solid rgba(255,255,255,0.2)"
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 25px",
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

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },

  formRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px"
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
    fontFamily: "inherit",
    '::placeholder': {
      color: "rgba(255,255,255,0.5)"
    }
  },

  select: {
    padding: "10px 12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none"
  },

  amenitiesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "10px"
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.85rem",
    cursor: "pointer"
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

export default Properties