// src/pages/tenant/TenantDocuments.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function TenantDocuments() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  const [documents, setDocuments] = useState([])
  const [documentCategories, setDocumentCategories] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const [newDocument, setNewDocument] = useState({
    title: "",
    category: "",
    description: "",
    file: null,
    isImportant: false,
    notifyMe: true
  })

  useEffect(() => {
    // Mock API call - replace with actual API
    setTimeout(() => {
      setDocumentCategories([
        { id: "lease", name: "Lease Agreements", icon: "📄", color: "#4BC7B0" },
        { id: "receipt", name: "Payment Receipts", icon: "💰", color: "#F59E0B" },
        { id: "id", name: "Identification", icon: "🆔", color: "#3B82F6" },
        { id: "registration", name: "Registration Proof", icon: "🎓", color: "#8B5CF6" },
        { id: "nsfas", name: "NSFAS Documents", icon: "🏦", color: "#10B981" },
        { id: "other", name: "Other", icon: "📁", color: "#6B7280" }
      ])
      
      setDocuments([
        {
          id: "DOC001",
          title: "Lease Agreement 2024",
          category: "lease",
          fileName: "lease_agreement_2024.pdf",
          fileSize: 2450000,
          fileType: "application/pdf",
          uploadedAt: "2024-01-15T10:30:00",
          uploadedBy: "Thabo Mbeki",
          version: 2,
          isImportant: true,
          isVerified: true,
          downloadCount: 3,
          sharedWith: ["admin@studentstay.co.za"],
          expiryDate: "2024-12-31",
          description: "Official lease agreement for the 2024 academic year"
        },
        {
          id: "DOC002",
          title: "NSFAS Confirmation Letter",
          category: "nsfas",
          fileName: "nsfas_confirmation_2024.pdf",
          fileSize: 1200000,
          fileType: "application/pdf",
          uploadedAt: "2024-02-10T14:20:00",
          uploadedBy: "Thabo Mbeki",
          version: 1,
          isImportant: true,
          isVerified: true,
          downloadCount: 5,
          sharedWith: ["admin@studentstay.co.za", "finance@studentstay.co.za"],
          expiryDate: null,
          description: "NSFAS funding confirmation for 2024"
        },
        {
          id: "DOC003",
          title: "Student ID Copy",
          category: "id",
          fileName: "student_id_front.jpg",
          fileSize: 850000,
          fileType: "image/jpeg",
          uploadedAt: "2024-01-20T09:15:00",
          uploadedBy: "Thabo Mbeki",
          version: 1,
          isImportant: false,
          isVerified: true,
          downloadCount: 2,
          sharedWith: ["admin@studentstay.co.za"],
          expiryDate: "2024-12-31",
          description: "Front side of student ID card"
        },
        {
          id: "DOC004",
          title: "January Rent Receipt",
          category: "receipt",
          fileName: "rent_receipt_jan2024.pdf",
          fileSize: 450000,
          fileType: "application/pdf",
          uploadedAt: "2024-01-05T11:45:00",
          uploadedBy: "System",
          version: 1,
          isImportant: false,
          isVerified: true,
          downloadCount: 1,
          sharedWith: [],
          expiryDate: null,
          description: "Rent payment receipt for January 2024"
        },
        {
          id: "DOC005",
          title: "Proof of Registration",
          category: "registration",
          fileName: "registration_2024.pdf",
          fileSize: 1800000,
          fileType: "application/pdf",
          uploadedAt: "2024-02-25T16:30:00",
          uploadedBy: "Thabo Mbeki",
          version: 1,
          isImportant: true,
          isVerified: false,
          downloadCount: 0,
          sharedWith: ["admin@studentstay.co.za"],
          expiryDate: null,
          description: "University registration proof for 2024"
        },
        {
          id: "DOC006",
          title: "Maintenance Request Receipt",
          category: "other",
          fileName: "maintenance_repair_receipt.pdf",
          fileSize: 320000,
          fileType: "application/pdf",
          uploadedAt: "2024-03-01T13:20:00",
          uploadedBy: "Thabo Mbeki",
          version: 1,
          isImportant: false,
          isVerified: true,
          downloadCount: 0,
          sharedWith: ["maintenance@studentstay.co.za"],
          expiryDate: null,
          description: "Receipt for plumbing repair"
        }
      ])
      
      setLoading(false)
    }, 1000)
  }, [])

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewDocument({ ...newDocument, file: file })
    }
  }

  const handleUploadDocument = () => {
    if (!newDocument.title || !newDocument.category || !newDocument.file) {
      alert("Please fill in all required fields")
      return
    }

    setUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    setTimeout(() => {
      const newDoc = {
        id: `DOC${Math.floor(Math.random() * 10000)}`,
        title: newDocument.title,
        category: newDocument.category,
        fileName: newDocument.file.name,
        fileSize: newDocument.file.size,
        fileType: newDocument.file.type,
        uploadedAt: new Date().toISOString(),
        uploadedBy: "Thabo Mbeki",
        version: 1,
        isImportant: newDocument.isImportant,
        isVerified: false,
        downloadCount: 0,
        sharedWith: ["admin@studentstay.co.za"],
        expiryDate: null,
        description: newDocument.description
      }
      
      setDocuments([newDoc, ...documents])
      setShowUploadModal(false)
      setUploading(false)
      setUploadProgress(0)
      setNewDocument({
        title: "",
        category: "",
        description: "",
        file: null,
        isImportant: false,
        notifyMe: true
      })
      
      alert("Document uploaded successfully!")
    }, 2000)
  }

  const handleDownload = (document) => {
    // Simulate download
    alert(`Downloading ${document.title}...`)
    // In production: window.open(`/api/documents/download/${document.id}`, '_blank')
  }

  const handleDelete = (document) => {
    if (window.confirm(`Are you sure you want to delete "${document.title}"?`)) {
      setDocuments(documents.filter(d => d.id !== document.id))
      alert("Document deleted successfully!")
    }
  }

  const handleShare = (document) => {
    setSelectedDocument(document)
    setShowShareModal(true)
  }

  const handleSendShare = () => {
    alert(`Document shared with ${selectedDocument.sharedWith.join(', ')}`)
    setShowShareModal(false)
  }

  const handleRequestVerification = (document) => {
    alert(`Verification requested for "${document.title}". Admin will review it shortly.`)
  }

  const getCategoryIcon = (categoryId) => {
    const category = documentCategories.find(c => c.id === categoryId)
    return category ? category.icon : "📄"
  }

  const getCategoryColor = (categoryId) => {
    const category = documentCategories.find(c => c.id === categoryId)
    return category ? category.color : "#6B7280"
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading documents...</p>
      </div>
    )
  }

  return (
    <div style={styles.documentsContainer}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Documents</h1>
          <p style={styles.subtitle}>Manage, upload, and access all your important documents</p>
        </div>
        <button 
          style={styles.uploadButton}
          onClick={() => setShowUploadModal(true)}
        >
           + Upload Document
        </button>
      </div>

      {/* Stats Summary */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📁</div>
          <div>
            <p style={styles.statValue}>{documents.length}</p>
            <p style={styles.statLabel}>Total Documents</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div>
            <p style={styles.statValue}>{documents.filter(d => d.isVerified).length}</p>
            <p style={styles.statLabel}>Verified</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🔍</div>
          <div>
            <p style={styles.statValue}>{documents.filter(d => d.isImportant).length}</p>
            <p style={styles.statLabel}>Important</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📥</div>
          <div>
            <p style={styles.statValue}>{documents.reduce((sum, d) => sum + d.downloadCount, 0)}</p>
            <p style={styles.statLabel}>Total Downloads</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={styles.searchSection}>
        <div style={styles.searchBar}>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="🔍 Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={styles.categoryFilters}>
          <button
            style={{
              ...styles.filterChip,
              ...(selectedCategory === "all" ? styles.filterChipActive : {})
            }}
            onClick={() => setSelectedCategory("all")}
          >
            All Documents
          </button>
          {documentCategories.map(category => (
            <button
              key={category.id}
              style={{
                ...styles.filterChip,
                ...(selectedCategory === category.id ? styles.filterChipActive : {})
              }}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div style={styles.documentsGrid}>
        {filteredDocuments.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyTitle}>No documents found</h3>
            <p style={styles.emptyText}>Upload your first document to get started</p>
            <button 
              style={styles.emptyButton}
              onClick={() => setShowUploadModal(true)}
            >
              + Upload Document
            </button>
          </div>
        ) : (
          filteredDocuments.map(doc => (
            <div key={doc.id} style={styles.documentCard}>
              <div style={styles.documentHeader}>
                <div style={styles.documentIcon}>
                  {getCategoryIcon(doc.category)}
                </div>
                <div style={styles.documentInfo}>
                  <h3 style={styles.documentTitle}>
                    {doc.title}
                    {doc.isImportant && <span style={styles.importantBadge}>⭐ Important</span>}
                    {!doc.isVerified && <span style={styles.pendingBadge}>Pending Verification</span>}
                  </h3>
                  <p style={styles.documentMeta}>
                    {formatDate(doc.uploadedAt)} • {doc.uploadedBy} • v{doc.version}
                  </p>
                </div>
              </div>
              
              <p style={styles.documentDescription}>{doc.description}</p>
              
              <div style={styles.documentDetails}>
                <span style={styles.detailItem}>📄 {formatFileSize(doc.fileSize)}</span>
                <span style={styles.detailItem}>📥 {doc.downloadCount} downloads</span>
                {doc.expiryDate && (
                  <span style={styles.detailItem}>⏰ Expires: {formatDate(doc.expiryDate)}</span>
                )}
              </div>
              
              <div style={styles.documentActions}>
                <button 
                  style={styles.actionButton}
                  onClick={() => handleDownload(doc)}
                >
                  📥 Download
                </button>
                <button 
                  style={styles.actionButton}
                  onClick={() => handleShare(doc)}
                >
                  🔗 Share
                </button>
                {!doc.isVerified && (
                  <button 
                    style={styles.actionButton}
                    onClick={() => handleRequestVerification(doc)}
                  >
                    ✓ Request Verification
                  </button>
                )}
                <button 
                  style={{...styles.actionButton, ...styles.deleteButton}}
                  onClick={() => handleDelete(doc)}
                >
                  🗑️ Delete
                </button>
              </div>
              
              {doc.sharedWith.length > 0 && (
                <div style={styles.sharedWith}>
                  <span>👥 Shared with: </span>
                  {doc.sharedWith.join(', ')}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={styles.modalOverlay} onClick={() => !uploading && setShowUploadModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Upload Document</h2>
              {!uploading && (
                <button style={styles.closeButton} onClick={() => setShowUploadModal(false)}>✕</button>
              )}
            </div>
            
            <div style={styles.modalBody}>
              {uploading ? (
                <div style={styles.uploadProgress}>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: `${uploadProgress}%`}}></div>
                  </div>
                  <p style={styles.progressText}>Uploading... {uploadProgress}%</p>
                </div>
              ) : (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Document Title *</label>
                    <input
                      type="text"
                      style={styles.input}
                      placeholder="e.g., Lease Agreement 2024"
                      value={newDocument.title}
                      onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Category *</label>
                    <select
                      style={styles.select}
                      value={newDocument.category}
                      onChange={(e) => setNewDocument({...newDocument, category: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      {documentCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Description</label>
                    <textarea
                      style={styles.textarea}
                      rows="3"
                      placeholder="Brief description of the document..."
                      value={newDocument.description}
                      onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Select File *</label>
                    <div style={styles.fileUploadArea}>
                      <input
                        type="file"
                        id="fileUpload"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                      <button
                        style={styles.fileSelectButton}
                        onClick={() => document.getElementById('fileUpload').click()}
                      >
                        {newDocument.file ? newDocument.file.name : "Choose File"}
                      </button>
                      <p style={styles.fileHint}>PDF, Images, DOC (Max 10MB)</p>
                    </div>
                  </div>
                  
                  <div style={styles.checkboxGroup}>
                    <label style={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={newDocument.isImportant}
                        onChange={(e) => setNewDocument({...newDocument, isImportant: e.target.checked})}
                      />
                      <span>Mark as important</span>
                    </label>
                    <label style={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={newDocument.notifyMe}
                        onChange={(e) => setNewDocument({...newDocument, notifyMe: e.target.checked})}
                      />
                      <span>Notify me when document is verified</span>
                    </label>
                  </div>
                </>
              )}
            </div>
            
            {!uploading && (
              <div style={styles.modalFooter}>
                <button style={styles.cancelButton} onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button 
                  style={styles.uploadModalButton} 
                  onClick={handleUploadDocument}
                >
                  Upload Document
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedDocument && (
        <div style={styles.modalOverlay} onClick={() => setShowShareModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Share Document</h2>
              <button style={styles.closeButton} onClick={() => setShowShareModal(false)}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Document: {selectedDocument.title}</label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Enter email addresses (comma separated)"
                  defaultValue={selectedDocument.sharedWith.join(', ')}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Message (Optional)</label>
                <textarea
                  style={styles.textarea}
                  rows="3"
                  placeholder="Add a message..."
                />
              </div>
              
              <div style={styles.shareOptions}>
                <label style={styles.checkbox}>
                  <input type="checkbox" defaultChecked />
                  <span>Allow download</span>
                </label>
                <label style={styles.checkbox}>
                  <input type="checkbox" defaultChecked />
                  <span>Notify me when viewed</span>
                </label>
              </div>
            </div>
            
            <div style={styles.modalFooter}>
              <button style={styles.cancelButton} onClick={() => setShowShareModal(false)}>
                Cancel
              </button>
              <button style={styles.shareButton} onClick={handleSendShare}>
                Share Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  documentsContainer: {
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

  uploadButton: {
    padding: "14px 28px",
    background: "#4BC7B0",
    color: "#065A63",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "transform 0.2s"
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
    borderRadius: "20px",
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
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "5px"
  },

  statLabel: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)"
  },

  searchSection: {
    marginBottom: "30px"
  },

  searchBar: {
    marginBottom: "15px"
  },

  searchInput: {
    width: "100%",
    padding: "14px 18px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "1rem",
    outline: "none"
  },

  categoryFilters: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
  },

  filterChip: {
    padding: "8px 16px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.2s"
  },

  filterChipActive: {
    background: "#4BC7B0",
    color: "#065A63",
    borderColor: "#4BC7B0"
  },

  documentsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "20px"
  },

  documentCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "transform 0.2s"
  },

  documentHeader: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px"
  },

  documentIcon: {
    fontSize: "40px"
  },

  documentInfo: {
    flex: 1
  },

  documentTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "5px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap"
  },

  importantBadge: {
    padding: "2px 8px",
    background: "rgba(245, 158, 11, 0.2)",
    borderRadius: "12px",
    fontSize: "0.7rem",
    color: "#F59E0B"
  },

  pendingBadge: {
    padding: "2px 8px",
    background: "rgba(239, 68, 68, 0.2)",
    borderRadius: "12px",
    fontSize: "0.7rem",
    color: "#EF4444"
  },

  documentMeta: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.6)"
  },

  documentDescription: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.8)",
    marginBottom: "12px",
    lineHeight: "1.5"
  },

  documentDetails: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.6)"
  },

  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },

  documentActions: {
    display: "flex",
    gap: "10px",
    marginBottom: "12px",
    flexWrap: "wrap"
  },

  actionButton: {
    padding: "8px 16px",
    background: "rgba(75, 199, 176, 0.2)",
    border: "1px solid rgba(75, 199, 176, 0.3)",
    borderRadius: "8px",
    color: "#4BC7B0",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.2s"
  },

  deleteButton: {
    background: "rgba(239, 68, 68, 0.2)",
    borderColor: "rgba(239, 68, 68, 0.3)",
    color: "#EF4444"
  },

  sharedWith: {
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.5)",
    paddingTop: "10px",
    borderTop: "1px solid rgba(255,255,255,0.1)"
  },

  emptyState: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "60px 20px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px"
  },

  emptyIcon: {
    fontSize: "64px",
    marginBottom: "20px"
  },

  emptyTitle: {
    fontSize: "1.5rem",
    marginBottom: "10px"
  },

  emptyText: {
    color: "rgba(255,255,255,0.6)",
    marginBottom: "20px"
  },

  emptyButton: {
    padding: "12px 24px",
    background: "#4BC7B0",
    color: "#065A63",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600"
  },

  // Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },

  modal: {
    background: "linear-gradient(135deg, #065A63, #0B6B73)",
    borderRadius: "20px",
    maxWidth: "550px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto",
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
    fontSize: "1.5rem",
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

  modalFooter: {
    padding: "20px 25px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end"
  },

  formGroup: {
    marginBottom: "20px"
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "rgba(255,255,255,0.9)"
  },

  input: {
    width: "100%",
    padding: "12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none"
  },

  select: {
    width: "100%",
    padding: "12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none"
  },

  textarea: {
    width: "100%",
    padding: "12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit"
  },

  fileUploadArea: {
    textAlign: "center"
  },

  fileSelectButton: {
    width: "100%",
    padding: "12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.95rem"
  },

  fileHint: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.5)",
    marginTop: "8px"
  },

  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "15px"
  },

  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "0.9rem"
  },

  uploadProgress: {
    textAlign: "center",
    padding: "20px"
  },

  progressBar: {
    width: "100%",
    height: "8px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "10px"
  },

  progressFill: {
    height: "100%",
    background: "#4BC7B0",
    transition: "width 0.3s ease"
  },

  progressText: {
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.8)"
  },

  cancelButton: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer"
  },

  uploadModalButton: {
    padding: "10px 20px",
    background: "#4BC7B0",
    color: "#065A63",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer"
  },

  shareButton: {
    padding: "10px 20px",
    background: "#4BC7B0",
    color: "#065A63",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer"
  },

  shareOptions: {
    marginTop: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
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

export default TenantDocuments