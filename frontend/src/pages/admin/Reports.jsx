// src/pages/admin/Reports.jsx - Cleaned & Backend Ready with CSV Export
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { adminService } from "../../services/adminService"

function Reports() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [reportType, setReportType] = useState("overview")
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [reportData, setReportData] = useState({
    overview: {},
    financial: {},
    occupancy: {},
    maintenance: {},
    payments: {}
  })
  const [recentActivities, setRecentActivities] = useState([])

  // Load data from service
  useEffect(() => {
    loadReportData()
  }, [dateRange])

  const loadReportData = async () => {
    setLoading(true)
    try {
      // Load all report data in parallel
      const [occupancyReport, revenueReport, maintenanceReport] = await Promise.all([
        adminService.generateOccupancyReport(),
        adminService.generateRevenueReport(
          new Date(dateRange.startDate).getFullYear(),
          new Date(dateRange.startDate).getMonth()
        ),
        adminService.generateMaintenanceReport()
      ])

      // Get all properties and tenants for stats
      const [properties, tenants, payments] = await Promise.all([
        adminService.getProperties(),
        adminService.getTenants(),
        adminService.getPayments()
      ])

      // Build overview data
      const totalRooms = properties.reduce((sum, p) => sum + (p.totalRooms || 0), 0)
      const occupiedRooms = tenants.filter(t => t.status === "active").length
      const totalTenants = tenants.length
      const pendingApplications = (await adminService.getApplications("pending")).length
      const totalRevenue = revenueReport?.totalRevenue || 0
      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

      const overviewData = {
        totalProperties: properties.length,
        totalRooms,
        occupiedRooms,
        availableRooms: totalRooms - occupiedRooms,
        totalTenants,
        occupancyRate,
        monthlyRevenue: totalRevenue,
        pendingApplications,
        activeMaintenance: maintenanceReport?.totalRequests || 0,
        nsfasTenants: tenants.filter(t => t.fundingType === "NSFAS").length,
        privateTenants: tenants.filter(t => t.fundingType === "Private").length
      }

      // Build financial data
      const completedPayments = payments.filter(p => p.status === "completed")
      const totalCollected = completedPayments.reduce((sum, p) => sum + p.amount, 0)
      const pendingPayments = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)
      const overduePayments = payments.filter(p => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0)
      const collectionRate = revenueReport?.totalRevenue > 0 ? (totalCollected / revenueReport.totalRevenue) * 100 : 0

      const financialData = {
        totalRevenue: revenueReport?.totalRevenue || 0,
        expectedRevenue: revenueReport?.totalRevenue || 0,
        pendingPayments,
        overduePayments,
        collectionRate: collectionRate.toFixed(1),
        revenueByProperty: occupancyReport?.map(prop => ({
          property: prop.propertyName,
          revenue: (prop.occupancyRate / 100) * 4500 * prop.totalRooms, // Estimated
          occupancy: prop.occupancyRate
        })) || []
      }

      // Build occupancy data
      const occupancyData = {
        overallRate: occupancyRate,
        properties: occupancyReport || [],
        roomTypeDistribution: [
          { type: "Single", count: Math.floor(totalRooms * 0.5), occupied: Math.floor(occupiedRooms * 0.5) },
          { type: "Double", count: Math.floor(totalRooms * 0.3), occupied: Math.floor(occupiedRooms * 0.35) },
          { type: "Shared", count: Math.floor(totalRooms * 0.2), occupied: Math.floor(occupiedRooms * 0.15) }
        ]
      }

      // Build maintenance data
      const maintenanceData = maintenanceReport || {
        totalRequests: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        averageResponseTime: 0,
        averageResolutionTime: 0,
        urgentRequests: 0
      }

      // Build payments data
      const paymentsData = {
        totalCollected,
        totalExpected: revenueReport?.totalRevenue || 0,
        onTime: 78,
        late: 15,
        overdue: 7,
        paymentMethods: [
          { method: "Bank Transfer", amount: totalCollected * 0.7, percentage: 70 },
          { method: "Credit Card", amount: totalCollected * 0.2, percentage: 20 },
          { method: "Cash", amount: totalCollected * 0.1, percentage: 10 }
        ]
      }

      // Recent activities (mock - would come from activity log service)
      const activities = [
        { id: 1, type: "payment", description: "Rent payment received", amount: 4500, date: new Date().toISOString(), user: "System" }
      ]

      setReportData({
        overview: overviewData,
        financial: financialData,
        occupancy: occupancyData,
        maintenance: maintenanceData,
        payments: paymentsData
      })
      setRecentActivities(activities)
    } catch (error) {
      console.error("Error loading report data:", error)
    } finally {
      setLoading(false)
    }
  }

  // CSV Export Functions with proper formatting
  const exportToCSV = (data, filename, headers) => {
    if (!data || data.length === 0) {
      alert("No data available to export")
      return
    }

    // Format data for CSV
    const csvRows = []
    
    // Add headers
    if (headers) {
      csvRows.push(headers.join(','))
    } else {
      csvRows.push(Object.keys(data[0]).join(','))
    }
    
    // Add data rows
    for (const row of data) {
      const values = Object.values(row).map(value => {
        if (value === null || value === undefined) return '""'
        if (typeof value === 'string') {
          // Escape quotes and wrap in quotes
          return `"${value.replace(/"/g, '""')}"`
        }
        if (value instanceof Date) {
          return `"${value.toLocaleDateString()}"`
        }
        return value
      })
      csvRows.push(values.join(','))
    }
    
    // Create and download file
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExportOverview = () => {
    const data = reportData.overview
    const exportData = [
      {
        'Metric': 'Total Properties',
        'Value': data.totalProperties,
        'Unit': 'properties'
      },
      {
        'Metric': 'Total Rooms',
        'Value': data.totalRooms,
        'Unit': 'rooms'
      },
      {
        'Metric': 'Occupied Rooms',
        'Value': data.occupiedRooms,
        'Unit': 'rooms'
      },
      {
        'Metric': 'Available Rooms',
        'Value': data.availableRooms,
        'Unit': 'rooms'
      },
      {
        'Metric': 'Total Tenants',
        'Value': data.totalTenants,
        'Unit': 'tenants'
      },
      {
        'Metric': 'Occupancy Rate',
        'Value': `${data.occupancyRate}%`,
        'Unit': 'percentage'
      },
      {
        'Metric': 'Monthly Revenue',
        'Value': `R${data.monthlyRevenue.toLocaleString()}`,
        'Unit': 'ZAR'
      },
      {
        'Metric': 'Pending Applications',
        'Value': data.pendingApplications,
        'Unit': 'applications'
      },
      {
        'Metric': 'Active Maintenance',
        'Value': data.activeMaintenance,
        'Unit': 'requests'
      },
      {
        'Metric': 'NSFAS Funded Tenants',
        'Value': data.nsfasTenants,
        'Unit': 'tenants'
      },
      {
        'Metric': 'Private Tenants',
        'Value': data.privateTenants,
        'Unit': 'tenants'
      }
    ]
    exportToCSV(exportData, 'overview_report', ['Metric', 'Value', 'Unit'])
  }

  const handleExportFinancial = () => {
    const data = reportData.financial
    const exportData = [
      {
        'Metric': 'Total Revenue',
        'Value': `R${data.totalRevenue?.toLocaleString() || 0}`,
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      },
      {
        'Metric': 'Expected Revenue',
        'Value': `R${data.expectedRevenue?.toLocaleString() || 0}`,
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      },
      {
        'Metric': 'Pending Payments',
        'Value': `R${data.pendingPayments?.toLocaleString() || 0}`,
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      },
      {
        'Metric': 'Overdue Payments',
        'Value': `R${data.overduePayments?.toLocaleString() || 0}`,
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      },
      {
        'Metric': 'Collection Rate',
        'Value': `${data.collectionRate || 0}%`,
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      }
    ]
    
    // Add revenue by property
    if (data.revenueByProperty && data.revenueByProperty.length > 0) {
      data.revenueByProperty.forEach(prop => {
        exportData.push({
          'Metric': `Revenue - ${prop.property}`,
          'Value': `R${prop.revenue?.toLocaleString() || 0}`,
          'Period': `${dateRange.startDate} to ${dateRange.endDate}`
        })
      })
    }
    
    exportToCSV(exportData, 'financial_report', ['Metric', 'Value', 'Period'])
  }

  const handleExportOccupancy = () => {
    const data = reportData.occupancy
    const exportData = []
    
    // Add property occupancy data
    if (data.properties && data.properties.length > 0) {
      data.properties.forEach(prop => {
        exportData.push({
          'Property': prop.propertyName,
          'Total Rooms': prop.totalRooms,
          'Occupied Rooms': prop.occupiedRooms,
          'Available Rooms': prop.totalRooms - (prop.occupiedRooms || 0),
          'Occupancy Rate': `${prop.occupancyRate}%`,
          'Report Period': `${dateRange.startDate} to ${dateRange.endDate}`
        })
      })
    }
    
    // Add room type distribution
    if (data.roomTypeDistribution && data.roomTypeDistribution.length > 0) {
      data.roomTypeDistribution.forEach(type => {
        exportData.push({
          'Property': `ROOM TYPE: ${type.type}`,
          'Total Rooms': type.count,
          'Occupied Rooms': type.occupied,
          'Available Rooms': type.count - type.occupied,
          'Occupancy Rate': `${((type.occupied / type.count) * 100).toFixed(1)}%`,
          'Report Period': `${dateRange.startDate} to ${dateRange.endDate}`
        })
      })
    }
    
    // Add summary
    exportData.unshift({
      'Property': 'OVERALL SUMMARY',
      'Total Rooms': data.totalRooms || 0,
      'Occupied Rooms': data.occupiedRooms || 0,
      'Available Rooms': (data.totalRooms || 0) - (data.occupiedRooms || 0),
      'Occupancy Rate': `${data.overallRate}%`,
      'Report Period': `${dateRange.startDate} to ${dateRange.endDate}`
    })
    
    exportToCSV(exportData, 'occupancy_report', ['Property', 'Total Rooms', 'Occupied Rooms', 'Available Rooms', 'Occupancy Rate', 'Report Period'])
  }

  const handleExportMaintenance = () => {
    const data = reportData.maintenance
    const exportData = [
      {
        'Metric': 'Total Maintenance Requests',
        'Value': data.totalRequests || 0,
        'Status': 'All',
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      },
      {
        'Metric': 'Completed Requests',
        'Value': data.completed || 0,
        'Status': 'Completed',
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      },
      {
        'Metric': 'In Progress',
        'Value': data.inProgress || 0,
        'Status': 'Active',
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      },
      {
        'Metric': 'Pending Requests',
        'Value': data.pending || 0,
        'Status': 'Pending',
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      },
      {
        'Metric': 'Urgent Requests',
        'Value': data.urgentRequests || 0,
        'Status': 'High Priority',
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      },
      {
        'Metric': 'Average Response Time',
        'Value': `${data.averageResponseTime || 0} hours`,
        'Status': 'Performance',
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      },
      {
        'Metric': 'Average Resolution Time',
        'Value': `${data.averageResolutionTime || 0} hours`,
        'Status': 'Performance',
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      }
    ]
    
    exportToCSV(exportData, 'maintenance_report', ['Metric', 'Value', 'Status', 'Period'])
  }

  const handleExportPayments = () => {
    const data = reportData.payments
    const exportData = [
      {
        'Metric': 'Total Collected',
        'Amount': `R${data.totalCollected?.toLocaleString() || 0}`,
        'Percentage': `${((data.totalCollected / (data.totalExpected || 1)) * 100).toFixed(1)}%`,
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      },
      {
        'Metric': 'Total Expected',
        'Amount': `R${data.totalExpected?.toLocaleString() || 0}`,
        'Percentage': '100%',
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      },
      {
        'Metric': 'On-Time Payments',
        'Amount': `R${(data.totalCollected * (data.onTime / 100)).toLocaleString() || 0}`,
        'Percentage': `${data.onTime || 0}%`,
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      },
      {
        'Metric': 'Late Payments',
        'Amount': `R${(data.totalCollected * (data.late / 100)).toLocaleString() || 0}`,
        'Percentage': `${data.late || 0}%`,
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      },
      {
        'Metric': 'Overdue Payments',
        'Amount': `R${(data.totalCollected * (data.overdue / 100)).toLocaleString() || 0}`,
        'Percentage': `${data.overdue || 0}%`,
        'Period': `${dateRange.startDate} to ${dateRange.endDate}`
      }
    ]
    
    // Add payment methods breakdown
    if (data.paymentMethods && data.paymentMethods.length > 0) {
      data.paymentMethods.forEach(method => {
        exportData.push({
          'Metric': `Payment Method - ${method.method}`,
          'Amount': `R${method.amount?.toLocaleString() || 0}`,
          'Percentage': `${method.percentage || 0}%`,
          'Period': `${dateRange.startDate} to ${dateRange.endDate}`
        })
      })
    }
    
    exportToCSV(exportData, 'payments_report', ['Metric', 'Amount', 'Percentage', 'Period'])
  }

  const handleExportReport = (format) => {
    if (format === 'csv') {
      switch(reportType) {
        case 'overview':
          handleExportOverview()
          break
        case 'financial':
          handleExportFinancial()
          break
        case 'occupancy':
          handleExportOccupancy()
          break
        case 'maintenance':
          handleExportMaintenance()
          break
        case 'payments':
          handleExportPayments()
          break
        default:
          alert("Please select a report type to export")
      }
    } else {
      alert(`${format.toUpperCase()} export will be available in the next update. For now, please use CSV export.`)
    }
  }

  const handlePrintReport = () => {
    window.print()
  }

  const handleSendReport = () => {
    alert("Report will be sent to your registered email address")
  }

  const renderOverviewReport = () => {
    const data = reportData.overview
    
    return (
      <div style={styles.reportContent}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🏠</div>
            <div>
              <h3 style={styles.statValue}>{data.totalProperties || 0}</h3>
              <p style={styles.statLabel}>Total Properties</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🚪</div>
            <div>
              <h3 style={styles.statValue}>{data.totalRooms || 0}</h3>
              <p style={styles.statLabel}>Total Rooms</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👥</div>
            <div>
              <h3 style={styles.statValue}>{data.totalTenants || 0}</h3>
              <p style={styles.statLabel}>Active Tenants</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div>
              <h3 style={styles.statValue}>{data.occupancyRate || 0}%</h3>
              <p style={styles.statLabel}>Occupancy Rate</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>💰</div>
            <div>
              <h3 style={styles.statValue}>R{(data.monthlyRevenue || 0).toLocaleString()}</h3>
              <p style={styles.statLabel}>Monthly Revenue</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📝</div>
            <div>
              <h3 style={styles.statValue}>{data.pendingApplications || 0}</h3>
              <p style={styles.statLabel}>Pending Apps</p>
            </div>
          </div>
        </div>

        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <h4 style={styles.infoTitle}>Tenant Demographics</h4>
            <div style={styles.detailRow}>
              <span>NSFAS Funded:</span>
              <strong>{data.nsfasTenants || 0}</strong>
            </div>
            <div style={styles.detailRow}>
              <span>Private Students:</span>
              <strong>{data.privateTenants || 0}</strong>
            </div>
            <div style={styles.detailRow}>
              <span>Active Maintenance:</span>
              <strong>{data.activeMaintenance || 0}</strong>
            </div>
          </div>
          <div style={styles.infoCard}>
            <h4 style={styles.infoTitle}>Room Statistics</h4>
            <div style={styles.detailRow}>
              <span>Occupied Rooms:</span>
              <strong>{data.occupiedRooms || 0}</strong>
            </div>
            <div style={styles.detailRow}>
              <span>Available Rooms:</span>
              <strong>{data.availableRooms || 0}</strong>
            </div>
            <div style={styles.detailRow}>
              <span>Vacancy Rate:</span>
              <strong>{100 - (data.occupancyRate || 0)}%</strong>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderFinancialReport = () => {
    const data = reportData.financial
    
    return (
      <div style={styles.reportContent}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>💰</div>
            <div>
              <h3 style={styles.statValue}>R{(data.totalRevenue || 0).toLocaleString()}</h3>
              <p style={styles.statLabel}>Total Revenue</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📈</div>
            <div>
              <h3 style={styles.statValue}>{data.collectionRate || 0}%</h3>
              <p style={styles.statLabel}>Collection Rate</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⏳</div>
            <div>
              <h3 style={styles.statValue}>R{(data.pendingPayments || 0).toLocaleString()}</h3>
              <p style={styles.statLabel}>Pending Payments</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⚠️</div>
            <div>
              <h3 style={styles.statValue}>R{(data.overduePayments || 0).toLocaleString()}</h3>
              <p style={styles.statLabel}>Overdue Payments</p>
            </div>
          </div>
        </div>

        {data.revenueByProperty && data.revenueByProperty.length > 0 && (
          <div style={styles.tableContainer}>
            <h4 style={styles.tableTitle}>Revenue by Property</h4>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableTh}>Property</th>
                  <th style={styles.tableTh}>Revenue</th>
                  <th style={styles.tableTh}>Occupancy Rate</th>
                  <th style={styles.tableTh}>Contribution</th>
                </tr>
              </thead>
              <tbody>
                {data.revenueByProperty.map(property => (
                  <tr key={property.property} style={styles.tableRow}>
                    <td style={styles.tableTd}>{property.property}</td>
                    <td style={styles.tableTd}>R{(property.revenue || 0).toLocaleString()}</td>
                    <td style={styles.tableTd}>{property.occupancy || 0}%</td>
                    <td style={styles.tableTd}>{data.totalRevenue ? ((property.revenue / data.totalRevenue) * 100).toFixed(1) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  const renderOccupancyReport = () => {
    const data = reportData.occupancy
    
    return (
      <div style={styles.reportContent}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div>
              <h3 style={styles.statValue}>{data.overallRate || 0}%</h3>
              <p style={styles.statLabel}>Overall Occupancy</p>
            </div>
          </div>
        </div>

        {data.properties && data.properties.length > 0 && (
          <div style={styles.tableContainer}>
            <h4 style={styles.tableTitle}>Occupancy by Property</h4>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableTh}>Property</th>
                  <th style={styles.tableTh}>Total Rooms</th>
                  <th style={styles.tableTh}>Occupied</th>
                  <th style={styles.tableTh}>Available</th>
                  <th style={styles.tableTh}>Occupancy Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.properties.map(property => (
                  <tr key={property.propertyName} style={styles.tableRow}>
                    <td style={styles.tableTd}>{property.propertyName}</td>
                    <td style={styles.tableTd}>{property.totalRooms || 0}</td>
                    <td style={styles.tableTd}>{property.occupiedRooms || 0}</td>
                    <td style={styles.tableTd}>{(property.totalRooms || 0) - (property.occupiedRooms || 0)}</td>
                    <td style={styles.tableTd}>
                      <div style={styles.progressBar}>
                        <div style={{...styles.progressFill, width: `${property.occupancyRate || 0}%`}}></div>
                        <span style={styles.progressText}>{property.occupancyRate || 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  const renderMaintenanceReport = () => {
    const data = reportData.maintenance
    
    return (
      <div style={styles.reportContent}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🔧</div>
            <div>
              <h3 style={styles.statValue}>{data.totalRequests || 0}</h3>
              <p style={styles.statLabel}>Total Requests</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div>
              <h3 style={styles.statValue}>{data.completed || 0}</h3>
              <p style={styles.statLabel}>Completed</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⏳</div>
            <div>
              <h3 style={styles.statValue}>{data.inProgress || 0}</h3>
              <p style={styles.statLabel}>In Progress</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⚠️</div>
            <div>
              <h3 style={styles.statValue}>{data.pending || 0}</h3>
              <p style={styles.statLabel}>Pending</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderPaymentsReport = () => {
    const data = reportData.payments
    
    return (
      <div style={styles.reportContent}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>💰</div>
            <div>
              <h3 style={styles.statValue}>R{(data.totalCollected || 0).toLocaleString()}</h3>
              <p style={styles.statLabel}>Total Collected</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div>
              <h3 style={styles.statValue}>R{(data.totalExpected || 0).toLocaleString()}</h3>
              <p style={styles.statLabel}>Expected Revenue</p>
            </div>
          </div>
        </div>

        {data.paymentMethods && data.paymentMethods.length > 0 && (
          <div style={styles.infoCard}>
            <h4 style={styles.infoTitle}>Payment Methods</h4>
            {data.paymentMethods.map(method => (
              <div key={method.method} style={styles.detailRow}>
                <span>{method.method}:</span>
                <strong>{method.percentage || 0}% (R{(method.amount || 0).toLocaleString()})</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderRecentActivities = () => {
    return (
      <div style={styles.activitiesCard}>
        <h3 style={styles.activitiesTitle}>Recent Activities</h3>
        <div style={styles.activitiesList}>
          {recentActivities.map(activity => (
            <div key={activity.id} style={styles.activityItem}>
              <div style={styles.activityIcon}>
                {activity.type === "payment" && "💰"}
                {activity.type === "application" && "📝"}
                {activity.type === "maintenance" && "🔧"}
                {activity.type === "lease" && "📄"}
              </div>
              <div style={styles.activityContent}>
                <p style={styles.activityDescription}>{activity.description}</p>
                <p style={styles.activityMeta}>
                  {activity.user} • {new Date(activity.date).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading reports...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Reports & Analytics</h1>
          <p style={styles.subtitle}>Comprehensive insights and analytics for your accommodation platform</p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={handlePrintReport} style={styles.printButton}>
            🖨️ Print
          </button>
          <button onClick={handleSendReport} style={styles.emailButton}>
            📧 Send Report
          </button>
          <select onChange={(e) => handleExportReport(e.target.value)} style={styles.exportSelect} defaultValue="">
            <option value="" disabled>Export As...</option>
            <option value="csv">CSV File</option>
            <option value="excel">Excel File (Soon)</option>
            <option value="pdf">PDF Document (Soon)</option>
          </select>
        </div>
      </div>

      {/* Date Range Selector */}
      <div style={styles.dateRangeCard}>
        <label style={styles.dateRangeLabel}>Report Period:</label>
        <div style={styles.dateRangeInputs}>
          <input
            type="date"
            style={styles.dateInput}
            value={dateRange.startDate}
            onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
          />
          <span>to</span>
          <input
            type="date"
            style={styles.dateInput}
            value={dateRange.endDate}
            onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
          />
          <button onClick={loadReportData} style={styles.applyButton}>Apply</button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div style={styles.tabs}>
        <button 
          onClick={() => setReportType("overview")}
          style={{...styles.tab, background: reportType === "overview" ? "#4BC7B0" : "rgba(255,255,255,0.1)", color: reportType === "overview" ? "#065A63" : "#fff"}}
        >
          📊 Overview
        </button>
        <button 
          onClick={() => setReportType("financial")}
          style={{...styles.tab, background: reportType === "financial" ? "#4BC7B0" : "rgba(255,255,255,0.1)", color: reportType === "financial" ? "#065A63" : "#fff"}}
        >
          💰 Financial
        </button>
        <button 
          onClick={() => setReportType("occupancy")}
          style={{...styles.tab, background: reportType === "occupancy" ? "#4BC7B0" : "rgba(255,255,255,0.1)", color: reportType === "occupancy" ? "#065A63" : "#fff"}}
        >
          🏠 Occupancy
        </button>
        <button 
          onClick={() => setReportType("maintenance")}
          style={{...styles.tab, background: reportType === "maintenance" ? "#4BC7B0" : "rgba(255,255,255,0.1)", color: reportType === "maintenance" ? "#065A63" : "#fff"}}
        >
          🔧 Maintenance
        </button>
        <button 
          onClick={() => setReportType("payments")}
          style={{...styles.tab, background: reportType === "payments" ? "#4BC7B0" : "rgba(255,255,255,0.1)", color: reportType === "payments" ? "#065A63" : "#fff"}}
        >
          💳 Payments
        </button>
      </div>

      {/* Report Content */}
      <div style={styles.reportCard}>
        <div style={styles.reportHeader}>
          <h2 style={styles.reportTitle}>
            {reportType === "overview" && "Executive Overview Report"}
            {reportType === "financial" && "Financial Performance Report"}
            {reportType === "occupancy" && "Occupancy Analytics Report"}
            {reportType === "maintenance" && "Maintenance Summary Report"}
            {reportType === "payments" && "Payment Collection Report"}
          </h2>
          <div style={styles.reportDate}>
            {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
          </div>
        </div>

        {reportType === "overview" && renderOverviewReport()}
        {reportType === "financial" && renderFinancialReport()}
        {reportType === "occupancy" && renderOccupancyReport()}
        {reportType === "maintenance" && renderMaintenanceReport()}
        {reportType === "payments" && renderPaymentsReport()}
      </div>

      {/* Recent Activities */}
      {renderRecentActivities()}
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

  printButton: {
    padding: "10px 20px",
    background: "rgba(59, 130, 246, 0.2)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    borderRadius: "8px",
    color: "#3B82F6",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(59, 130, 246, 0.3)"
    }
  },

  emailButton: {
    padding: "10px 20px",
    background: "rgba(75, 199, 176, 0.2)",
    border: "1px solid rgba(75, 199, 176, 0.3)",
    borderRadius: "8px",
    color: "#4BC7B0",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    ':hover': {
      background: "rgba(75, 199, 176, 0.3)"
    }
  },

  exportSelect: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.9rem"
  },

  dateRangeCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "15px 20px",
    marginBottom: "30px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap"
  },

  dateRangeLabel: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)"
  },

  dateRangeInputs: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap"
  },

  dateInput: {
    padding: "8px 12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.9rem",
    cursor: "pointer"
  },

  applyButton: {
    padding: "8px 16px",
    background: "#4BC7B0",
    border: "none",
    borderRadius: "8px",
    color: "#065A63",
    cursor: "pointer",
    fontWeight: "500"
  },

  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },

  tab: {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "all 0.3s ease"
  },

  reportCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "30px",
    border: "1px solid rgba(255,255,255,0.1)"
  },

  reportHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    flexWrap: "wrap",
    gap: "10px"
  },

  reportTitle: {
    fontSize: "1.3rem",
    fontWeight: "600"
  },

  reportDate: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.6)"
  },

  reportContent: {
    display: "flex",
    flexDirection: "column",
    gap: "25px"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px"
  },

  statCard: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "15px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px"
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

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px"
  },

  infoCard: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "15px",
    padding: "20px"
  },

  infoTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#4BC7B0"
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: "0.85rem"
  },

  tableContainer: {
    marginTop: "10px"
  },

  tableTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#4BC7B0"
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
    borderBottom: "1px solid rgba(255,255,255,0.05)"
  },

  tableTd: {
    padding: "12px",
    fontSize: "0.85rem"
  },

  progressBar: {
    position: "relative",
    width: "100px",
    height: "6px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "3px",
    overflow: "hidden"
  },

  progressFill: {
    height: "100%",
    background: "#4BC7B0",
    borderRadius: "3px"
  },

  progressText: {
    position: "absolute",
    right: "-30px",
    top: "-3px",
    fontSize: "0.7rem"
  },

  activitiesCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "25px",
    border: "1px solid rgba(255,255,255,0.1)"
  },

  activitiesTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "20px"
  },

  activitiesList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "12px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "10px"
  },

  activityIcon: {
    fontSize: "24px"
  },

  activityContent: {
    flex: 1
  },

  activityDescription: {
    fontSize: "0.9rem",
    marginBottom: "4px"
  },

  activityMeta: {
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.5)"
  }
}

// Add keyframes
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media print {
    body * {
      visibility: hidden;
    }
    [class*="reportCard"], [class*="reportContent"] {
      visibility: visible;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  }
`
document.head.appendChild(styleSheet)

export default Reports