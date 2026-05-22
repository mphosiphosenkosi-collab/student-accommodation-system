// src/pages/admin/Dashboard.jsx (Updated version)
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { adminService } from "../../services/adminService"

function AdminDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalRooms: 0,
    totalTenants: 0,
    pendingApplications: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
    maintenanceRequests: 0,
    paymentsDue: 0
  })
  const [recentApplications, setRecentApplications] = useState([])
  const [recentPayments, setRecentPayments] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Load all dashboard data in parallel
      const [statsData, applicationsData, paymentsData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRecentApplications(4),
        adminService.getRecentPayments(4)
      ])
      
      setStats(statsData)
      setRecentApplications(applicationsData)
      setRecentPayments(paymentsData)
    } catch (error) {
      console.error("Error loading dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewApplication = (appId) => {
    navigate(`/admin/applications/${appId}`)
  }

  const handleViewReceipt = (paymentId) => {
    navigate(`/admin/payments/${paymentId}`)
  }

  const handleQuickAction = (action) => {
    switch(action) {
      case 'add-property':
        navigate('/admin/properties/new')
        break
      case 'manage-rooms':
        navigate('/admin/rooms')
        break
      case 'review-applications':
        navigate('/admin/applications')
        break
      case 'generate-reports':
        navigate('/admin/reports')
        break
      default:
        break
    }
  }

  const handleAlertAction = (alertType) => {
    switch(alertType) {
      case 'maintenance':
        navigate('/admin/maintenance')
        break
      case 'payments':
        navigate('/admin/payments?filter=overdue')
        break
      case 'leases':
        navigate('/admin/tenants?filter=expiring')
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div style={styles.dashboardContainer}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Overview of your accommodation platform</p>
        </div>
        <div style={styles.dateDisplay}>
          <span>📅</span>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard} onClick={() => navigate("/admin/properties")} role="button" style={{...styles.statCard, cursor: "pointer"}}>
          <div style={{...styles.statIcon, background: "linear-gradient(135deg, #4BC7B0, #2FA7A0)"}}>🏠</div>
          <div>
            <h3 style={styles.statValue}>{stats.totalProperties}</h3>
            <p style={styles.statLabel}>Properties</p>
          </div>
        </div>
        
        <div style={styles.statCard} onClick={() => navigate("/admin/rooms")} role="button" style={{...styles.statCard, cursor: "pointer"}}>
          <div style={{...styles.statIcon, background: "linear-gradient(135deg, #3B82F6, #2563EB)"}}>🚪</div>
          <div>
            <h3 style={styles.statValue}>{stats.totalRooms}</h3>
            <p style={styles.statLabel}>Total Rooms</p>
          </div>
        </div>
        
        <div style={styles.statCard} onClick={() => navigate("/admin/tenants")} role="button" style={{...styles.statCard, cursor: "pointer"}}>
          <div style={{...styles.statIcon, background: "linear-gradient(135deg, #8B5CF6, #7C3AED)"}}>👥</div>
          <div>
            <h3 style={styles.statValue}>{stats.totalTenants}</h3>
            <p style={styles.statLabel}>Active Tenants</p>
          </div>
        </div>
        
        <div style={styles.statCard} onClick={() => navigate("/admin/applications")} role="button" style={{...styles.statCard, cursor: "pointer"}}>
          <div style={{...styles.statIcon, background: "linear-gradient(135deg, #F59E0B, #D97706)"}}>📝</div>
          <div>
            <h3 style={styles.statValue}>{stats.pendingApplications}</h3>
            <p style={styles.statLabel}>Pending Apps</p>
          </div>
        </div>
        
        <div style={styles.statCard} onClick={() => navigate("/admin/payments")} role="button" style={{...styles.statCard, cursor: "pointer"}}>
          <div style={{...styles.statIcon, background: "linear-gradient(135deg, #10B981, #059669)"}}>💰</div>
          <div>
            <h3 style={styles.statValue}>R {stats.monthlyRevenue.toLocaleString()}</h3>
            <p style={styles.statLabel}>Monthly Revenue</p>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: "linear-gradient(135deg, #EF4444, #DC2626)"}}>📊</div>
          <div>
            <h3 style={styles.statValue}>{stats.occupancyRate}%</h3>
            <p style={styles.statLabel}>Occupancy Rate</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <button style={styles.actionButton} onClick={() => handleQuickAction('add-property')}>
          <span>➕</span> Add Property
        </button>
        <button style={styles.actionButton} onClick={() => handleQuickAction('manage-rooms')}>
          <span>📋</span> Manage Rooms
        </button>
        <button style={styles.actionButton} onClick={() => handleQuickAction('review-applications')}>
          <span>✅</span> Review Applications
        </button>
        <button style={styles.actionButton} onClick={() => handleQuickAction('generate-reports')}>
          <span>📊</span> Generate Reports
        </button>
      </div>

      {/* Main Content Grid */}
      <div style={styles.mainGrid}>
        
        {/* Recent Applications */}
        <div style={styles.widget}>
          <div style={styles.widgetHeader}>
            <h2 style={styles.widgetTitle}>Recent Applications</h2>
            <button style={styles.viewAllBtn} onClick={() => navigate("/admin/applications")}>View All →</button>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableTh}>Name</th>
                  <th style={styles.tableTh}>Property</th>
                  <th style={styles.tableTh}>Date</th>
                  <th style={styles.tableTh}>Funding</th>
                  <th style={styles.tableTh}>Status</th>
                  <th style={styles.tableTh}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map(app => (
                  <tr key={app.id} style={styles.tableRow}>
                    <td style={styles.tableTd}>{app.studentName}</td>
                    <td style={styles.tableTd}>{app.preferredProperty}</td>
                    <td style={styles.tableTd}>{new Date(app.submittedDate).toLocaleDateString()}</td>
                    <td style={styles.tableTd}>{app.fundingType}</td>
                    <td style={styles.tableTd}>
                      <span style={{...styles.statusBadge, 
                        background: app.status === 'pending' ? '#F59E0B20' : app.status === 'approved' ? '#10B98120' : '#EF444420', 
                        color: app.status === 'pending' ? '#F59E0B' : app.status === 'approved' ? '#10B981' : '#EF4444'}}>
                        {app.status}
                      </span>
                    </td>
                    <td style={styles.tableTd}>
                      <button style={styles.reviewBtn} onClick={() => handleReviewApplication(app.id)}>
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments */}
        <div style={styles.widget}>
          <div style={styles.widgetHeader}>
            <span style={styles.widgetIcon}></span>
            <h2 style={styles.widgetTitle}>Recent Payments</h2>
            <button style={styles.viewAllBtn} onClick={() => navigate("/admin/payments")}>View All →</button>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableTh}>Tenant</th>
                  <th style={styles.tableTh}>Amount</th>
                  <th style={styles.tableTh}>Date</th>
                  <th style={styles.tableTh}>Method</th>
                  <th style={styles.tableTh}>Status</th>
                  <th style={styles.tableTh}>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map(payment => (
                  <tr key={payment.id} style={styles.tableRow}>
                    <td style={styles.tableTd}>{payment.tenantName}</td>
                    <td style={styles.tableTd}>R {payment.amount.toLocaleString()}</td>
                    <td style={styles.tableTd}>{new Date(payment.date).toLocaleDateString()}</td>
                    <td style={styles.tableTd}>{payment.method}</td>
                    <td style={styles.tableTd}>
                      <span style={{...styles.statusBadge, 
                        background: payment.status === 'completed' ? '#10B98120' : '#F59E0B20', 
                        color: payment.status === 'completed' ? '#10B981' : '#F59E0B'}}>
                        {payment.status}
                      </span>
                    </td>
                    <td style={styles.tableTd}>
                      <button style={styles.receiptBtn} onClick={() => handleViewReceipt(payment.id)}>
                        📄
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alerts & Notices */}
      <div style={styles.alertsCard}>
        <h3 style={styles.alertsTitle}>⚠️ Attention Required</h3>
        <div style={styles.alertsList}>
          <div style={styles.alertItem} onClick={() => handleAlertAction('maintenance')} role="button" style={{...styles.alertItem, cursor: "pointer"}}>
            <span style={styles.alertIcon}>🔴</span>
            <div>
              <p style={styles.alertText}>{stats.maintenanceRequests} maintenance requests pending for over 48 hours</p>
              <p style={styles.alertDate}>Urgent attention needed</p>
            </div>
            <button style={styles.alertBtn}>View</button>
          </div>
          <div style={styles.alertItem} onClick={() => handleAlertAction('payments')} role="button" style={{...styles.alertItem, cursor: "pointer"}}>
            <span style={styles.alertIcon}>🟡</span>
            <div>
              <p style={styles.alertText}>{stats.paymentsDue} tenants have overdue rent payments</p>
              <p style={styles.alertDate}>Due date: December 1st, 2024</p>
            </div>
            <button style={styles.alertBtn}>Contact</button>
          </div>
          <div style={styles.alertItem} onClick={() => handleAlertAction('leases')} role="button" style={{...styles.alertItem, cursor: "pointer"}}>
            <span style={styles.alertIcon}>🔵</span>
            <div>
              <p style={styles.alertText}>2 lease agreements expiring this month</p>
              <p style={styles.alertDate}>Renewal required by Dec 31st</p>
            </div>
            <button style={styles.alertBtn}>Review</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  dashboardContainer: {
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

  dateDisplay: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
    fontSize: "0.9rem"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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
    border: "1px solid rgba(255,255,255,0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(255,255,255,0.12)",
      transform: "translateY(-2px)"
    }
  },

  statIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px"
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

  quickActions: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "30px"
  },

  actionButton: {
    padding: "12px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(75, 199, 176, 0.2)",
      borderColor: "#4BC7B0"
    }
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: "25px",
    marginBottom: "30px"
  },

  widget: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "25px",
    border: "1px solid rgba(255,255,255,0.1)"
  },

  widgetHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },

  widgetIcon: {
    fontSize: "24px"
  },

  widgetTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    flex: 1
  },

  viewAllBtn: {
    padding: "6px 12px",
    background: "rgba(75, 199, 176, 0.2)",
    border: "none",
    borderRadius: "8px",
    color: "#4BC7B0",
    cursor: "pointer",
    fontSize: "0.8rem",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(75, 199, 176, 0.3)"
    }
  },

  tableContainer: {
    overflowX: "auto"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
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
    transition: "background 0.2s ease",
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

  reviewBtn: {
    padding: "6px 12px",
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

  receiptBtn: {
    padding: "6px 10px",
    background: "rgba(255,255,255,0.1)",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.8rem",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(255,255,255,0.2)"
    }
  },

  alertsCard: {
    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(11, 107, 115, 0.1))",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "25px",
    border: "1px solid rgba(255,255,255,0.1)"
  },

  alertsTitle: {
    fontSize: "1.2rem",
    marginBottom: "15px"
  },

  alertsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  alertItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(255,255,255,0.08)"
    }
  },

  alertIcon: {
    fontSize: "20px"
  },

  alertText: {
    fontSize: "0.95rem",
    fontWeight: "500",
    marginBottom: "4px"
  },

  alertDate: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.6)"
  },

  alertBtn: {
    marginLeft: "auto",
    padding: "6px 16px",
    background: "rgba(75, 199, 176, 0.2)",
    border: "none",
    borderRadius: "8px",
    color: "#4BC7B0",
    cursor: "pointer",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(75, 199, 176, 0.3)"
    }
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

export default AdminDashboard