import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function TenantPayment() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card")
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    monthsToPay: 1,
    customAmount: "",
    paymentMethod: "card",
    savePaymentMethod: false
  })
  
  const [paymentInfo, setPaymentInfo] = useState({
    currentBalance: 0,
    nextPaymentDue: "",
    minimumPayment: 0,
    outstandingMonths: []
  })
  
  const [transactions, setTransactions] = useState([])
  const [upcomingPayments, setUpcomingPayments] = useState([])
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([])

  useEffect(() => {
    // Mock API call - replace with actual API
    setTimeout(() => {
      setPaymentInfo({
        currentBalance: 4500,
        nextPaymentDue: "2024-12-01",
        minimumPayment: 4500,
        outstandingMonths: [
          { month: "December 2024", amount: 4500, dueDate: "2024-12-01", status: "pending" }
        ]
      })
      
      setTransactions([
        {
          id: "TXN001",
          date: "2024-11-01",
          amount: 4500,
          type: "rent",
          description: "November 2024 Rent Payment",
          status: "completed",
          paymentMethod: "Credit Card",
          reference: "RENT-NOV-2024"
        },
        {
          id: "TXN002",
          date: "2024-10-01",
          amount: 4500,
          type: "rent",
          description: "October 2024 Rent Payment",
          status: "completed",
          paymentMethod: "Bank Transfer",
          reference: "RENT-OCT-2024"
        },
        {
          id: "TXN003",
          date: "2024-09-01",
          amount: 4500,
          type: "rent",
          description: "September 2024 Rent Payment",
          status: "completed",
          paymentMethod: "Credit Card",
          reference: "RENT-SEP-2024"
        },
        {
          id: "TXN004",
          date: "2024-08-15",
          amount: 500,
          type: "deposit",
          description: "Security Deposit Payment",
          status: "completed",
          paymentMethod: "Bank Transfer",
          reference: "DEP-2024"
        }
      ])
      
      setUpcomingPayments([
        {
          id: "UP001",
          month: "December 2024",
          amount: 4500,
          dueDate: "2024-12-01",
          status: "upcoming"
        },
        {
          id: "UP002",
          month: "January 2025",
          amount: 4500,
          dueDate: "2025-01-01",
          status: "upcoming"
        }
      ])
      
      setSavedPaymentMethods([
        { id: 1, type: "card", last4: "4242", brand: "Visa", expiry: "12/25" },
        { id: 2, type: "card", last4: "5555", brand: "Mastercard", expiry: "08/24" }
      ])
      
      setLoading(false)
    }, 1000)
  }, [])

  const handlePaymentAmount = () => {
    if (paymentData.customAmount) {
      return parseFloat(paymentData.customAmount)
    }
    return paymentInfo.currentBalance * paymentData.monthsToPay
  }

  const handleProcessPayment = async () => {
    setProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      const newTransaction = {
        id: `TXN${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().split('T')[0],
        amount: handlePaymentAmount(),
        type: "rent",
        description: `${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Rent Payment`,
        status: "completed",
        paymentMethod: selectedPaymentMethod === "card" ? "Credit Card" : "Bank Transfer",
        reference: `PAY-${Date.now()}`
      }
      
      setTransactions([newTransaction, ...transactions])
      setShowPaymentModal(false)
      setProcessing(false)
      setPaymentData({
        amount: 0,
        monthsToPay: 1,
        customAmount: "",
        paymentMethod: "card",
        savePaymentMethod: false
      })
      
      alert("Payment processed successfully! Receipt has been sent to your email.")
    }, 2000)
  }

  const downloadReceipt = (transaction) => {
    alert(`Downloading receipt for transaction ${transaction.reference || transaction.id}`)
  }

  const setupAutoPay = () => {
    alert("Auto-pay setup feature will be available soon! You'll be notified when ready.")
  }

  const handleViewPaymentHistory = () => {
    alert("Full payment history will be available here. All transactions are shown below.")
  }

  const handleDownloadTaxStatement = () => {
    alert("Tax statement download will be available at the end of the financial year.")
  }

  const handleAddPaymentMethod = () => {
    alert("Add new payment method feature coming soon. You can add a card during payment.")
  }

  const handleSetDefaultMethod = (method) => {
    alert(`Set ${method.brand} ending in ${method.last4} as default payment method.`)
  }

  const handlePayNowFromTable = (payment) => {
    setShowPaymentModal(true)
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading payment information...</p>
      </div>
    )
  }

  return (
    <div style={styles.paymentContainer}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Payments</h1>
          <p style={styles.subtitle}>Manage your rent payments and view transaction history</p>
        </div>
        <button 
          style={styles.payNowButton}
          onClick={() => setShowPaymentModal(true)}
        >
           Pay Now
        </button>
      </div>

      {/* Payment Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>💰</div>
          <div>
            <p style={styles.summaryLabel}>Current Balance</p>
            <h2 style={styles.summaryAmount}>R {paymentInfo.currentBalance.toLocaleString()}</h2>
            <p style={styles.summaryDue}>Due by: {new Date(paymentInfo.nextPaymentDue).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>🏠</div>
          <div>
            <p style={styles.summaryLabel}>Monthly Rent</p>
            <h2 style={styles.summaryAmount}>R {paymentInfo.minimumPayment.toLocaleString()}</h2>
            <p style={styles.summaryDue}>Includes utilities & WiFi</p>
          </div>
        </div>
        
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>📅</div>
          <div>
            <p style={styles.summaryLabel}>Next Payment</p>
            <h2 style={styles.summaryAmount}>Due {new Date(paymentInfo.nextPaymentDue).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h2>
            <button style={styles.reminderButton} onClick={setupAutoPay}>
              Set Auto-pay
            </button>
          </div>
        </div>
      </div>

      {/* Payment Methods Card Only - Removed Quick Actions */}
      <div style={styles.actionGrid}>
        <div style={styles.paymentMethodsCard}>
          <h3 style={styles.cardTitle}>Saved Payment Methods</h3>
          {savedPaymentMethods.length === 0 ? (
            <div style={styles.noMethods}>
              <p>No saved payment methods</p>
              <button 
                style={styles.addMethodButton} 
                onClick={handleAddPaymentMethod}
              >
                + Add Payment Method
              </button>
            </div>
          ) : (
            <div style={styles.methodsList}>
              {savedPaymentMethods.map(method => (
                <div key={method.id} style={styles.methodItem}>
                  <div style={styles.methodIcon}>
                    {method.brand === "Visa" ? "💳" : "💳"}
                  </div>
                  <div style={styles.methodDetails}>
                    <p style={styles.methodBrand}>{method.brand} •••• {method.last4}</p>
                    <p style={styles.methodExpiry}>Expires {method.expiry}</p>
                  </div>
                  <button 
                    style={styles.methodAction}
                    onClick={() => handleSetDefaultMethod(method)}
                  >
                    Set Default
                  </button>
                </div>
              ))}
              <button 
                style={styles.addMethodButton}
                onClick={handleAddPaymentMethod}
              >
                + Add New Card
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Payments */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Upcoming Payments</h2>
        <div style={styles.upcomingTable}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableTh}>Month</th>
                <th style={styles.tableTh}>Amount</th>
                <th style={styles.tableTh}>Due Date</th>
                <th style={styles.tableTh}>Status</th>
                <th style={styles.tableTh}>Action</th>
              </tr>
            </thead>
            <tbody>
              {upcomingPayments.map(payment => (
                <tr key={payment.id} style={styles.tableRow}>
                  <td style={styles.tableTd}>{payment.month}</td>
                  <td style={styles.tableTd}>R {payment.amount.toLocaleString()}</td>
                  <td style={styles.tableTd}>{new Date(payment.dueDate).toLocaleDateString()}</td>
                  <td style={styles.tableTd}>
                    <span style={styles.upcomingBadge}>Upcoming</span>
                  </td>
                  <td style={styles.tableTd}>
                    <button 
                      style={styles.payNowTableBtn}
                      onClick={() => handlePayNowFromTable(payment)}
                    >
                      Pay Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Transaction History</h2>
        <div style={styles.historyTable}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableTh}>Date</th>
                <th style={styles.tableTh}>Description</th>
                <th style={styles.tableTh}>Amount</th>
                <th style={styles.tableTh}>Method</th>
                <th style={styles.tableTh}>Status</th>
                <th style={styles.tableTh}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id} style={styles.tableRow}>
                  <td style={styles.tableTd}>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td style={styles.tableTd}>{transaction.description}</td>
                  <td style={styles.tableTd}>
                    <span style={transaction.type === 'deposit' ? styles.depositAmount : styles.paymentAmount}>
                      {transaction.type === 'deposit' ? '+' : '-'} R {transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td style={styles.tableTd}>{transaction.paymentMethod}</td>
                  <td style={styles.tableTd}>
                    <span style={styles.completedBadge}>✓ Completed</span>
                  </td>
                  <td style={styles.tableTd}>
                    <button 
                      style={styles.receiptButton}
                      onClick={() => downloadReceipt(transaction)}
                    >
                      📄 Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Tips */}
      <div style={styles.tipsCard}>
        <h3 style={styles.tipsTitle}>💡 Payment Tips</h3>
        <div style={styles.tipsGrid}>
          <div style={styles.tipItem}>
            <p>Pay before the 1st of each month to avoid late fees</p>
          </div>
          <div style={styles.tipItem}>
            <p>Setup auto-pay for hassle-free monthly payments</p>
          </div>
          <div style={styles.tipItem}>
            <p>Receipts are automatically sent to your registered email</p>
          </div>
          <div style={styles.tipItem}>           
            <p>All payments are securely processed via encrypted connection</p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div style={styles.modalOverlay} onClick={() => setShowPaymentModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Make a Payment</h2>
              <button style={styles.closeButton} onClick={() => setShowPaymentModal(false)}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              {/* Payment Amount Selection */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Payment Amount</label>
                <div style={styles.amountOptions}>
                  <button 
                    style={{...styles.amountOption, background: paymentData.monthsToPay === 1 ? '#4BC7B0' : 'rgba(255,255,255,0.1)'}}
                    onClick={() => setPaymentData({...paymentData, monthsToPay: 1, customAmount: ""})}
                  >
                    1 Month
                  </button>
                  <button 
                    style={{...styles.amountOption, background: paymentData.monthsToPay === 3 ? '#4BC7B0' : 'rgba(255,255,255,0.1)'}}
                    onClick={() => setPaymentData({...paymentData, monthsToPay: 3, customAmount: ""})}
                  >
                    3 Months
                  </button>
                  <button 
                    style={{...styles.amountOption, background: paymentData.monthsToPay === 6 ? '#4BC7B0' : 'rgba(255,255,255,0.1)'}}
                    onClick={() => setPaymentData({...paymentData, monthsToPay: 6, customAmount: ""})}
                  >
                    6 Months
                  </button>
                  <button 
                    style={{...styles.amountOption, background: paymentData.customAmount ? '#4BC7B0' : 'rgba(255,255,255,0.1)'}}
                    onClick={() => setPaymentData({...paymentData, monthsToPay: 0})}
                  >
                    Custom
                  </button>
                </div>
                
                {paymentData.customAmount !== "" && (
                  <input
                    type="number"
                    style={styles.customAmountInput}
                    placeholder="Enter amount"
                    value={paymentData.customAmount}
                    onChange={(e) => setPaymentData({...paymentData, customAmount: e.target.value, monthsToPay: 0})}
                  />
                )}
                
                <div style={styles.totalAmount}>
                  <span>Total Amount:</span>
                  <strong>R {handlePaymentAmount().toLocaleString()}</strong>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Payment Method</label>
                <div style={styles.methodOptions}>
                  <label style={styles.methodRadio}>
                    <input
                      type="radio"
                      value="card"
                      checked={selectedPaymentMethod === "card"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <span>💳 Credit/Debit Card</span>
                  </label>
                  <label style={styles.methodRadio}>
                    <input
                      type="radio"
                      value="bank"
                      checked={selectedPaymentMethod === "bank"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <span>🏦 Bank Transfer</span>
                  </label>
                </div>
              </div>

              {/* Card Details (if card selected) */}
              {selectedPaymentMethod === "card" && (
                <div style={styles.cardDetails}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Card Number</label>
                    <input type="text" style={styles.input} placeholder="1234 5678 9012 3456" />
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Expiry Date</label>
                      <input type="text" style={styles.input} placeholder="MM/YY" />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>CVV</label>
                      <input type="text" style={styles.input} placeholder="123" />
                    </div>
                  </div>
                  <label style={styles.checkbox}>
                    <input type="checkbox" checked={paymentData.savePaymentMethod} onChange={(e) => setPaymentData({...paymentData, savePaymentMethod: e.target.checked})} />
                    <span>Save this card for future payments</span>
                  </label>
                </div>
              )}

              {/* Bank Transfer Details */}
              {selectedPaymentMethod === "bank" && (
                <div style={styles.bankDetails}>
                  <p style={styles.bankInfo}>Please transfer to the following account:</p>
                  <div style={styles.bankAccount}>
                    <p><strong>Bank:</strong> Standard Bank</p>
                    <p><strong>Account Name:</strong> Student Accommodation Pty Ltd</p>
                    <p><strong>Account Number:</strong> 123 456 7890</p>
                    <p><strong>Branch Code:</strong> 051001</p>
                    <p><strong>Reference:</strong> Your Student ID + Month</p>
                  </div>
                  <div style={styles.uploadProof}>
                    <label style={styles.label}>Upload Proof of Payment</label>
                    <input type="file" style={styles.fileInput} accept="image/*,.pdf" />
                  </div>
                </div>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.cancelModalButton} onClick={() => setShowPaymentModal(false)}>
                Cancel
              </button>
              <button 
                style={styles.processButton} 
                onClick={handleProcessPayment}
                disabled={processing}
              >
                {processing ? "Processing..." : `Pay R ${handlePaymentAmount().toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  paymentContainer: {
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

  payNowButton: {
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

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  },

  summaryCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "25px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    border: "1px solid rgba(255,255,255,0.1)"
  },

  summaryIcon: {
    fontSize: "40px"
  },

  summaryLabel: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)",
    marginBottom: "5px"
  },

  summaryAmount: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "5px"
  },

  summaryDue: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.6)"
  },

  reminderButton: {
    marginTop: "8px",
    padding: "6px 12px",
    background: "rgba(75, 199, 176, 0.2)",
    border: "1px solid rgba(75, 199, 176, 0.3)",
    borderRadius: "8px",
    color: "#4BC7B0",
    cursor: "pointer",
    fontSize: "0.8rem"
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
    marginBottom: "30px"
  },

  paymentMethodsCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "25px",
    border: "1px solid rgba(255,255,255,0.1)"
  },

  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "15px"
  },

  methodsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  methodItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px"
  },

  methodIcon: {
    fontSize: "24px"
  },

  methodDetails: {
    flex: 1
  },

  methodBrand: {
    fontSize: "0.9rem",
    fontWeight: "500"
  },

  methodExpiry: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.6)"
  },

  methodAction: {
    padding: "6px 12px",
    background: "rgba(75, 199, 176, 0.2)",
    border: "none",
    borderRadius: "8px",
    color: "#4BC7B0",
    cursor: "pointer",
    fontSize: "0.8rem"
  },

  addMethodButton: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "rgba(255,255,255,0.05)",
    border: "1px dashed rgba(255,255,255,0.3)",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer"
  },

  noMethods: {
    textAlign: "center",
    padding: "20px",
    color: "rgba(255,255,255,0.6)"
  },

  section: {
    marginBottom: "40px"
  },

  sectionTitle: {
    fontSize: "1.4rem",
    marginBottom: "20px",
    fontWeight: "600"
  },

  upcomingTable: {
    overflowX: "auto"
  },

  historyTable: {
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
    padding: "15px",
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500"
  },

  tableRow: {
    borderBottom: "1px solid rgba(255,255,255,0.05)"
  },

  tableTd: {
    padding: "15px",
    fontSize: "0.9rem"
  },

  upcomingBadge: {
    padding: "4px 10px",
    background: "rgba(245, 158, 11, 0.2)",
    borderRadius: "12px",
    fontSize: "0.75rem",
    color: "#F59E0B"
  },

  completedBadge: {
    padding: "4px 10px",
    background: "rgba(16, 185, 129, 0.2)",
    borderRadius: "12px",
    fontSize: "0.75rem",
    color: "#10B981"
  },

  paymentAmount: {
    color: "#EF4444",
    fontWeight: "500"
  },

  depositAmount: {
    color: "#10B981",
    fontWeight: "500"
  },

  payNowTableBtn: {
    padding: "6px 12px",
    background: "#4BC7B0",
    color: "#065A63",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: "600"
  },

  receiptButton: {
    padding: "6px 12px",
    background: "rgba(255,255,255,0.1)",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.8rem"
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

  amountOptions: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
    marginBottom: "15px"
  },

  amountOption: {
    padding: "10px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s"
  },

  customAmountInput: {
    width: "100%",
    padding: "10px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "1rem",
    marginTop: "10px"
  },

  totalAmount: {
    marginTop: "15px",
    padding: "15px",
    background: "rgba(75, 199, 176, 0.1)",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1.1rem"
  },

  methodOptions: {
    display: "flex",
    gap: "15px"
  },

  methodRadio: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer"
  },

  cardDetails: {
    marginTop: "15px"
  },

  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "15px"
  },

  input: {
    width: "100%",
    padding: "10px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.95rem"
  },

  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "10px",
    cursor: "pointer"
  },

  bankDetails: {
    marginTop: "15px"
  },

  bankInfo: {
    marginBottom: "10px",
    color: "rgba(255,255,255,0.8)"
  },

  bankAccount: {
    padding: "15px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "10px",
    marginBottom: "15px",
    fontSize: "0.9rem"
  },

  uploadProof: {
    marginTop: "10px"
  },

  fileInput: {
    width: "100%",
    padding: "8px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff"
  },

  cancelModalButton: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer"
  },

  processButton: {
    padding: "10px 20px",
    background: "#4BC7B0",
    color: "#065A63",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
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

export default TenantPayment