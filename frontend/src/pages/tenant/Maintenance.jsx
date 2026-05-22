import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function TenantMaintenance() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [activeRequests, setActiveRequests] = useState([])
  const [pastRequests, setPastRequests] = useState([])
  const [formData, setFormData] = useState({
    issueType: "",
    title: "",
    description: "",
    urgency: "medium",
    preferredTime: "",
    images: []
  })

  useEffect(() => {
    // Mock API call - replace with actual API
    setTimeout(() => {
      setActiveRequests([
        {
          id: "REQ001",
          title: "Leaking Tap in Kitchen",
          issueType: "plumbing",
          description: "The kitchen sink tap is continuously leaking water, causing puddles on the floor.",
          urgency: "high",
          status: "in-progress",
          dateSubmitted: "2024-11-20",
          scheduledDate: "2024-11-25",
          assignedTo: "John from Maintenance",
          images: []
        },
        {
          id: "REQ002",
          title: "Broken Window Latch",
          issueType: "repairs",
          description: "The bedroom window latch is broken and won't close properly.",
          urgency: "medium",
          status: "pending",
          dateSubmitted: "2024-11-22",
          scheduledDate: null,
          assignedTo: null,
          images: []
        }
      ])
      
      setPastRequests([
        {
          id: "REQ001",
          title: "Light Bulb Replacement",
          issueType: "electrical",
          description: "Bathroom light bulb blew out.",
          urgency: "low",
          status: "completed",
          dateSubmitted: "2024-10-15",
          dateCompleted: "2024-10-16",
          resolution: "Light bulb replaced successfully"
        },
        {
          id: "REQ002",
          title: "Heater Not Working",
          issueType: "hvac",
          description: "Room heater isn't producing heat.",
          urgency: "high",
          status: "completed",
          dateSubmitted: "2024-10-05",
          dateCompleted: "2024-10-08",
          resolution: "Replaced faulty heating element"
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    
    // API call to submit maintenance request
    console.log("Submitting maintenance request:", formData)
    
    setTimeout(() => {
      const newRequest = {
        id: `REQ${Math.floor(Math.random() * 1000)}`,
        ...formData,
        status: "pending",
        dateSubmitted: new Date().toISOString().split('T')[0],
        scheduledDate: null,
        assignedTo: null
      }
      
      setActiveRequests(prev => [newRequest, ...prev])
      setShowForm(false)
      setFormData({
        issueType: "",
        title: "",
        description: "",
        urgency: "medium",
        preferredTime: "",
        images: []
      })
      setLoading(false)
      alert("Maintenance request submitted successfully!")
    }, 1000)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: '#F59E0B', text: 'Pending Review' },
      'in-progress': { color: '#3B82F6', text: 'In Progress' },
      'completed': { color: '#10B981', text: 'Completed' },
      'cancelled': { color: '#EF4444', text: 'Cancelled' }
    }
    const config = statusConfig[status] || statusConfig.pending
    
    return (
      <span style={{...styles.statusBadge, background: `${config.color}20`, color: config.color}}>
        {config.text}
      </span>
    )
  }

  const getUrgencyBadge = (urgency) => {
    const urgencyConfig = {
      'high': { color: '#EF4444', text: '⚠️ High' },
      'medium': { color: '#F59E0B', text: '🟡 Medium' },
      'low': { color: '#10B981', text: '✅ Low' }
    }
    const config = urgencyConfig[urgency] || urgencyConfig.medium
    
    return (
      <span style={{...styles.urgencyBadge, background: `${config.color}20`, color: config.color}}>
        {config.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading maintenance requests...</p>
      </div>
    )
  }

  return (
    <div style={styles.maintenanceContainer}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Maintenance Requests</h1>
          <p style={styles.subtitle}>Submit and track maintenance issues in your accommodation</p>
        </div>
        <button 
          style={styles.newRequestButton}
          onClick={() => setShowForm(true)}
        >
          + New Request
        </button>
      </div>

      {/* Quick Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div>
            <h3 style={styles.statNumber}>{activeRequests.length}</h3>
            <p style={styles.statLabel}>Active Requests</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div>
            <h3 style={styles.statNumber}>{pastRequests.length}</h3>
            <p style={styles.statLabel}>Completed</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div>
            <h3 style={styles.statNumber}>24h</h3>
            <p style={styles.statLabel}>Avg Response Time</p>
          </div>
        </div>
      </div>

      {/* New Request Form Modal */}
      {showForm && (
        <div style={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Submit Maintenance Request</h2>
              <button style={styles.closeButton} onClick={() => setShowForm(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Issue Type *</label>
                <select
                  style={styles.select}
                  value={formData.issueType}
                  onChange={(e) => handleInputChange('issueType', e.target.value)}
                  required
                >
                  <option value="">Select issue type</option>
                  <option value="plumbing">Plumbing (Leaks, Toilets, Pipes)</option>
                  <option value="electrical">Electrical (Lights, Outlets, Wiring)</option>
                  <option value="hvac">Heating/Cooling (AC, Heater)</option>
                  <option value="appliance">Appliance (Fridge, Stove, Microwave)</option>
                  <option value="furniture">Furniture (Beds, Desks, Chairs)</option>
                  <option value="repairs">General Repairs (Doors, Windows, Walls)</option>
                  <option value="cleaning">Cleaning/Pest Control</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Issue Title *</label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Brief title of the issue"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description *</label>
                <textarea
                  style={styles.textarea}
                  rows="4"
                  placeholder="Please provide detailed description of the issue..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Urgency Level *</label>
                  <select
                    style={styles.select}
                    value={formData.urgency}
                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                    required
                  >
                    <option value="low">Low - Minor issue, no rush</option>
                    <option value="medium">Medium - Needs attention soon</option>
                    <option value="high">High - Urgent, affecting daily life</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Preferred Time</label>
                  <input
                    type="datetime-local"
                    style={styles.input}
                    value={formData.preferredTime}
                    onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Upload Photos (Optional)</label>
                <input
                  type="file"
                  style={styles.fileInput}
                  accept="image/*"
                  multiple
                  onChange={(e) => handleInputChange('images', Array.from(e.target.files))}
                />
                <p style={styles.fileHint}>Upload images to help us understand the issue better</p>
              </div>

              <div style={styles.formActions}>
                <button type="button" style={styles.cancelFormButton} onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Requests Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Active Requests</h2>
        {activeRequests.length === 0 ? (
          <div style={styles.emptyState}>
           
            <p style={styles.emptyText}>No active maintenance requests</p>
            <button style={styles.emptyButton} onClick={() => setShowForm(true)}>
              Submit your first request
            </button>
          </div>
        ) : (
          <div style={styles.requestsGrid}>
            {activeRequests.map(request => (
              <div key={request.id} style={styles.requestCard}>
                <div style={styles.requestHeader}>
                  <div>
                    <h3 style={styles.requestTitle}>{request.title}</h3>
                    <p style={styles.requestId}>Request #{request.id}</p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                
                <div style={styles.requestBody}>
                  <div style={styles.requestMeta}>
                    {getUrgencyBadge(request.urgency)}
                    <span style={styles.requestDate}>
                      📅 Submitted: {new Date(request.dateSubmitted).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p style={styles.requestDescription}>{request.description}</p>
                  
                  {request.scheduledDate && (
                    <div style={styles.scheduledInfo}>
                      <span>🔧 Scheduled for: {new Date(request.scheduledDate).toLocaleDateString()}</span>
                      {request.assignedTo && <span>👨‍🔧 Assigned to: {request.assignedTo}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Requests Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Past Requests</h2>
        {pastRequests.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>📜</span>
            <p style={styles.emptyText}>No past maintenance requests</p>
          </div>
        ) : (
          <div style={styles.pastRequestsList}>
            {pastRequests.map(request => (
              <div key={request.id} style={styles.pastRequestCard}>
                <div style={styles.pastRequestHeader}>
                  <div>
                    <h4 style={styles.pastRequestTitle}>{request.title}</h4>
                    <p style={styles.pastRequestId}>#{request.id}</p>
                  </div>
                  {getStatusBadge(request.status)}
                  {getUrgencyBadge(request.urgency)}
                </div>
                
                <div style={styles.pastRequestDetails}>
                  <p style={styles.pastRequestDescription}>{request.description}</p>
                  <div style={styles.resolutionInfo}>
                    <span> Resolution: {request.resolution}</span>
                    <span> Completed: {new Date(request.dateCompleted).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Maintenance Tips */}
      <div style={styles.tipsCard}>
        <h3 style={styles.tipsTitle}> Maintenance Tips</h3>
        <div style={styles.tipsGrid}>
          <div style={styles.tipItem}>
            
            <p>Report issues early to prevent bigger problems</p>
          </div>
          <div style={styles.tipItem}>
            <p>Include clear photos for faster resolution</p>
          </div>
          <div style={styles.tipItem}>
            <p>Be available during scheduled maintenance times</p>
          </div>
          <div style={styles.tipItem}>
            
            <p>Provide detailed descriptions for accurate repairs</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  maintenanceContainer: {
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

  newRequestButton: {
    padding: "12px 24px",
    background: "#4BC7B0",
    color: "#065A63",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "transform 0.2s",
    ':hover': {
      transform: "scale(0.98)"
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
    fontSize: "30px"
  },

  statNumber: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "5px"
  },

  statLabel: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)"
  },

  section: {
    marginBottom: "40px"
  },

  sectionTitle: {
    fontSize: "1.4rem",
    marginBottom: "20px",
    fontWeight: "600"
  },

  requestsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))",
    gap: "20px"
  },

  requestCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "transform 0.2s",
    ':hover': {
      transform: "translateY(-2px)"
    }
  },

  requestHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
    paddingBottom: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },

  requestTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "5px"
  },

  requestId: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.5)"
  },

  statusBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600"
  },

  urgencyBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
    display: "inline-block"
  },

  requestBody: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  requestMeta: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap"
  },

  requestDate: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.6)"
  },

  requestDescription: {
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.8)",
    lineHeight: "1.6"
  },

  scheduledInfo: {
    marginTop: "10px",
    padding: "10px",
    background: "rgba(75, 199, 176, 0.1)",
    borderRadius: "8px",
    fontSize: "0.85rem",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "10px"
  },

  pastRequestsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  pastRequestCard: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    padding: "15px",
    border: "1px solid rgba(255,255,255,0.05)"
  },

  pastRequestHeader: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginBottom: "12px",
    flexWrap: "wrap"
  },

  pastRequestTitle: {
    fontSize: "1rem",
    fontWeight: "600"
  },

  pastRequestId: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.5)"
  },

  pastRequestDescription: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)",
    marginBottom: "10px"
  },

  pastRequestDetails: {
    marginTop: "10px"
  },

  resolutionInfo: {
    padding: "10px",
    background: "rgba(16, 185, 129, 0.1)",
    borderRadius: "8px",
    fontSize: "0.85rem",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "10px"
  },

  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "15px"
  },

  emptyIcon: {
    fontSize: "50px",
    display: "block",
    marginBottom: "15px"
  },

  emptyText: {
    fontSize: "1rem",
    color: "rgba(255,255,255,0.6)",
    marginBottom: "20px"
  },

  emptyButton: {
    padding: "10px 20px",
    background: "#4BC7B0",
    color: "#065A63",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600"
  },

  tipsCard: {
    background: "linear-gradient(135deg, rgba(75, 199, 176, 0.1), rgba(11, 107, 115, 0.1))",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "25px",
    marginTop: "20px",
    border: "1px solid rgba(255,255,255,0.1)"
  },

  tipsTitle: {
    fontSize: "1.2rem",
    marginBottom: "15px"
  },

  tipsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px"
  },

  tipItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "0.9rem",
    padding: "10px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "8px"
  },

  // Modal Styles
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
    background: "linear-gradient(135deg, #065A63, #0B6B73)",
    borderRadius: "20px",
    padding: "30px",
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
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },

  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "600"
  },

  closeButton: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "24px",
    cursor: "pointer",
    padding: "0 8px"
  },

  form: {
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
    gridTemplateColumns: "1fr 1fr",
    gap: "15px"
  },

  label: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "rgba(255,255,255,0.9)"
  },

  input: {
    padding: "10px 12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    ':focus': {
      borderColor: "#4BC7B0"
    }
  },

  textarea: {
    padding: "10px 12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit"
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

  fileInput: {
    padding: "10px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer"
  },

  fileHint: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.5)"
  },

  formActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "10px"
  },

  cancelFormButton: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer"
  },

  submitButton: {
    padding: "10px 20px",
    background: "#4BC7B0",
    color: "#065A63",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer"
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

export default TenantMaintenance