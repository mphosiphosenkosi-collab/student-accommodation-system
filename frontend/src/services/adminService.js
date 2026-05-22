// src/services/adminService.js
// Mock admin service - ready for backend integration

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data store
let properties = [
  {
    id: "PROP001",
    name: "Mbombela Heights",
    address: "124 Samora Machel Drive, Mbombela",
    contactPerson: "John Smith",
    phone: "+27 13 123 4567",
    email: "info@mbombelaheights.co.za",
    totalRooms: 12,
    amenities: ["WiFi", "Study Area", "Security", "Parking"]
  },
  {
    id: "PROP002",
    name: "Academic Village",
    address: "45 Madiba Drive, Mbombela",
    contactPerson: "Sarah Nkosi",
    phone: "+27 13 987 6543",
    email: "info@academicvillage.co.za",
    totalRooms: 8,
    amenities: ["WiFi", "Study Area", "Laundry", "Parking"]
  }
];

let rooms = [
  {
    id: "RM001",
    propertyId: "PROP001",
    roomNumber: "101",
    type: "Single",
    floor: 1,
    rentAmount: 3500,
    status: "occupied",
    currentTenant: { id: "TEN001", name: "Thabo Mbeki", email: "thabo@student.co.za" }
  },
  {
    id: "RM002",
    propertyId: "PROP001",
    roomNumber: "102",
    type: "Double",
    floor: 1,
    rentAmount: 2500,
    status: "available",
    currentTenant: null
  }
];

let tenants = [
  {
    id: "TEN001",
    name: "Thabo Mbeki",
    email: "thabo@student.co.za",
    phone: "+27 71 234 5678",
    studentId: "STU001",
    fundingType: "NSFAS",
    propertyId: "PROP001",
    propertyName: "Mbombela Heights",
    roomId: "RM001",
    roomNumber: "101",
    leaseStart: "2024-01-01",
    leaseEnd: "2024-12-31",
    status: "active"
  }
];

let applications = [
  {
    id: "APP001",
    studentName: "Thabo Mbeki",
    email: "thabo@student.co.za",
    phone: "+27 71 234 5678",
    preferredProperty: "Mbombela Heights",
    fundingType: "NSFAS",
    status: "approved",
    submittedDate: "2024-03-01",
    documents: ["id_copy.pdf", "registration.pdf"],
    notes: "Approved - valid NSFAS funding"
  },
  {
    id: "APP002",
    studentName: "Lerato Dlamini",
    email: "lerato@student.co.za",
    phone: "+27 82 345 6789",
    preferredProperty: "Academic Village",
    fundingType: "Private",
    status: "pending",
    submittedDate: "2024-11-20",
    documents: ["id_copy.pdf", "proof_of_income.pdf"],
    notes: ""
  }
];

let payments = [
  {
    id: "PAY001",
    tenantId: "TEN001",
    tenantName: "Thabo Mbeki",
    amount: 3500,
    date: "2024-11-01",
    status: "completed",
    method: "Bank Transfer",
    propertyName: "Mbombela Heights",
    receiptUrl: null
  },
  {
    id: "PAY002",
    tenantId: "TEN001",
    tenantName: "Thabo Mbeki",
    amount: 3500,
    date: "2024-12-01",
    status: "pending",
    method: "Bank Transfer",
    propertyName: "Mbombela Heights",
    receiptUrl: null
  }
];

let maintenanceRequests = [
  {
    id: "MAINT001",
    tenantName: "Thabo Mbeki",
    roomNumber: "101",
    propertyName: "Mbombela Heights",
    issue: "Leaking tap",
    status: "pending",
    priority: "medium",
    submittedDate: "2024-11-23",
    description: "Kitchen tap is leaking continuously"
  }
];

// Admin Service
export const adminService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    await delay(800);
    const occupiedRooms = rooms.filter(r => r.status === "occupied").length;
    const totalRooms = rooms.length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    const monthlyRevenue = payments
      .filter(p => p.status === "completed" && p.date.startsWith("2024-12"))
      .reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalProperties: properties.length,
      totalRooms: totalRooms,
      totalTenants: tenants.length,
      pendingApplications: applications.filter(a => a.status === "pending").length,
      monthlyRevenue: monthlyRevenue,
      occupancyRate: occupancyRate,
      maintenanceRequests: maintenanceRequests.filter(m => m.status === "pending").length,
      paymentsDue: payments.filter(p => p.status === "pending").length
    };
  },

  getRecentApplications: async (limit = 5) => {
    await delay(500);
    return [...applications]
      .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
      .slice(0, limit);
  },

  getRecentPayments: async (limit = 5) => {
    await delay(500);
    return [...payments]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  },

  // Properties CRUD
  getProperties: async () => {
    await delay(600);
    return [...properties];
  },

  getPropertyById: async (id) => {
    await delay(300);
    return properties.find(p => p.id === id);
  },

  createProperty: async (propertyData) => {
    await delay(800);
    const newProperty = {
      id: `PROP${String(properties.length + 1).padStart(3, '0')}`,
      ...propertyData,
      createdAt: new Date().toISOString()
    };
    properties.push(newProperty);
    return newProperty;
  },

  updateProperty: async (id, propertyData) => {
    await delay(800);
    const index = properties.findIndex(p => p.id === id);
    if (index !== -1) {
      properties[index] = { ...properties[index], ...propertyData };
      return properties[index];
    }
    throw new Error("Property not found");
  },

  deleteProperty: async (id) => {
    await delay(800);
    const initialLength = properties.length;
    properties = properties.filter(p => p.id !== id);
    return properties.length < initialLength;
  },

  // Rooms Management
  getRooms: async (propertyId = null) => {
    await delay(600);
    if (propertyId) {
      return rooms.filter(r => r.propertyId === propertyId);
    }
    return [...rooms];
  },

  getRoomById: async (id) => {
    await delay(300);
    return rooms.find(r => r.id === id);
  },

  createRoom: async (roomData) => {
    await delay(800);
    const newRoom = {
      id: `RM${String(rooms.length + 1).padStart(3, '0')}`,
      ...roomData,
      currentTenant: null
    };
    rooms.push(newRoom);
    return newRoom;
  },

  updateRoom: async (id, roomData) => {
    await delay(800);
    const index = rooms.findIndex(r => r.id === id);
    if (index !== -1) {
      rooms[index] = { ...rooms[index], ...roomData };
      return rooms[index];
    }
    throw new Error("Room not found");
  },

  deleteRoom: async (id) => {
    await delay(800);
    const initialLength = rooms.length;
    rooms = rooms.filter(r => r.id !== id);
    return rooms.length < initialLength;
  },

  assignTenantToRoom: async (roomId, tenantId) => {
    await delay(800);
    const room = rooms.find(r => r.id === roomId);
    const tenant = tenants.find(t => t.id === tenantId);
    
    if (!room || !tenant) throw new Error("Room or tenant not found");
    
    room.status = "occupied";
    room.currentTenant = { id: tenant.id, name: tenant.name, email: tenant.email };
    tenant.roomId = roomId;
    tenant.roomNumber = room.roomNumber;
    tenant.propertyId = room.propertyId;
    
    return { room, tenant };
  },

  // Tenants Management
  getTenants: async () => {
    await delay(600);
    return [...tenants];
  },

  getTenantById: async (id) => {
    await delay(300);
    return tenants.find(t => t.id === id);
  },

  createTenant: async (tenantData) => {
    await delay(800);
    const newTenant = {
      id: `TEN${String(tenants.length + 1).padStart(3, '0')}`,
      ...tenantData,
      status: "active"
    };
    tenants.push(newTenant);
    return newTenant;
  },

  updateTenant: async (id, tenantData) => {
    await delay(800);
    const index = tenants.findIndex(t => t.id === id);
    if (index !== -1) {
      tenants[index] = { ...tenants[index], ...tenantData };
      return tenants[index];
    }
    throw new Error("Tenant not found");
  },

  deleteTenant: async (id) => {
    await delay(800);
    const initialLength = tenants.length;
    tenants = tenants.filter(t => t.id !== id);
    return tenants.length < initialLength;
  },

  // Applications Management
  getApplications: async (status = null) => {
    await delay(600);
    if (status) {
      return applications.filter(a => a.status === status);
    }
    return [...applications];
  },

  getApplicationById: async (id) => {
    await delay(300);
    return applications.find(a => a.id === id);
  },

  createApplication: async (applicationData) => {
    await delay(800);
    const newApplication = {
      id: `APP${String(applications.length + 1).padStart(3, '0')}`,
      ...applicationData,
      status: "pending",
      submittedDate: new Date().toISOString().split('T')[0],
      documents: applicationData.documents || []
    };
    applications.push(newApplication);
    console.log('New application created:', newApplication);
    console.log('Total applications:', applications.length);
    return newApplication;
  },

  updateApplicationStatus: async (id, status, notes = "") => {
    await delay(800);
    const index = applications.findIndex(a => a.id === id);
    if (index !== -1) {
      applications[index].status = status;
      applications[index].notes = notes;
      applications[index].reviewedDate = new Date().toISOString().split('T')[0];
      return applications[index];
    }
    throw new Error("Application not found");
  },

  convertToTenant: async (applicationId) => {
    await delay(1000);
    const application = applications.find(a => a.id === applicationId);
    if (!application) throw new Error("Application not found");
    
    const newTenant = {
      id: `TEN${String(tenants.length + 1).padStart(3, '0')}`,
      name: application.studentName,
      email: application.email,
      phone: application.phone,
      studentId: `STU${String(tenants.length + 1).padStart(3, '0')}`,
      fundingType: application.fundingType,
      propertyId: null,
      propertyName: application.preferredProperty,
      roomId: null,
      roomNumber: null,
      leaseStart: new Date().toISOString().split('T')[0],
      leaseEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      status: "active"
    };
    
    tenants.push(newTenant);
    application.status = "approved";
    application.convertedToTenant = true;
    
    return newTenant;
  },

  // Payments Management
  getPayments: async (filters = {}) => {
    await delay(600);
    let filteredPayments = [...payments];
    
    if (filters.tenantId) {
      filteredPayments = filteredPayments.filter(p => p.tenantId === filters.tenantId);
    }
    if (filters.status) {
      filteredPayments = filteredPayments.filter(p => p.status === filters.status);
    }
    if (filters.startDate) {
      filteredPayments = filteredPayments.filter(p => p.date >= filters.startDate);
    }
    if (filters.endDate) {
      filteredPayments = filteredPayments.filter(p => p.date <= filters.endDate);
    }
    
    return filteredPayments;
  },

  getPaymentById: async (id) => {
    await delay(300);
    return payments.find(p => p.id === id);
  },

  updatePaymentStatus: async (id, status, receiptUrl = null) => {
    await delay(800);
    const index = payments.findIndex(p => p.id === id);
    if (index !== -1) {
      payments[index].status = status;
      if (receiptUrl) payments[index].receiptUrl = receiptUrl;
      payments[index].updatedDate = new Date().toISOString().split('T')[0];
      return payments[index];
    }
    throw new Error("Payment not found");
  },

  createPayment: async (paymentData) => {
    await delay(800);
    const newPayment = {
      id: `PAY${String(payments.length + 1).padStart(3, '0')}`,
      ...paymentData,
      date: new Date().toISOString().split('T')[0],
      receiptUrl: null
    };
    payments.push(newPayment);
    return newPayment;
  },

  // Reports
  generateOccupancyReport: async () => {
    await delay(1000);
    const report = properties.map(property => {
      const propertyRooms = rooms.filter(r => r.propertyId === property.id);
      const occupiedRooms = propertyRooms.filter(r => r.status === "occupied").length;
      return {
        propertyName: property.name,
        totalRooms: propertyRooms.length,
        occupiedRooms,
        availableRooms: propertyRooms.length - occupiedRooms,
        occupancyRate: propertyRooms.length > 0 ? Math.round((occupiedRooms / propertyRooms.length) * 100) : 0
      };
    });
    return report;
  },

  generateRevenueReport: async (year, month) => {
    await delay(1000);
    const monthlyPayments = payments.filter(p => {
      const paymentDate = new Date(p.date);
      return p.status === "completed" && 
             paymentDate.getFullYear() === year && 
             paymentDate.getMonth() === month;
    });
    
    const totalRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
    const byProperty = {};
    
    monthlyPayments.forEach(payment => {
      if (!byProperty[payment.propertyName]) {
        byProperty[payment.propertyName] = 0;
      }
      byProperty[payment.propertyName] += payment.amount;
    });
    
    return {
      year,
      month,
      totalRevenue,
      breakdown: byProperty,
      payments: monthlyPayments
    };
  },

  generateMaintenanceReport: async () => {
    await delay(1000);
    const byStatus = {
      pending: maintenanceRequests.filter(m => m.status === "pending").length,
      inProgress: maintenanceRequests.filter(m => m.status === "in-progress").length,
      completed: maintenanceRequests.filter(m => m.status === "completed").length
    };
    
    const byPriority = {
      high: maintenanceRequests.filter(m => m.priority === "high").length,
      medium: maintenanceRequests.filter(m => m.priority === "medium").length,
      low: maintenanceRequests.filter(m => m.priority === "low").length
    };
    
    return {
      totalRequests: maintenanceRequests.length,
      byStatus,
      byPriority,
      averageResolutionTime: "3.5 days"
    };
  },

  exportToCSV: (data, filename) => {
    // Utility function for CSV export
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header] || '';
        return JSON.stringify(value);
      }).join(','))
    ];
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};