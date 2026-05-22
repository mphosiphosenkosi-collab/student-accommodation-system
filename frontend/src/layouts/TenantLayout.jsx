// src/layouts/TenantLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const TenantLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tenant, setTenant] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Load tenant data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('tenantUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setTenant(userData);
      
      // Load profile image if exists
      const savedImage = localStorage.getItem('tenantProfileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
    
    // Load mock notifications
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const mockNotifications = [
      {
        id: 1,
        title: 'Payment Reminder',
        message: 'March rent payment is due in 5 days',
        date: '2024-03-05',
        isRead: false,
        link: '/tenant/payments'
      },
      {
        id: 2,
        title: 'Maintenance Update',
        message: 'Your maintenance request #2 has been assigned',
        date: '2024-03-04',
        isRead: false,
        link: '/tenant/maintenance'
      },
      {
        id: 3,
        title: 'Announcement',
        message: 'Water maintenance scheduled for Saturday',
        date: '2024-03-03',
        isRead: true,
        link: null
      },
      {
        id: 4,
        title: 'Lease Document',
        message: 'Your updated lease agreement is ready to view',
        date: '2024-03-01',
        isRead: false,
        link: '/tenant/documents'
      }
    ];
    
    setNotifications(mockNotifications);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
      setShowNotifications(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tenantToken');
    localStorage.removeItem('tenantUser');
    navigate('/tenant/login');
  };

  const navigation = [
    { path: '/tenant/dashboard', name: 'Dashboard' },
    { path: '/tenant/payments', name: 'Payments' },
    { path: '/tenant/maintenance', name: 'Maintenance' },
    { path: '/tenant/profile', name: 'Profile' },
    { path: '/tenant/documents', name: 'Documents' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const styles = {
    layout: {
      display: 'flex',
      minHeight: '100vh',
      background: '#F5F7FA'
    },
    // Sidebar Styles
    sidebar: {
      width: '260px',
      background: '#065A63',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100vh',
      overflowY: 'auto',
      zIndex: 1000,
      transition: 'transform 0.3s ease'
    },
    sidebarHeader: {
      padding: '28px 24px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      marginBottom: '24px'
    },
    logo: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#B7E5CD',
      textDecoration: 'none',
      display: 'block'
    },
    logoSub: {
      fontSize: '12px',
      color: 'rgba(255,255,255,0.6)',
      marginTop: '6px'
    },
    nav: {
      flex: 1,
      padding: '0 16px'
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      color: 'rgba(255, 255, 255, 0.8)',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      marginBottom: '6px'
    },
    navItemActive: {
      background: 'rgba(183, 229, 205, 0.15)',
      color: '#B7E5CD'
    },
    navText: {
      fontSize: '14px',
      fontWeight: '500'
    },
    logoutBtn: {
      margin: '24px 16px',
      padding: '12px 16px',
      background: 'rgba(183, 229, 205, 0.1)',
      border: '1px solid rgba(183, 229, 205, 0.2)',
      borderRadius: '12px',
      color: '#B7E5CD',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.3s ease'
    },
    // Main Content Styles
    mainContent: {
      flex: 1,
      marginLeft: '260px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    },
    topBar: {
      background: 'white',
      padding: '16px 32px',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '24px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    notificationContainer: {
      position: 'relative'
    },
    notificationBtn: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      position: 'relative',
      padding: '8px',
      borderRadius: '10px',
      transition: 'background 0.3s ease',
      color: '#065A63'
    },
    notificationBadge: {
      position: 'absolute',
      top: '2px',
      right: '2px',
      background: '#C1785A',
      color: 'white',
      fontSize: '10px',
      fontWeight: '600',
      padding: '2px 6px',
      borderRadius: '10px',
      minWidth: '18px',
      textAlign: 'center'
    },
    notificationDropdown: {
      position: 'absolute',
      top: '45px',
      right: '0',
      width: '340px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      border: '1px solid #E2E8F0',
      zIndex: 1000,
      overflow: 'hidden'
    },
    notificationHeader: {
      padding: '16px 20px',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    notificationTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#065A63'
    },
    markAllBtn: {
      background: 'none',
      border: 'none',
      color: '#4BC7B0',
      fontSize: '12px',
      cursor: 'pointer'
    },
    notificationList: {
      maxHeight: '400px',
      overflowY: 'auto'
    },
    notificationItem: {
      padding: '14px 20px',
      borderBottom: '1px solid #F1F5F9',
      cursor: 'pointer',
      transition: 'background 0.2s ease'
    },
    notificationItemUnread: {
      background: '#F0FDF4'
    },
    notificationItemTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#065A63',
      marginBottom: '4px'
    },
    notificationItemMessage: {
      fontSize: '12px',
      color: '#64748B',
      marginBottom: '6px'
    },
    notificationItemDate: {
      fontSize: '10px',
      color: '#94A3B8'
    },
    emptyNotifications: {
      padding: '40px',
      textAlign: 'center',
      color: '#94A3B8',
      fontSize: '13px'
    },
    profileSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      position: 'relative'
    },
    profileImageContainer: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: '#B7E5CD',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    profileImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    profilePlaceholder: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#065A63'
    },
    profileInfo: {
      textAlign: 'right'
    },
    profileName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#065A63'
    },
    profileEmail: {
      fontSize: '12px',
      color: '#64748B'
    },
    mobileMenuBtn: {
      display: 'none',
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      marginRight: '16px',
      color: '#065A63'
    },
    content: {
      padding: '24px 32px',
      flex: 1
    }
  };

  // Responsive styles
  const responsiveStyles = {
    '@media (max-width: 768px)': {
      sidebar: {
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
      },
      mainContent: {
        marginLeft: 0
      },
      mobileMenuBtn: {
        display: 'block'
      },
      topBar: {
        padding: '12px 20px'
      },
      content: {
        padding: '20px'
      }
    }
  };

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <div style={{
        ...styles.sidebar,
        ...(window.innerWidth <= 768 && !sidebarOpen ? { transform: 'translateX(-100%)' } : {})
      }}>
        <div style={styles.sidebarHeader}>
          <Link to="/tenant/dashboard" style={styles.logo}>
            StudentStay
          </Link>
          <div style={styles.logoSub}>Tenant Portal</div>
        </div>
        
        <nav style={styles.nav}>
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navItem,
                ...(isActive(item.path) ? styles.navItemActive : {})
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={styles.navText}>{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <button
          style={styles.logoutBtn}
          onClick={handleLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(183, 229, 205, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(183, 229, 205, 0.1)';
          }}
        >
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.topBar}>
          <button
            style={styles.mobileMenuBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          
          {/* Notifications */}
          <div style={styles.notificationContainer}>
            <button
              style={styles.notificationBtn}
              onClick={() => setShowNotifications(!showNotifications)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F1F5F9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              🔔
              {getUnreadCount() > 0 && (
                <span style={styles.notificationBadge}>
                  {getUnreadCount()}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div style={styles.notificationDropdown}>
                <div style={styles.notificationHeader}>
                  <span style={styles.notificationTitle}>Notifications</span>
                  {getUnreadCount() > 0 && (
                    <button
                      style={styles.markAllBtn}
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div style={styles.notificationList}>
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        style={{
                          ...styles.notificationItem,
                          ...(!notification.isRead ? styles.notificationItemUnread : {})
                        }}
                        onClick={() => handleNotificationClick(notification)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#F8FAFC';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = !notification.isRead ? '#F0FDF4' : 'white';
                        }}
                      >
                        <div style={styles.notificationItemTitle}>
                          {notification.title}
                        </div>
                        <div style={styles.notificationItemMessage}>
                          {notification.message}
                        </div>
                        <div style={styles.notificationItemDate}>
                          {notification.date}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={styles.emptyNotifications}>
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Profile Section */}
          <div
            style={styles.profileSection}
            onClick={() => navigate('/tenant/profile')}
          >
            <div style={styles.profileImageContainer}>
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={tenant?.name}
                  style={styles.profileImage}
                />
              ) : (
                <div style={styles.profilePlaceholder}>
                  {tenant?.name?.charAt(0) || 'T'}
                </div>
              )}
            </div>
            <div style={styles.profileInfo}>
              <div style={styles.profileName}>
                {tenant?.name?.split(' ')[0] || 'Tenant'}
              </div>
              <div style={styles.profileEmail}>
                {tenant?.email || 'tenant@studentstay.co.za'}
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TenantLayout;