import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function TenantProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      studentId: "",
      idNumber: "",
      dateOfBirth: ""
    },
    addressInfo: {
      street: "",
      city: "",
      postalCode: "",
      country: "South Africa"
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      email: ""
    },
    accommodation: {
      propertyName: "",
      roomNumber: "",
      leaseStart: "",
      leaseEnd: ""
    },
    bankDetails: {
      bankName: "",
      accountHolder: "",
      accountNumber: "",
      branchCode: ""
    }
  })

  useEffect(() => {
    // Mock API call - replace with actual API
    setTimeout(() => {
      setProfileData({
        personalInfo: {
          firstName: "Thabo",
          lastName: "Mbeki",
          email: "thabo.mbeki@student.ac.za",
          phone: "+27 71 234 5678",
          studentId: "STU2024001",
          idNumber: "900101 5084 089",
          dateOfBirth: "1990-01-01"
        },
        addressInfo: {
          street: "123 Main Street, Benoni",
          city: "Gauteng",
          postalCode: "1501",
          country: "South Africa"
        },
        emergencyContact: {
          name: "Mary Mbeki",
          relationship: "Mother",
          phone: "+27 82 123 4567",
          email: "mary.mbeki@family.co.za"
        },
        accommodation: {
          propertyName: "Urban Heights Residence",
          roomNumber: "Room 408",
          leaseStart: "2024-01-15",
          leaseEnd: "2024-12-15"
        },
        bankDetails: {
          bankName: "Standard Bank",
          accountHolder: "Thabo Mbeki",
          accountNumber: "****1234",
          branchCode: "051001"
        }
      })
      setLoading(false)
    }, 1000)
  }, [])

  const handleInputChange = (section, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSave = () => {
    setLoading(true)
    console.log("Saving profile data:", profileData)
    setTimeout(() => {
      setLoading(false)
      setEditing(false)
      alert("Profile updated successfully!")
    }, 1000)
  }

  const handleCancel = () => {
    setEditing(false)
    window.location.reload()
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading profile...</p>
      </div>
    )
  }

  return (
    <div style={styles.profileContainer}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Profile</h1>
          <p style={styles.subtitle}>Manage your personal information and preferences</p>
        </div>
        <div style={styles.headerActions}>
          {!editing ? (
            <button 
              style={styles.editButton}
              onClick={() => setEditing(true)}
            >
               Edit Profile
            </button>
          ) : (
            <div style={styles.editActions}>
              <button 
                style={styles.cancelButton}
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                style={styles.saveButton}
                onClick={handleSave}
              >
                 Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Creative Masonry Grid Layout */}
      <div style={styles.profileGrid}>
        
        {/* Personal Information - Large Card */}
        <div style={{...styles.card, ...styles.cardLarge}}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>👤</span>
            <h2 style={styles.cardTitle}>Personal Information</h2>
          </div>
          <div style={styles.formGroup}>
            <div style={styles.formRow}>
              <div style={styles.formField}>
                <label style={styles.label}>First Name</label>
                {editing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={profileData.personalInfo.firstName}
                    onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{profileData.personalInfo.firstName}</p>
                )}
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Last Name</label>
                {editing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={profileData.personalInfo.lastName}
                    onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{profileData.personalInfo.lastName}</p>
                )}
              </div>
            </div>
            
            <div style={styles.formRow}>
              <div style={styles.formField}>
                <label style={styles.label}>Email Address</label>
                {editing ? (
                  <input
                    type="email"
                    style={styles.input}
                    value={profileData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{profileData.personalInfo.email}</p>
                )}
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Phone Number</label>
                {editing ? (
                  <input
                    type="tel"
                    style={styles.input}
                    value={profileData.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{profileData.personalInfo.phone}</p>
                )}
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formField}>
                <label style={styles.label}>Student ID</label>
                {editing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={profileData.personalInfo.studentId}
                    onChange={(e) => handleInputChange('personalInfo', 'studentId', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{profileData.personalInfo.studentId}</p>
                )}
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>ID Number</label>
                {editing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={profileData.personalInfo.idNumber}
                    onChange={(e) => handleInputChange('personalInfo', 'idNumber', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{profileData.personalInfo.idNumber}</p>
                )}
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formField}>
                <label style={styles.label}>Date of Birth</label>
                {editing ? (
                  <input
                    type="date"
                    style={styles.input}
                    value={profileData.personalInfo.dateOfBirth}
                    onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{new Date(profileData.personalInfo.dateOfBirth).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Accommodation Details - Highlight Card */}
        <div style={{...styles.card, ...styles.cardHighlight}}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Current Accommodation</h2>
          </div>
          <div style={styles.formGroup}>
            <div style={styles.statRow}>
              <div style={styles.statItem}>
                <div style={styles.statLabel}>Property</div>
                <div style={styles.statValue}>{profileData.accommodation.propertyName}</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statLabel}>Room</div>
                <div style={styles.statValue}>{profileData.accommodation.roomNumber}</div>
              </div>
            </div>
            <div style={styles.leaseInfo}>
              <div style={styles.leasePeriod}>
                <span> Lease Period</span>
                <strong>{new Date(profileData.accommodation.leaseStart).toLocaleDateString()} - {new Date(profileData.accommodation.leaseEnd).toLocaleDateString()}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Address Information</h2>
          </div>
          <div style={styles.formGroup}>
            <div style={styles.formField}>
              <label style={styles.label}>Street Address</label>
              {editing ? (
                <input
                  type="text"
                  style={styles.input}
                  value={profileData.addressInfo.street}
                  onChange={(e) => handleInputChange('addressInfo', 'street', e.target.value)}
                />
              ) : (
                <p style={styles.value}>{profileData.addressInfo.street}</p>
              )}
            </div>
            
            <div style={styles.formRow}>
              <div style={styles.formField}>
                <label style={styles.label}>City</label>
                {editing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={profileData.addressInfo.city}
                    onChange={(e) => handleInputChange('addressInfo', 'city', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{profileData.addressInfo.city}</p>
                )}
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Postal Code</label>
                {editing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={profileData.addressInfo.postalCode}
                    onChange={(e) => handleInputChange('addressInfo', 'postalCode', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{profileData.addressInfo.postalCode}</p>
                )}
              </div>
            </div>

            <div style={styles.formField}>
              <label style={styles.label}>Country</label>
              {editing ? (
                <select
                  style={styles.select}
                  value={profileData.addressInfo.country}
                  onChange={(e) => handleInputChange('addressInfo', 'country', e.target.value)}
                >
                  <option value="South Africa">South Africa</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Namibia">Namibia</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                </select>
              ) : (
                <p style={styles.value}>{profileData.addressInfo.country}</p>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Emergency Contact</h2>
          </div>
          <div style={styles.formGroup}>
            <div style={styles.formRow}>
              <div style={styles.formField}>
                <label style={styles.label}>Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={profileData.emergencyContact.name}
                    onChange={(e) => handleInputChange('emergencyContact', 'name', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{profileData.emergencyContact.name}</p>
                )}
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Relationship</label>
                {editing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={profileData.emergencyContact.relationship}
                    onChange={(e) => handleInputChange('emergencyContact', 'relationship', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{profileData.emergencyContact.relationship}</p>
                )}
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formField}>
                <label style={styles.label}>Phone Number</label>
                {editing ? (
                  <input
                    type="tel"
                    style={styles.input}
                    value={profileData.emergencyContact.phone}
                    onChange={(e) => handleInputChange('emergencyContact', 'phone', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{profileData.emergencyContact.phone}</p>
                )}
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Email Address</label>
                {editing ? (
                  <input
                    type="email"
                    style={styles.input}
                    value={profileData.emergencyContact.email}
                    onChange={(e) => handleInputChange('emergencyContact', 'email', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{profileData.emergencyContact.email}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Bank Details</h2>
          </div>
          <div style={styles.formGroup}>
            <div style={styles.formRow}>
              <div style={styles.formField}>
                <label style={styles.label}>Bank Name</label>
                {editing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={profileData.bankDetails.bankName}
                    onChange={(e) => handleInputChange('bankDetails', 'bankName', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{profileData.bankDetails.bankName || "Not provided"}</p>
                )}
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Account Holder</label>
                {editing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={profileData.bankDetails.accountHolder}
                    onChange={(e) => handleInputChange('bankDetails', 'accountHolder', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{profileData.bankDetails.accountHolder || "Not provided"}</p>
                )}
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formField}>
                <label style={styles.label}>Account Number</label>
                {editing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={profileData.bankDetails.accountNumber}
                    onChange={(e) => handleInputChange('bankDetails', 'accountNumber', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{profileData.bankDetails.accountNumber || "Not provided"}</p>
                )}
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Branch Code</label>
                {editing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={profileData.bankDetails.branchCode}
                    onChange={(e) => handleInputChange('bankDetails', 'branchCode', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{profileData.bankDetails.branchCode || "Not provided"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div style={{...styles.card, ...styles.cardStats}}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Quick Stats</h2>
          </div>
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <div style={styles.statNumber}>12</div>
              <div style={styles.statDesc}>Months Active</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statNumber}>100%</div>
              <div style={styles.statDesc}>Payment Rate</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statNumber}>2</div>
              <div style={styles.statDesc}>Maintenance Requests</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

const styles = {
  profileContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #065A63 0%, #0B6B73 100%)",
    padding: "30px",
    color: "#fff"
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #065A63 0%, #0B6B73 100%)",
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

  headerActions: {
    display: "flex",
    gap: "15px"
  },

  editButton: {
    padding: "12px 24px",
    background: "#4BC7B0",
    color: "#065A63",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "transform 0.2s"
  },

  editActions: {
    display: "flex",
    gap: "12px"
  },

  cancelButton: {
    padding: "12px 24px",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.95rem"
  },

  saveButton: {
    padding: "12px 24px",
    background: "#4BC7B0",
    color: "#065A63",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.95rem"
  },

  // Creative Masonry Grid - Different card sizes
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "25px",
    gridAutoFlow: "dense"
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "25px",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease"
  },

  // Large card spans 2 columns
  cardLarge: {
    gridColumn: "span 2",
    background: "rgba(255,255,255,0.1)"
  },

  // Highlight card with different style
  cardHighlight: {
    background: "rgba(75, 199, 176, 0.15)",
    border: "1px solid rgba(75, 199, 176, 0.3)"
  },

  // Stats card
  cardStats: {
    background: "rgba(255,255,255,0.05)"
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },

  cardIcon: {
    fontSize: "24px"
  },

  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    flex: 1
  },

  optionalBadge: {
    padding: "4px 10px",
    background: "rgba(75, 199, 176, 0.2)",
    borderRadius: "12px",
    fontSize: "0.7rem",
    color: "#4BC7B0"
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px"
  },

  formField: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },

  label: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500"
  },

  value: {
    fontSize: "1rem",
    color: "#fff",
    padding: "8px 0"
  },

  input: {
    padding: "10px 12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s"
  },

  select: {
    padding: "10px 12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    cursor: "pointer"
  },

  // New styles for creative layout
  statRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px"
  },

  statItem: {
    textAlign: "center",
    padding: "15px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px"
  },

  statLabel: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.6)",
    marginBottom: "8px"
  },

  statValue: {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#4BC7B0"
  },

  leaseInfo: {
    marginTop: "15px",
    padding: "15px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    textAlign: "center"
  },

  leasePeriod: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "0.9rem"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "15px",
    marginTop: "10px"
  },

  statBox: {
    textAlign: "center",
    padding: "15px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px"
  },

  statNumber: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#4BC7B0",
    marginBottom: "5px"
  },

  statDesc: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.7)"
  }
}

// Add keyframes for animation
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
document.head.appendChild(styleSheet)

export default TenantProfile