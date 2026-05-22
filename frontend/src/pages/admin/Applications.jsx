// src/pages/admin/Applications.jsx - Cleaned & Backend Ready
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { adminService } from "../../services/adminService"

function Applications() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [propertyFilter, setPropertyFilter] = useState("all")
  const [showViewModal, setShowViewModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [properties, setProperties] = useState([])

  // Load data from service
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load properties and applications in parallel
      const [propertiesData, applicationsData] = await Promise.all([
        adminService.getProperties(),
        adminService.getApplications()
      ])
      
      setProperties(propertiesData)
      setApplications(applicationsData)
      setFilteredApplications(applicationsData)
    } catch (error) {
      console.error("Error loading applications data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter applications based on search, status, and property
  useEffect(() => {
    let filtered = [...applications]
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter)
    }
    
    if (propertyFilter !== "all") {
      filtered = filtered.filter(app => app.propertyId === parseInt(propertyFilter))
    }
    
    setFilteredApplications(filtered)
  }, [searchTerm, statusFilter, propertyFilter, applications])

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: "#F59E0B20", color: "#F59E0B", text: "Pending Review", icon: "⏳" },
      approved: { bg: "#10B98120", color: "#10B981", text: "Approved", icon: "✅" },
      rejected: { bg: "#EF444420", color: "#EF4444", text: "Rejected", icon: "❌" }
    }
    return colors[status] || colors.pending
  }

  const handleViewDetails = (application) => {
    setSelectedApplication(application)
    setShowViewModal(true)
  }

  const handleReview = (application) => {
    setSelectedApplication(application)
    setReviewNotes("")
    setShowReviewModal(true)
  }

  const handleApprove = async () => {
    if (!reviewNotes && !window.confirm("No review notes added. Continue without notes?")) {
      return
    }
    await updateApplicationStatus("approved")
  }

  const handleReject = async () => {
    if (!reviewNotes && !window.confirm("No rejection reason provided. Continue without notes?")) {
      return
    }
    await updateApplicationStatus("rejected")
  }

  const updateApplicationStatus = async (newStatus) => {
    try {
      const updatedApplication = await adminService.updateApplicationStatus(
        selectedApplication.id,
        newStatus,
        reviewNotes || (newStatus === "approved" ? "Application approved" : "Application rejected")
      )
      
      setApplications(applications.map(app => 
        app.id === selectedApplication.id ? updatedApplication : app
      ))
      
      setShowReviewModal(false)
      alert(`Application ${newStatus === "approved" ? "approved" : "rejected"} successfully!`)
      
      if (newStatus === "approved") {
        // Ask if user wants to convert to tenant
        setTimeout(async () => {
          if (window.confirm("Would you like to convert this application to a tenant record?")) {
            try {
              const newTenant = await adminService.convertToTenant(selectedApplication.id)
              alert(`Tenant ${newTenant.name} has been created successfully!`)
              navigate("/admin/tenants")
            } catch (error) {
              console.error("Error converting to tenant:", error)
              alert("Failed to create tenant record. Please create manually.")
            }
          }
        }, 500)
      }
    } catch (error) {
      console.error("Error updating application status:", error)
      alert("Failed to update application status. Please try again.")
    }
  }

  const handleDownloadDocuments = (application) => {
    // This would integrate with document service
    alert(`Downloading documents for ${application.studentName}`)
  }

  const getDocumentStatusIcon = (hasDocument) => {
    return hasDocument ? "✅" : "❌"
  }

  // Calculate stats
  const pendingCount = applications.filter(a => a.status === "pending").length
  const approvedCount = applications.filter(a => a.status === "approved").length
  const rejectedCount = applications.filter(a => a.status === "rejected").length

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading applications...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Applications Management</h1>
          <p style={styles.subtitle}>Review and process student accommodation applications</p>
        </div>
        <div style={styles.headerStats}>
          <div style={styles.headerStat}>
            <span style={styles.headerStatValue}>{pendingCount}</span>
            <span style={styles.headerStatLabel}>Pending</span>
          </div>
          <div style={styles.headerStat}>
            <span style={styles.headerStatValue}>{approvedCount}</span>
            <span style={styles.headerStatLabel}>Approved</span>
          </div>
          <div style={styles.headerStat}>
            <span style={styles.headerStatValue}>{rejectedCount}</span>
            <span style={styles.headerStatLabel}>Rejected</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filtersBar}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by name, student ID, email, or application ID..."
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Grid */}
      <div style={styles.applicationsGrid}>
        {filteredApplications.map(application => {
          const status = getStatusColor(application.status)
          
          return (
            <div key={application.id} style={styles.applicationCard}>
              <div style={styles.cardHeader}>
                <div style={styles.cardHeaderLeft}>
                  <span style={styles.appId}>#{application.id}</span>
                  <span style={{...styles.statusBadge, background: status.bg, color: status.color}}>
                    {status.icon} {status.text}
                  </span>
                </div>
                <div style={styles.cardDate}>
                  {new Date(application.submittedDate).toLocaleDateString()}
                </div>
              </div>
              
              <div style={styles.cardBody}>
                <div style={styles.studentInfo}>
                  <div style={styles.studentAvatar}>
                    {application.studentName?.split(' ').map(n => n[0]).join('') || "ST"}
                  </div>
                  <div>
                    <h3 style={styles.studentName}>{application.studentName}</h3>
                    <p style={styles.studentId}>ID: {application.studentId}</p>
                    <p style={styles.studentContact}>{application.email}</p>
                    <p style={styles.studentContact}>{application.phone}</p>
                  </div>
                </div>
                
                <div style={styles.propertyInfo}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>🏠 Property:</span>
                    <span>{application.preferredProperty}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>💰 Funding:</span>
                    <span>{application.fundingType}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>📅 Submitted:</span>
                    <span>{new Date(application.submittedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div style={styles.documentsSection}>
                  <p style={styles.documentsTitle}>📄 Documents Status:</p>
                  <div style={styles.documentsGrid}>
                    <span>ID Copy: {getDocumentStatusIcon(true)}</span>
                    <span>Registration: {getDocumentStatusIcon(true)}</span>
                    <span>Proof of Income: {application.fundingType === "NSFAS" ? "✅" : "📄"}</span>
                  </div>
                </div>
                
                {application.notes && (
                  <div style={styles.notesSection}>
                    <p style={styles.notesLabel}>📝 Notes:</p>
                    <p style={styles.notesText}>{application.notes}</p>
                  </div>
                )}
                
                {application.reviewedDate && (
                  <div style={styles.reviewSection}>
                    <p style={styles.reviewLabel}>👨‍⚖️ Reviewed on {application.reviewedDate}:</p>
                    <p style={styles.reviewText}>{application.notes || "No additional notes"}</p>
                  </div>
                )}
              </div>
              
              <div style={styles.cardFooter}>
                <button onClick={() => handleViewDetails(application)} style={styles.viewBtn}>
                  View Details
                </button>
                <button onClick={() => handleDownloadDocuments(application)} style={styles.downloadBtn}>
                  📄 Documents
                </button>
                {application.status === "pending" && (
                  <button onClick={() => handleReview(application)} style={styles.reviewBtn}>
                    Review Application
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filteredApplications.length === 0 && (
        <div style={styles.noResults}>
          <p>No applications found matching your criteria</p>
        </div>
      )}

      {/* View Application Modal */}
      {showViewModal && selectedApplication && (
        <div style={styles.modalOverlay} onClick={() => setShowViewModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Application Details</h2>
              <button style={styles.closeButton} onClick={() => setShowViewModal(false)}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.viewHeader}>
                <div style={styles.viewAvatar}>
                  {selectedApplication.studentName?.split(' ').map(n => n[0]).join('') || "ST"}
                </div>
                <div>
                  <h3 style={styles.viewName}>{selectedApplication.studentName}</h3>
                  <p style={styles.viewId}>Application #{selectedApplication.id} | Student ID: {selectedApplication.studentId}</p>
                  <p style={styles.viewDate}>Submitted: {new Date(selectedApplication.submittedDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div style={styles.detailsGrid}>
                <div style={styles.detailSection}>
                  <h4 style={styles.sectionTitle}>Personal Information</h4>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Full Name:</span>
                    <span>{selectedApplication.studentName}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Email:</span>
                    <span>{selectedApplication.email}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Phone:</span>
                    <span>{selectedApplication.phone}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Student ID:</span>
                    <span>{selectedApplication.studentId}</span>
                  </div>
                </div>
                
                <div style={styles.detailSection}>
                  <h4 style={styles.sectionTitle}>Application Details</h4>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Property:</span>
                    <span>{selectedApplication.preferredProperty}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Funding Type:</span>
                    <span>{selectedApplication.fundingType}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Status:</span>
                    <span style={{color: selectedApplication.status === "approved" ? "#10B981" : selectedApplication.status === "rejected" ? "#EF4444" : "#F59E0B"}}>
                      {selectedApplication.status}
                    </span>
                  </div>
                </div>
                
                <div style={styles.detailSection}>
                  <h4 style={styles.sectionTitle}>Documents</h4>
                  <div style={styles.documentsList}>
                    <div style={styles.documentItem}>
                      <span>ID Copy:</span>
                      <span style={{color: "#10B981"}}>Uploaded ✅</span>
                    </div>
                    <div style={styles.documentItem}>
                      <span>Student Registration:</span>
                      <span style={{color: "#10B981"}}>Uploaded ✅</span>
                    </div>
                    {selectedApplication.fundingType === "NSFAS" && (
                      <div style={styles.documentItem}>
                        <span>NSFAS Confirmation:</span>
                        <span style={{color: "#10B981"}}>Provided ✅</span>
                      </div>
                    )}
                  </div>
                  <button style={styles.downloadAllBtn} onClick={() => handleDownloadDocuments(selectedApplication)}>
                    Download All Documents
                  </button>
                </div>
              </div>
            </div>
            
            <div style={styles.modalFooter}>
              {selectedApplication.status === "pending" && (
                <>
                  <button style={styles.rejectModalBtn} onClick={() => {
                    setShowViewModal(false)
                    handleReview(selectedApplication)
                  }}>
                    Review Application
                  </button>
                </>
              )}
              <button style={styles.closeModalBtn} onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Application Modal */}
      {showReviewModal && selectedApplication && (
        <div style={styles.modalOverlay} onClick={() => setShowReviewModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Review Application</h2>
              <button style={styles.closeButton} onClick={() => setShowReviewModal(false)}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.reviewApplicationInfo}>
                <p><strong>Applicant:</strong> {selectedApplication.studentName}</p>
                <p><strong>Application ID:</strong> {selectedApplication.id}</p>
                <p><strong>Property:</strong> {selectedApplication.preferredProperty}</p>
                <p><strong>Funding Type:</strong> {selectedApplication.fundingType}</p>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Review Notes / Comments</label>
                <textarea
                  style={styles.textarea}
                  rows="5"
                  placeholder="Add your review notes, approval reasons, or rejection grounds..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                />
              </div>
              
              <div style={styles.reviewActions}>
                <button style={styles.rejectButton} onClick={handleReject}>
                  ❌ Reject Application
                </button>
                <button style={styles.approveButton} onClick={handleApprove}>
                  ✅ Approve Application
                </button>
              </div>
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

  headerStats: {
    display: "flex",
    gap: "20px"
  },

  headerStat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 20px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "12px"
  },

  headerStatValue: {
    fontSize: "1.5rem",
    fontWeight: "700"
  },

  headerStatLabel: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.6)"
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

  applicationsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))",
    gap: "25px"
  },

  applicationCard: {
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

  cardHeader: {
    padding: "15px 20px",
    background: "rgba(255,255,255,0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  cardHeaderLeft: {
    display: "flex",
    gap: "12px",
    alignItems: "center"
  },

  appId: {
    fontFamily: "monospace",
    fontSize: "0.85rem",
    color: "#4BC7B0",
    fontWeight: "600"
  },

  statusBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600"
  },

  cardDate: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.5)"
  },

  cardBody: {
    padding: "20px"
  },

  studentInfo: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },

  studentAvatar: {
    width: "50px",
    height: "50px",
    background: "linear-gradient(135deg, #4BC7B0, #2FA7A0)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "18px"
  },

  studentName: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "4px"
  },

  studentId: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.6)",
    marginBottom: "4px"
  },

  studentContact: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.5)"
  },

  propertyInfo: {
    marginBottom: "15px"
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: "0.85rem"
  },

  infoLabel: {
    color: "rgba(255,255,255,0.6)"
  },

  documentsSection: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "15px"
  },

  documentsTitle: {
    fontSize: "0.8rem",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#4BC7B0"
  },

  documentsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "6px",
    fontSize: "0.75rem"
  },

  notesSection: {
    marginBottom: "15px"
  },

  notesLabel: {
    fontSize: "0.75rem",
    fontWeight: "600",
    marginBottom: "4px",
    color: "rgba(255,255,255,0.6)"
  },

  notesText: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.7)",
    lineHeight: "1.4"
  },

  reviewSection: {
    background: "rgba(16, 185, 129, 0.1)",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "15px"
  },

  reviewLabel: {
    fontSize: "0.7rem",
    fontWeight: "600",
    marginBottom: "4px",
    color: "#10B981"
  },

  reviewText: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.7)",
    lineHeight: "1.4"
  },

  cardFooter: {
    padding: "15px 20px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    gap: "10px"
  },

  viewBtn: {
    flex: 1,
    padding: "8px",
    background: "rgba(59, 130, 246, 0.2)",
    border: "none",
    borderRadius: "8px",
    color: "#3B82F6",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(59, 130, 246, 0.3)"
    }
  },

  downloadBtn: {
    flex: 1,
    padding: "8px",
    background: "rgba(75, 199, 176, 0.2)",
    border: "none",
    borderRadius: "8px",
    color: "#4BC7B0",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(75, 199, 176, 0.3)"
    }
  },

  reviewBtn: {
    flex: 1,
    padding: "8px",
    background: "rgba(245, 158, 11, 0.2)",
    border: "none",
    borderRadius: "8px",
    color: "#F59E0B",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(245, 158, 11, 0.3)"
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

  viewId: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)",
    marginBottom: "3px"
  },

  viewDate: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.5)"
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
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
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: "0.85rem"
  },

  detailLabel: {
    color: "rgba(255,255,255,0.7)"
  },

  documentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "15px"
  },

  documentItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: "0.85rem"
  },

  downloadAllBtn: {
    width: "100%",
    padding: "8px",
    background: "rgba(75, 199, 176, 0.2)",
    border: "none",
    borderRadius: "8px",
    color: "#4BC7B0",
    cursor: "pointer",
    fontSize: "0.85rem"
  },

  modalFooter: {
    padding: "20px 25px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end"
  },

  rejectModalBtn: {
    padding: "10px 20px",
    background: "rgba(239, 68, 68, 0.2)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "8px",
    color: "#EF4444",
    cursor: "pointer"
  },

  closeModalBtn: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer"
  },

  reviewApplicationInfo: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    padding: "15px",
    marginBottom: "20px"
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px"
  },

  label: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "rgba(255,255,255,0.9)"
  },

  textarea: {
    padding: "12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit"
  },

  reviewActions: {
    display: "flex",
    gap: "15px",
    justifyContent: "center"
  },

  rejectButton: {
    flex: 1,
    padding: "12px",
    background: "rgba(239, 68, 68, 0.2)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "10px",
    color: "#EF4444",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600"
  },

  approveButton: {
    flex: 1,
    padding: "12px",
    background: "rgba(16, 185, 129, 0.2)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "10px",
    color: "#10B981",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600"
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

export default Applications