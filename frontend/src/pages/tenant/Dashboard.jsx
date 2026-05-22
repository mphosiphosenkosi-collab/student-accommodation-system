import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function TenantDashboard() {
  const navigate = useNavigate()
  const [tenantData, setTenantData] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data - replace with API calls
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setTenantData({
        name: "Thabo Mbeki",
        email: "thabo.mbeki@student.ac.za",
        studentId: "STU2024001",
        phone: "+27 71 234 5678",
        accommodation: {
          name: "Urban Heights Residence",
          room: "Room 408",
          building: "Tower B",
          location: "Benoni, Gauteng",
          moveInDate: "2024-01-15",
          leaseEnd: "2024-12-15"
        },
        payments: {
          monthlyRent: 4500,
          nextPaymentDue: "2024-12-01",
          status: "paid",
          paymentHistory: [
            { month: "November 2024", amount: 4500, date: "2024-11-01", status: "paid" },
            { month: "October 2024", amount: 4500, date: "2024-10-01", status: "paid" },
            { month: "September 2024", amount: 4500, date: "2024-09-01", status: "paid" }
          ]
        },
        stats: {
          daysUntilRenewal: 25,
          maintenanceRequests: 2,
          totalPaid: 13500,
          upcomingPayments: 1
        }
      })
      
      setNotifications([
        { id: 1, title: "Rent Payment Reminder", message: "Your December rent is due in 5 days", type: "warning", date: "2024-11-25", read: false },
        { id: 2, title: "Maintenance Update", message: "Your maintenance request has been scheduled", type: "info", date: "2024-11-24", read: false },
        { id: 3, title: "Community Event", message: "Welcome BBQ this Friday at 6PM", type: "success", date: "2024-11-23", read: true },
        { id: 4, title: "Inspection Notice", message: "Room inspection scheduled for Dec 5th", type: "warning", date: "2024-11-22", read: true }
      ])
      
      setLoading(false)
    }, 1000)
  }, [])

  const handlePayment = () => {
    navigate("/dashboard/tenant/payment")
  }

  const handleMaintenance = () => {
    navigate("/dashboard/tenant/maintenance")
  }

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div style={styles.dashboardContainer}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Welcome back, {tenantData?.name.split(' ')[0]}! 👋</h1>
          <p style={styles.subtitle}>Here's what's happening with your accommodation today</p>
        </div>
        <div style={styles.headerActions}>
          <div style={styles.dateDisplay}>
            
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIconWrapper}>
            <span style={styles.statIcon}></span>
          </div>
          <div>
            <h3 style={styles.statValue}>{tenantData?.accommodation.room}</h3>
            <p style={styles.statLabel}>Current Room</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statIconWrapper, background: "linear-gradient(135deg, #4BC7B0, #2FA7A0)"}}>
            <span style={styles.statIcon}></span>
          </div>
          <div>
            <h3 style={styles.statValue}>R {tenantData?.payments.monthlyRent.toLocaleString()}</h3>
            <p style={styles.statLabel}>Monthly Rent</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statIconWrapper, background: "linear-gradient(135deg, #F59E0B, #D97706)"}}>
            <span style={styles.statIcon}></span>
          </div>
          <div>
            <h3 style={styles.statValue}>{tenantData?.stats.daysUntilRenewal} days</h3>
            <p style={styles.statLabel}>Until Lease Renewal</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statIconWrapper, background: "linear-gradient(135deg, #8B5CF6, #7C3AED)"}}>
            <span style={styles.statIcon}></span>
          </div>
          <div>
            <h3 style={styles.statValue}>Active</h3>
            <p style={styles.statLabel}>Account Status</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={styles.mainGrid}>
        
        {/* Left Column */}
        <div style={styles.leftColumn}>
          
          {/* Payment Widget */}
          <div style={styles.widget}>
            <div style={styles.widgetHeader}>
              <span style={styles.widgetIcon}>💳</span>
              <h2 style={styles.widgetTitle}>Payment Overview</h2>
            </div>
            <div style={styles.paymentStatus}>
              <div style={styles.paymentStatusLeft}>
                <p style={styles.paymentLabel}>Next Payment Due</p>
                <p style={styles.paymentAmount}>R {tenantData?.payments.monthlyRent.toLocaleString()}</p>
                <p style={styles.paymentDate}>Due: {new Date(tenantData?.payments.nextPaymentDue).toLocaleDateString()}</p>
              </div>
              <div style={styles.paymentBadge(tenantData?.payments.status)}>
                {tenantData?.payments.status === "paid" ? "✓ Paid" : "⚠ Due Soon"}
              </div>
            </div>
            <button onClick={handlePayment} style={styles.paymentButton}>
              Make Payment
              <span>→</span>
            </button>
            
            <div style={styles.paymentHistory}>
              <p style={styles.historyTitle}>Recent Payments</p>
              {tenantData?.payments.paymentHistory.slice(0, 2).map((payment, idx) => (
                <div key={idx} style={styles.historyItem}>
                  <div>
                    <p style={styles.historyMonth}>{payment.month}</p>
                    <p style={styles.historyDate}>{new Date(payment.date).toLocaleDateString()}</p>
                  </div>
                  <div style={styles.historyRight}>
                    <p style={styles.historyAmount}>R {payment.amount.toLocaleString()}</p>
                    <span style={styles.checkIcon}>✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Widget */}
          <div style={styles.widget}>
            <div style={styles.widgetHeader}>
              <span style={styles.widgetIcon}>🔧</span>
              <h2 style={styles.widgetTitle}>Maintenance Requests</h2>
            </div>
            <div style={styles.maintenanceInfo}>
              <div style={styles.maintenanceCount}>
                <span style={styles.countNumber}>{tenantData?.stats.maintenanceRequests}</span>
                <span style={styles.countText}>Active Requests</span>
              </div>
              <button onClick={handleMaintenance} style={styles.maintenanceButton}>
                Request Maintenance
              </button>
            </div>
            <div style={styles.amenitiesList}>
              <div style={styles.amenityItem}>
                <span style={styles.amenityIcon}>📶</span>
                <span>High-Speed WiFi Included</span>
              </div>
              <div style={styles.amenityItem}>
                <span style={styles.amenityIcon}>🔒</span>
                <span>24/7 Security Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={styles.rightColumn}>
          
          {/* Profile Card */}
          <div style={styles.profileCard}>
            <div style={styles.profileHeader}>
              <div style={styles.profileAvatar}>
                <span style={styles.avatarIcon}>👤</span>
              </div>
              <div>
                <h3 style={styles.profileName}>{tenantData?.name}</h3>
                <p style={styles.profileEmail}>{tenantData?.email}</p>
              </div>
            </div>
            <div style={styles.profileDetails}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Student ID</span>
                <span style={styles.detailValue}>{tenantData?.studentId}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Phone</span>
                <span style={styles.detailValue}>{tenantData?.phone}</span>
              </div>
            </div>
          </div>

          {/* Accommodation Info */}
          <div style={styles.accommodationCard}>
            <h3 style={styles.accommodationTitle}> Your Accommodation</h3>
            <div style={styles.accommodationDetails}>
              <div style={styles.accommodationRow}>
                <span style={styles.accommodationLabel}>Property:</span>
                <span style={styles.accommodationValue}>{tenantData?.accommodation.name}</span>
              </div>
              <div style={styles.accommodationRow}>
                <span style={styles.accommodationLabel}>Room:</span>
                <span style={styles.accommodationValue}>{tenantData?.accommodation.room}</span>
              </div>
              <div style={styles.accommodationRow}>
                <span style={styles.accommodationLabel}>Location:</span>
                <span style={styles.accommodationValue}>{tenantData?.accommodation.location}</span>
              </div>
              <div style={styles.accommodationRow}>
                <span style={styles.accommodationLabel}>Lease Period:</span>
                <span style={styles.accommodationValue}>
                  {new Date(tenantData?.accommodation.moveInDate).toLocaleDateString()} - {new Date(tenantData?.accommodation.leaseEnd).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Notifications Panel */}
          <div style={styles.notificationsCard}>
            <div style={styles.notificationsHeader}>
              <span style={styles.notifIcon}>🔔</span>
              <h3 style={styles.notificationsTitle}>Notifications</h3>
              <span style={styles.notifBadge}>{notifications.filter(n => !n.read).length} new</span>
            </div>
            <div style={styles.notificationsList}>
              {notifications.map(notif => (
                <div 
                  key={notif.id} 
                  style={{...styles.notificationItem, opacity: notif.read ? 0.7 : 1}}
                  onClick={() => markNotificationRead(notif.id)}
                >
                  <div style={styles.notificationContent}>
                    <div style={styles.notificationIcon(notif.type)}>
                      {notif.type === 'warning' && <span>⚠️</span>}
                      {notif.type === 'success' && <span>✓</span>}
                      {notif.type === 'info' && <span>ℹ️</span>}
                    </div>
                    <div style={styles.notificationText}>
                      <p style={styles.notificationTitle}>{notif.title}</p>
                      <p style={styles.notificationMessage}>{notif.message}</p>
                      <p style={styles.notificationDate}>{new Date(notif.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {!notif.read && <div style={styles.unreadDot}></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  dashboardContainer: {
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
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    ':hover': {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
    }
  },

  statIconWrapper: {
    width: "50px",
    height: "50px",
    background: "linear-gradient(135deg, #065A63, #0B6B73)",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  statIcon: {
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

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 0.9fr",
    gap: "25px"
  },

  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "25px"
  },

  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "25px"
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
    fontWeight: "600"
  },

  paymentStatus: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    padding: "15px",
    background: "rgba(0,0,0,0.2)",
    borderRadius: "15px"
  },

  paymentStatusLeft: {
    flex: 1
  },

  paymentLabel: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)",
    marginBottom: "5px"
  },

  paymentAmount: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "5px"
  },

  paymentDate: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.6)"
  },

  paymentBadge: (status) => ({
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
    background: status === "paid" ? "rgba(75, 199, 176, 0.2)" : "rgba(245, 158, 11, 0.2)",
    color: status === "paid" ? "#4BC7B0" : "#F59E0B"
  }),

  paymentButton: {
    width: "100%",
    padding: "14px",
    background: "#4BC7B0",
    color: "#065A63",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "20px",
    transition: "transform 0.2s",
    ':hover': {
      transform: "scale(0.98)"
    }
  },

  paymentHistory: {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "15px"
  },

  historyTitle: {
    fontSize: "0.9rem",
    fontWeight: "600",
    marginBottom: "12px",
    color: "rgba(255,255,255,0.8)"
  },

  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)"
  },

  historyMonth: {
    fontSize: "0.9rem",
    fontWeight: "500",
    marginBottom: "3px"
  },

  historyDate: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.5)"
  },

  historyRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  historyAmount: {
    fontWeight: "600"
  },

  checkIcon: {
    color: "#4BC7B0",
    fontSize: "16px"
  },

  maintenanceInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  maintenanceCount: {
    textAlign: "center"
  },

  countNumber: {
    fontSize: "2rem",
    fontWeight: "700",
    display: "block"
  },

  countText: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)"
  },

  maintenanceButton: {
    padding: "10px 20px",
    background: "rgba(75, 199, 176, 0.2)",
    color: "#4BC7B0",
    border: "1px solid rgba(75, 199, 176, 0.3)",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s",
    ':hover': {
      background: "rgba(75, 199, 176, 0.3)"
    }
  },

  amenitiesList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    paddingTop: "15px",
    borderTop: "1px solid rgba(255,255,255,0.1)"
  },

  amenityItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "0.9rem"
  },

  amenityIcon: {
    fontSize: "18px"
  },

  profileCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "25px",
    border: "1px solid rgba(255,255,255,0.1)"
  },

  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },

  profileAvatar: {
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, #4BC7B0, #2FA7A0)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  avatarIcon: {
    fontSize: "35px"
  },

  profileName: {
    fontSize: "1.2rem",
    fontWeight: "700",
    marginBottom: "5px"
  },

  profileEmail: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)"
  },

  profileDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  detailLabel: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.6)"
  },

  detailValue: {
    fontSize: "0.9rem",
    fontWeight: "500"
  },

  accommodationCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "25px",
    border: "1px solid rgba(255,255,255,0.1)"
  },

  accommodationTitle: {
    fontSize: "1.1rem",
    marginBottom: "15px"
  },

  accommodationDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  accommodationRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  accommodationLabel: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.6)"
  },

  accommodationValue: {
    fontSize: "0.9rem",
    fontWeight: "500",
    textAlign: "right"
  },

  notificationsCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "25px",
    border: "1px solid rgba(255,255,255,0.1)"
  },

  notificationsHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },

  notifIcon: {
    fontSize: "22px"
  },

  notificationsTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    flex: 1
  },

  notifBadge: {
    padding: "4px 10px",
    background: "#F59E0B",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "#fff"
  },

  notificationsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxHeight: "400px",
    overflowY: "auto"
  },

  notificationItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "background 0.2s",
    ':hover': {
      background: "rgba(255,255,255,0.1)"
    }
  },

  notificationContent: {
    display: "flex",
    gap: "12px",
    flex: 1
  },

  notificationIcon: (type) => ({
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: type === "warning" ? "rgba(245, 158, 11, 0.2)" : 
                type === "success" ? "rgba(75, 199, 176, 0.2)" : 
                "rgba(75, 199, 176, 0.1)",
    fontSize: "16px"
  }),

  notificationText: {
    flex: 1
  },

  notificationTitle: {
    fontSize: "0.9rem",
    fontWeight: "600",
    marginBottom: "4px"
  },

  notificationMessage: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.7)",
    marginBottom: "4px"
  },

  notificationDate: {
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.5)"
  },

  unreadDot: {
    width: "8px",
    height: "8px",
    background: "#4BC7B0",
    borderRadius: "50%"
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

export default TenantDashboard