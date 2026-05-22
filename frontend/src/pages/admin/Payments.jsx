// src/pages/admin/Payments.jsx - Cleaned & Backend Ready
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { adminService } from "../../services/adminService"

function Payments() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState([])
  const [filteredPayments, setFilteredPayments] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [stats, setStats] = useState({
    totalCollected: 0,
    expectedRevenue: 0,
    pendingPayments: 0,
    overduePayments: 0,
    collectionRate: 0
  })

  // Load payments from service
  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    setLoading(true)
    try {
      const paymentsData = await adminService.getPayments()
      setPayments(paymentsData)
      setFilteredPayments(paymentsData)
      calculateStats(paymentsData)
    } catch (error) {
      console.error("Error loading payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (paymentsData) => {
    const totalCollected = paymentsData
      .filter(p => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0)
    
    const expectedRevenue = paymentsData.reduce((sum, p) => sum + p.amount, 0)
    const pendingPayments = paymentsData.filter(p => p.status === "pending").length
    const overduePayments = paymentsData.filter(p => p.status === "overdue").length
    const collectionRate = expectedRevenue > 0 ? (totalCollected / expectedRevenue) * 100 : 0
    
    setStats({
      totalCollected,
      expectedRevenue,
      pendingPayments,
      overduePayments,
      collectionRate: collectionRate.toFixed(1)
    })
  }

  // Filter payments based on search and status
  useEffect(() => {
    let filtered = [...payments]
    
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(payment => payment.status === statusFilter)
    }
    
    setFilteredPayments(filtered)
  }, [searchTerm, statusFilter, payments])

  const getStatusColor = (status) => {
    const colors = {
      completed: { bg: "#10B98120", color: "#10B981", text: "✓ Completed" },
      pending: { bg: "#F59E0B20", color: "#F59E0B", text: "⏳ Pending" },
      overdue: { bg: "#EF444420", color: "#EF4444", text: "⚠️ Overdue" },
      failed: { bg: "#DC262620", color: "#DC2626", text: "❌ Failed" }
    }
    return colors[status] || colors.pending
  }

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment)
    setShowDetailsModal(true)
  }

  const handleSendReminder = async (payment) => {
    // This would integrate with notification service
    alert(`Sending payment reminder to ${payment.tenantName} for amount R${payment.amount}`)
  }

  const handleMarkAsPaid = async (payment) => {
    if (window.confirm(`Mark payment of R${payment.amount} from ${payment.tenantName} as completed?`)) {
      try {
        const updatedPayment = await adminService.updatePaymentStatus(
          payment.id, 
          "completed"
        )
        
        const updatedPayments = payments.map(p => 
          p.id === payment.id ? updatedPayment : p
        )
        setPayments(updatedPayments)
        calculateStats(updatedPayments)
        alert("Payment marked as completed!")
        
        if (showDetailsModal) {
          setShowDetailsModal(false)
        }
      } catch (error) {
        console.error("Error updating payment:", error)
        alert("Failed to update payment status. Please try again.")
      }
    }
  }

  const handleDownloadReport = async () => {
    try {
      const revenueReport = await adminService.generateRevenueReport(
        new Date().getFullYear(),
        new Date().getMonth()
      )
      alert(`Report generated: Total Revenue R${revenueReport.totalRevenue.toLocaleString()}`)
      // In production, this would download a PDF/Excel file
    } catch (error) {
      console.error("Error generating report:", error)
      alert("Failed to generate report. Please try again.")
    }
  }

  const handleExportCSV = () => {
    const exportData = filteredPayments.map(p => ({
      'Payment ID': p.id,
      'Tenant': p.tenantName,
      'Property': p.propertyName,
      'Amount': p.amount,
      'Due Date': p.date,
      'Status': p.status,
      'Method': p.method || 'N/A'
    }))
    adminService.exportToCSV(exportData, `payments_export_${new Date().toISOString().split('T')[0]}`)
  }

  const handleDownloadReceipt = (payment) => {
    if (payment.receiptUrl) {
      // In production, this would download the actual receipt file
      alert(`Downloading receipt for ${payment.tenantName}`)
    } else {
      alert("No receipt available for this payment")
    }
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading payment data...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Payment Management</h1>
          <p style={styles.subtitle}>Track and manage all tenant payments</p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={handleDownloadReport} style={styles.exportButton}>
            📊 Download Report
          </button>
          <button onClick={handleExportCSV} style={styles.exportButton}>
            📄 Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div>
            <h3 style={styles.statValue}>R {stats.totalCollected.toLocaleString()}</h3>
            <p style={styles.statLabel}>Total Collected</p>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div>
            <h3 style={styles.statValue}>R {stats.expectedRevenue.toLocaleString()}</h3>
            <p style={styles.statLabel}>Expected Revenue</p>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⏳</div>
          <div>
            <h3 style={styles.statValue}>{stats.pendingPayments}</h3>
            <p style={styles.statLabel}>Pending Payments</p>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⚠️</div>
          <div>
            <h3 style={styles.statValue}>{stats.overduePayments}</h3>
            <p style={styles.statLabel}>Overdue Payments</p>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📈</div>
          <div>
            <h3 style={styles.statValue}>{stats.collectionRate}%</h3>
            <p style={styles.statLabel}>Collection Rate</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={styles.filtersBar}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by tenant name, ID, or reference..."
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
            onClick={() => setStatusFilter("completed")}
            style={{...styles.filterButton, background: statusFilter === "completed" ? "#10B981" : "rgba(255,255,255,0.1)"}}
          >
            Completed
          </button>
          <button 
            onClick={() => setStatusFilter("pending")}
            style={{...styles.filterButton, background: statusFilter === "pending" ? "#F59E0B" : "rgba(255,255,255,0.1)"}}
          >
            Pending
          </button>
          <button 
            onClick={() => setStatusFilter("overdue")}
            style={{...styles.filterButton, background: statusFilter === "overdue" ? "#EF4444" : "rgba(255,255,255,0.1)"}}
          >
            Overdue
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableTh}>Payment ID</th>
              <th style={styles.tableTh}>Tenant</th>
              <th style={styles.tableTh}>Property</th>
              <th style={styles.tableTh}>Amount</th>
              <th style={styles.tableTh}>Due Date</th>
              <th style={styles.tableTh}>Payment Date</th>
              <th style={styles.tableTh}>Method</th>
              <th style={styles.tableTh}>Status</th>
              <th style={styles.tableTh}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => {
              const status = getStatusColor(payment.status)
              const isOverdue = payment.status === "overdue"
              
              return (
                <tr key={payment.id} style={{...styles.tableRow, background: isOverdue ? "rgba(239, 68, 68, 0.05)" : "transparent"}}>
                  <td style={styles.tableTd}>
                    <span style={styles.paymentId}>{payment.id}</span>
                   </td>
                  <td style={styles.tableTd}>
                    <strong>{payment.tenantName}</strong>
                    <br />
                    <span style={styles.tenantId}>ID: {payment.tenantId}</span>
                   </td>
                  <td style={styles.tableTd}>
                    {payment.propertyName}<br />
                    <span style={styles.roomNumber}>Room {payment.roomNumber || "N/A"}</span>
                   </td>
                  <td style={styles.tableTd}>
                    <strong>R {payment.amount.toLocaleString()}</strong>
                    {payment.lateFee > 0 && (
                      <div style={styles.lateFee}>+ R{payment.lateFee} late fee</div>
                    )}
                   </td>
                  <td style={styles.tableTd}>
                    {payment.date ? new Date(payment.date).toLocaleDateString() : "N/A"}
                    {isOverdue && <div style={styles.overdueBadge}>Overdue</div>}
                   </td>
                  <td style={styles.tableTd}>
                    {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "-"}
                   </td>
                  <td style={styles.tableTd}>{payment.method || "-"}</td>
                  <td style={styles.tableTd}>
                    <span style={{...styles.statusBadge, background: status.bg, color: status.color}}>
                      {status.text}
                    </span>
                   </td>
                  <td style={styles.tableTd}>
                    <button onClick={() => handleViewDetails(payment)} style={styles.viewBtn}>
                      View
                    </button>
                    {payment.status !== "completed" && (
                      <>
                        <button onClick={() => handleSendReminder(payment)} style={styles.reminderBtn}>
                          Remind
                        </button>
                        <button onClick={() => handleMarkAsPaid(payment)} style={styles.markPaidBtn}>
                          Mark Paid
                        </button>
                      </>
                    )}
                    </td>
                 </tr>
              )
            })}
          </tbody>
        </table>
        
        {filteredPayments.length === 0 && (
          <div style={styles.noResults}>
            <p>No payments found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div style={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Payment Details</h2>
              <button style={styles.closeButton} onClick={() => setShowDetailsModal(false)}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.detailsGrid}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Payment ID:</span>
                  <span style={styles.detailValue}>{selectedPayment.id}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Tenant:</span>
                  <span style={styles.detailValue}>{selectedPayment.tenantName}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Property:</span>
                  <span style={styles.detailValue}>{selectedPayment.propertyName}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Amount:</span>
                  <span style={styles.detailValue}>R {selectedPayment.amount.toLocaleString()}</span>
                </div>
                {selectedPayment.lateFee > 0 && (
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Late Fee:</span>
                    <span style={styles.detailValue}>R {selectedPayment.lateFee}</span>
                  </div>
                )}
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Due Date:</span>
                  <span style={styles.detailValue}>{new Date(selectedPayment.date).toLocaleDateString()}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Payment Date:</span>
                  <span style={styles.detailValue}>{selectedPayment.paymentDate ? new Date(selectedPayment.paymentDate).toLocaleDateString() : "Not paid yet"}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Payment Method:</span>
                  <span style={styles.detailValue}>{selectedPayment.method || "N/A"}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Status:</span>
                  <span style={styles.detailValue}>{selectedPayment.status}</span>
                </div>
              </div>
              
              {selectedPayment.receiptUrl && (
                <button onClick={() => handleDownloadReceipt(selectedPayment)} style={styles.downloadReceiptBtn}>
                  📄 Download Receipt
                </button>
              )}
            </div>
            
            <div style={styles.modalFooter}>
              {selectedPayment.status !== "completed" && (
                <>
                  <button onClick={() => handleSendReminder(selectedPayment)} style={styles.modalReminderBtn}>
                    Send Reminder
                  </button>
                  <button onClick={() => handleMarkAsPaid(selectedPayment)} style={styles.modalMarkPaidBtn}>
                    Mark as Paid
                  </button>
                </>
              )}
              <button onClick={() => setShowDetailsModal(false)} style={styles.modalCloseBtn}>
                Close
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

  headerActions: {
    display: "flex",
    gap: "12px"
  },

  exportButton: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(255,255,255,0.2)"
    }
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
    transition: "background 0.3s ease",
    ':hover': {
      background: "rgba(255,255,255,0.03)"
    }
  },

  tableTd: {
    padding: "15px 12px",
    fontSize: "0.9rem"
  },

  paymentId: {
    fontFamily: "monospace",
    fontSize: "0.85rem",
    color: "#4BC7B0"
  },

  tenantId: {
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.5)"
  },

  roomNumber: {
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.5)"
  },

  lateFee: {
    fontSize: "0.7rem",
    color: "#EF4444",
    marginTop: "2px"
  },

  overdueBadge: {
    fontSize: "0.7rem",
    color: "#EF4444",
    marginTop: "4px"
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

  markPaidBtn: {
    padding: "6px 12px",
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
    maxWidth: "550px",
    width: "90%",
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

  detailsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)"
  },

  detailLabel: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)"
  },

  detailValue: {
    fontSize: "0.9rem",
    fontWeight: "500",
    textAlign: "right"
  },

  downloadReceiptBtn: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    background: "rgba(75, 199, 176, 0.2)",
    border: "1px solid rgba(75, 199, 176, 0.3)",
    borderRadius: "10px",
    color: "#4BC7B0",
    cursor: "pointer",
    fontSize: "0.9rem"
  },

  modalFooter: {
    padding: "20px 25px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end"
  },

  modalReminderBtn: {
    padding: "10px 20px",
    background: "rgba(245, 158, 11, 0.2)",
    border: "1px solid rgba(245, 158, 11, 0.3)",
    borderRadius: "8px",
    color: "#F59E0B",
    cursor: "pointer"
  },

  modalMarkPaidBtn: {
    padding: "10px 20px",
    background: "rgba(16, 185, 129, 0.2)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "8px",
    color: "#10B981",
    cursor: "pointer"
  },

  modalCloseBtn: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
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

export default Payments