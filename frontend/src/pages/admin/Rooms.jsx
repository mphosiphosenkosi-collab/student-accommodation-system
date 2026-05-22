// src/pages/admin/Rooms.jsx - Cleaned & Backend Ready
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { adminService } from "../../services/adminService"

function Rooms() {
  const navigate = useNavigate()
  const location = useLocation()
  const [rooms, setRooms] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPropertyId, setSelectedPropertyId] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [tenants, setTenants] = useState([])
  const [formData, setFormData] = useState({
    roomNumber: "",
    type: "Standard",
    floor: "",
    rentAmount: "",
    status: "available"
  })

  // Get propertyId from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const propertyId = params.get("property")
    if (propertyId) {
      setSelectedPropertyId(propertyId)
    }
  }, [location.search])

  // Load data
  useEffect(() => {
    loadData()
  }, [selectedPropertyId])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load properties for filter dropdown
      const propertiesData = await adminService.getProperties()
      setProperties(propertiesData)
      
      // Load rooms (filtered by property if selected)
      let roomsData
      if (selectedPropertyId) {
        roomsData = await adminService.getRooms(selectedPropertyId)
      } else {
        roomsData = await adminService.getRooms()
      }
      setRooms(roomsData)
      
      // Load tenants for assignment dropdown
      const tenantsData = await adminService.getTenants()
      setTenants(tenantsData)
    } catch (error) {
      console.error("Error loading rooms data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      available: { bg: "#10B98120", color: "#10B981", text: "Available" },
      occupied: { bg: "#3B82F620", color: "#3B82F6", text: "Occupied" },
      maintenance: { bg: "#F59E0B20", color: "#F59E0B", text: "Maintenance" }
    }
    return colors[status] || { bg: "#6B728020", color: "#9CA3AF", text: status }
  }

  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.id === propertyId)
    return property ? property.name : "Unknown Property"
  }

  const handleAddRoom = async () => {
    if (!formData.roomNumber || !formData.rentAmount) {
      alert("Please fill in all required fields")
      return
    }

    if (!selectedPropertyId) {
      alert("Please select a property first")
      return
    }

    try {
      const newRoom = await adminService.createRoom({
        propertyId: selectedPropertyId,
        roomNumber: formData.roomNumber,
        type: formData.type,
        floor: parseInt(formData.floor) || 1,
        rentAmount: parseInt(formData.rentAmount),
        status: formData.status
      })
      
      setRooms([...rooms, newRoom])
      setShowAddModal(false)
      resetForm()
      alert("Room added successfully!")
    } catch (error) {
      console.error("Error adding room:", error)
      alert("Failed to add room. Please try again.")
    }
  }

  const handleEditRoom = async () => {
    try {
      const updatedRoom = await adminService.updateRoom(selectedRoom.id, {
        roomNumber: formData.roomNumber,
        type: formData.type,
        floor: parseInt(formData.floor) || 1,
        rentAmount: parseInt(formData.rentAmount),
        status: formData.status
      })
      
      setRooms(rooms.map(r => r.id === selectedRoom.id ? updatedRoom : r))
      setShowEditModal(false)
      resetForm()
      alert("Room updated successfully!")
    } catch (error) {
      console.error("Error updating room:", error)
      alert("Failed to update room. Please try again.")
    }
  }

  const handleDeleteRoom = async (room) => {
    if (window.confirm(`Are you sure you want to delete Room ${room.roomNumber}? This action cannot be undone.`)) {
      try {
        await adminService.deleteRoom(room.id)
        setRooms(rooms.filter(r => r.id !== room.id))
        alert(`Room ${room.roomNumber} has been deleted successfully!`)
      } catch (error) {
        console.error("Error deleting room:", error)
        alert("Failed to delete room. Please try again.")
      }
    }
  }

  const handleAssignTenant = async (room, tenantId) => {
    if (!tenantId) {
      alert("Please select a tenant")
      return
    }

    try {
      const result = await adminService.assignTenantToRoom(room.id, tenantId)
      setRooms(rooms.map(r => r.id === room.id ? result.room : r))
      setShowAssignModal(false)
      setSelectedRoom(null)
      alert(`Tenant assigned to Room ${room.roomNumber} successfully!`)
    } catch (error) {
      console.error("Error assigning tenant:", error)
      alert("Failed to assign tenant. Please try again.")
    }
  }

  const handleVacateRoom = async (room) => {
    if (window.confirm(`Are you sure you want to vacate Room ${room.roomNumber}?`)) {
      try {
        const updatedRoom = await adminService.updateRoom(room.id, {
          status: "available",
          currentTenant: null
        })
        setRooms(rooms.map(r => r.id === room.id ? updatedRoom : r))
        alert(`Room ${room.roomNumber} has been vacated!`)
      } catch (error) {
        console.error("Error vacating room:", error)
        alert("Failed to vacate room. Please try again.")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      roomNumber: "",
      type: "Standard",
      floor: "",
      rentAmount: "",
      status: "available"
    })
    setSelectedRoom(null)
  }

  const openEditModal = (room) => {
    setSelectedRoom(room)
    setFormData({
      roomNumber: room.roomNumber,
      type: room.type,
      floor: room.floor || "",
      rentAmount: room.rentAmount,
      status: room.status
    })
    setShowEditModal(true)
  }

  const openAssignModal = (room) => {
    setSelectedRoom(room)
    setShowAssignModal(true)
  }

  // Filter rooms by property if selected
  const displayedRooms = selectedPropertyId 
    ? rooms.filter(r => r.propertyId === selectedPropertyId)
    : rooms

  // Calculate stats
  const totalRooms = displayedRooms.length
  const availableRooms = displayedRooms.filter(r => r.status === "available").length
  const occupiedRooms = displayedRooms.filter(r => r.status === "occupied").length
  const maintenanceRooms = displayedRooms.filter(r => r.status === "maintenance").length

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading rooms...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Room Management</h1>
          <p style={styles.subtitle}>Manage all rooms across properties</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          style={styles.addButton}
          disabled={!selectedPropertyId}
        >
          + Add New Room
        </button>
      </div>

      {/* Property Filter */}
      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Filter by Property:</label>
          <select 
            style={styles.propertySelect}
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
          >
            <option value="">All Properties</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>
        {!selectedPropertyId && (
          <div style={styles.filterHint}>
            ⚠️ Select a property to add rooms
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.stat}>
          <span>Total Rooms:</span>
          <strong>{totalRooms}</strong>
        </div>
        <div style={styles.stat}>
          <span>Available:</span>
          <strong style={{color: "#10B981"}}>{availableRooms}</strong>
        </div>
        <div style={styles.stat}>
          <span>Occupied:</span>
          <strong style={{color: "#3B82F6"}}>{occupiedRooms}</strong>
        </div>
        <div style={styles.stat}>
          <span>Maintenance:</span>
          <strong style={{color: "#F59E0B"}}>{maintenanceRooms}</strong>
        </div>
      </div>

      {/* Rooms Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableTh}>Room #</th>
              <th style={styles.tableTh}>Property</th>
              <th style={styles.tableTh}>Type</th>
              <th style={styles.tableTh}>Floor</th>
              <th style={styles.tableTh}>Rent Amount</th>
              <th style={styles.tableTh}>Status</th>
              <th style={styles.tableTh}>Current Tenant</th>
              <th style={styles.tableTh}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedRooms.map(room => {
              const status = getStatusColor(room.status)
              return (
                <tr key={room.id} style={styles.tableRow}>
                  <td style={styles.tableTd}>
                    <strong>{room.roomNumber}</strong>
                  </td>
                  <td style={styles.tableTd}>
                    {getPropertyName(room.propertyId)}
                  </td>
                  <td style={styles.tableTd}>{room.type}</td>
                  <td style={styles.tableTd}>{room.floor || "-"}</td>
                  <td style={styles.tableTd}>
                    R {room.rentAmount?.toLocaleString()}
                  </td>
                  <td style={styles.tableTd}>
                    <span style={{
                      ...styles.statusBadge, 
                      background: status.bg, 
                      color: status.color
                    }}>
                      {status.text}
                    </span>
                  </td>
                  <td style={styles.tableTd}>
                    {room.currentTenant?.name || "-"}
                  </td>
                  <td style={styles.tableTd}>
                    <button 
                      onClick={() => openEditModal(room)} 
                      style={styles.editBtn}
                    >
                      Edit
                    </button>
                    {room.status === "available" && (
                      <button 
                        onClick={() => openAssignModal(room)} 
                        style={styles.assignBtn}
                      >
                        Assign
                      </button>
                    )}
                    {room.status === "occupied" && (
                      <button 
                        onClick={() => handleVacateRoom(room)} 
                        style={styles.vacateBtn}
                      >
                        Vacate
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteRoom(room)} 
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {displayedRooms.length === 0 && (
          <div style={styles.noResults}>
            <p>No rooms found. {!selectedPropertyId && "Select a property to view rooms."}</p>
          </div>
        )}
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => {
          setShowAddModal(false)
          resetForm()
        }}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Room</h2>
              <button style={styles.closeButton} onClick={() => {
                setShowAddModal(false)
                resetForm()
              }}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Room Number *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                    placeholder="e.g., 101, A101, Ground-1"
                  />
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Room Type *</label>
                    <select
                      style={styles.select}
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Shared">Shared</option>
                      <option value="Studio">Studio</option>
                    </select>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Floor</label>
                    <input
                      type="number"
                      style={styles.input}
                      value={formData.floor}
                      onChange={(e) => setFormData({...formData, floor: e.target.value})}
                      placeholder="Floor number"
                    />
                  </div>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Rent Amount (R) *</label>
                    <input
                      type="number"
                      style={styles.input}
                      value={formData.rentAmount}
                      onChange={(e) => setFormData({...formData, rentAmount: e.target.value})}
                      placeholder="e.g., 3500"
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Status</label>
                    <select
                      style={styles.select}
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
                
                <div style={styles.infoBox}>
                  <p>📌 This room will be added to: <strong>{getPropertyName(selectedPropertyId)}</strong></p>
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
              <button style={styles.saveButton} onClick={handleAddRoom}>
                Add Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditModal && selectedRoom && (
        <div style={styles.modalOverlay} onClick={() => {
          setShowEditModal(false)
          resetForm()
        }}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Room</h2>
              <button style={styles.closeButton} onClick={() => {
                setShowEditModal(false)
                resetForm()
              }}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Room Number *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                  />
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Room Type *</label>
                    <select
                      style={styles.select}
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Shared">Shared</option>
                      <option value="Studio">Studio</option>
                    </select>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Floor</label>
                    <input
                      type="number"
                      style={styles.input}
                      value={formData.floor}
                      onChange={(e) => setFormData({...formData, floor: e.target.value})}
                    />
                  </div>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Rent Amount (R) *</label>
                    <input
                      type="number"
                      style={styles.input}
                      value={formData.rentAmount}
                      onChange={(e) => setFormData({...formData, rentAmount: e.target.value})}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Status</label>
                    <select
                      style={styles.select}
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
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
              <button style={styles.saveButton} onClick={handleEditRoom}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Tenant Modal */}
      {showAssignModal && selectedRoom && (
        <div style={styles.modalOverlay} onClick={() => {
          setShowAssignModal(false)
          setSelectedRoom(null)
        }}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Assign Tenant to Room {selectedRoom.roomNumber}</h2>
              <button style={styles.closeButton} onClick={() => {
                setShowAssignModal(false)
                setSelectedRoom(null)
              }}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Tenant</label>
                <select
                  style={styles.select}
                  id="tenantSelect"
                  onChange={(e) => {
                    const tenantId = e.target.value
                    if (tenantId) {
                      handleAssignTenant(selectedRoom, tenantId)
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Choose a tenant...</option>
                  {tenants
                    .filter(t => t.status === "active")
                    .map(tenant => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name} - {tenant.studentId} ({tenant.fundingType})
                      </option>
                    ))
                  }
                </select>
              </div>
              
              {tenants.filter(t => t.status === "active").length === 0 && (
                <div style={styles.infoBox}>
                  <p>⚠️ No active tenants available. Please add tenants first.</p>
                </div>
              )}
            </div>
            
            <div style={styles.modalFooter}>
              <button style={styles.cancelButton} onClick={() => {
                setShowAssignModal(false)
                setSelectedRoom(null)
              }}>
                Cancel
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
    fontSize: "clamp(1.5rem, 4vw, 1.8rem)",
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
    transition: "all 0.3s ease",
    ':hover': {
      background: "#7EE8D7",
      transform: "translateY(-2px)"
    },
    ':disabled': {
      opacity: 0.5,
      cursor: "not-allowed"
    }
  },

  filterBar: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },

  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  filterLabel: {
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.8)"
  },

  propertySelect: {
    padding: "10px 15px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.9rem",
    cursor: "pointer",
    minWidth: "200px"
  },

  filterHint: {
    fontSize: "0.85rem",
    color: "#F59E0B",
    padding: "5px 10px",
    background: "rgba(245, 158, 11, 0.1)",
    borderRadius: "8px"
  },

  statsBar: {
    display: "flex",
    gap: "30px",
    padding: "20px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "15px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },

  stat: {
    display: "flex",
    gap: "8px",
    fontSize: "0.95rem"
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
    minWidth: "800px"
  },

  tableHeader: {
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },

  tableTh: {
    textAlign: "left",
    padding: "12px",
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
    padding: "12px",
    fontSize: "0.9rem"
  },

  statusBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
    display: "inline-block"
  },

  editBtn: {
    padding: "6px 12px",
    marginRight: "8px",
    marginBottom: "5px",
    background: "rgba(75, 199, 176, 0.2)",
    border: "none",
    borderRadius: "6px",
    color: "#4BC7B0",
    cursor: "pointer",
    fontSize: "0.8rem",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(75, 199, 176, 0.3)"
    }
  },

  assignBtn: {
    padding: "6px 12px",
    marginRight: "8px",
    marginBottom: "5px",
    background: "rgba(16, 185, 129, 0.2)",
    border: "none",
    borderRadius: "6px",
    color: "#10B981",
    cursor: "pointer",
    fontSize: "0.8rem",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(16, 185, 129, 0.3)"
    }
  },

  vacateBtn: {
    padding: "6px 12px",
    marginRight: "8px",
    marginBottom: "5px",
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

  deleteBtn: {
    padding: "6px 12px",
    marginBottom: "5px",
    background: "rgba(239, 68, 68, 0.2)",
    border: "none",
    borderRadius: "6px",
    color: "#EF4444",
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
    maxWidth: "600px",
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

  select: {
    padding: "10px 12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
    cursor: "pointer"
  },

  infoBox: {
    padding: "12px",
    background: "rgba(75, 199, 176, 0.1)",
    borderRadius: "8px",
    fontSize: "0.85rem",
    color: "#4BC7B0",
    textAlign: "center"
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

export default Rooms