# 🏠 StudentStay - Student Accommodation Management System

A comprehensive full-stack property and tenant management ecosystem for student accommodation businesses in South Africa.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 📋 Overview

StudentStay is a centralized accommodation management platform designed specifically for student housing providers in South Africa. Built with scalability and professionalism in mind, it serves three distinct user groups:

- **Public Users** - Browse properties, view residences, and apply for accommodation
- **Tenants** - Access dashboard, view room allocation, track payments, submit maintenance requests
- **Admins** - Manage properties, rooms, tenants, payments, applications, and generate reports

### 🎯 Business Context

- **Location:** Mbombela / Nelspruit, South Africa
- **Accommodation Type:** Student accommodation, NSFAS-friendly residences
- **Scale:** 5 properties, approximately 30 rooms
- **Payment Method:** Bank transfer to company account
- **Tenants:** Mostly NSFAS-funded students, some private-paying students

---

## ✨ Features

### 🌐 Public Website
- Modern, premium property showcase
- Browse available properties and residences
- Online application submission with document upload
- NSFAS-friendly information
- Responsive, professional design

### 👨‍🎓 Tenant Portal
- Secure login and authentication
- Personalized dashboard with key metrics
- Room allocation and lease information
- Payment tracking and history
- Maintenance request submission and tracking
- Document management (upload/download)
- Profile management with image upload
- Real-time announcements

### 👔 Admin Portal
- Comprehensive property management
- Room inventory and allocation
- Tenant management and lease administration
- Application review and approval system
- Payment tracking and reconciliation
- Occupancy monitoring
- Maintenance request handling
- Reporting and analytics
- Full operational control

---

## 🚀 Tech Stack

### Frontend
- **React 18.2.0** - UI Framework
- **Vite** - Build Tool
- **React Router DOM** - Routing
- **CSS-in-JS** - Styling (No external CSS files)

### Planned Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB / PostgreSQL** - Database
- **JWT Authentication** - Security

---

## 📁 Project Structure
src/
├── layouts/
│ ├── PublicLayout.jsx # Public website layout
│ ├── TenantLayout.jsx # Tenant portal layout
│ └── AdminLayout.jsx # Admin portal layout
├── pages/
│ ├── public/ # Public pages
│ │ ├── Home.jsx
│ │ ├── Properties.jsx
│ │ └── Apply.jsx
│ ├── tenant/ # Tenant pages
│ │ ├── Dashboard.jsx
│ │ ├── Payments.jsx
│ │ ├── Profile.jsx
│ │ ├── Maintenance.jsx
│ │ └── Documents.jsx
│ └── admin/ # Admin pages
│ ├── Dashboard.jsx
│ ├── Properties.jsx
│ ├── Rooms.jsx
│ ├── Tenants.jsx
│ ├── Applications.jsx
│ ├── Payments.jsx
│ └── Reports.jsx
├── context/
│ └── AuthContext.jsx # Authentication context
├── services/
│ └── *.js # API service layer
├── routes/
│ └── AppRoutes.jsx # Application routing
└── App.jsx # Main application

text

---

## 🎨 Design System

### Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Dark | `#065A63` | Sidebar, headers, primary elements |
| Primary Medium | `#0B6B73` | Gradients, secondary elements |
| Primary Light | `#4BC7B0` | Buttons, highlights, CTAs |
| Accent Green | `#B7E5CD` | Active states, highlights |
| Accent Coral | `#C1785A` | Badges, notifications |
| Light Teal | `#7EE8D7` | Accents, gradients |
| Background | `#F5F7FA` | Page backgrounds |

### Design Principles
- Modern SaaS aesthetic
- Clean, minimal, and professional
- Glassmorphism effects where appropriate
- Strong typography hierarchy
- Responsive across all devices
- Premium residence platform feel

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/studentstay.git
cd studentstay
Install dependencies

bash
npm install
# or
yarn install
Start development server

bash
npm run dev
# or
yarn dev
Build for production

bash
npm run build
# or
yarn build
Preview production build

bash
npm run preview
# or
yarn preview
🔐 Environment Variables
Create a .env file in the root directory:

env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Optional: Add other variables as needed
📱 Routes
Public Routes
Route	Description
/	Home page
/properties	Properties showcase
/apply	Application form
/tenant/login	Tenant login
Tenant Routes (Protected)
Route	Description
/tenant/dashboard	Tenant dashboard
/tenant/payments	Payment management
/tenant/profile	Profile management
/tenant/maintenance	Maintenance requests
/tenant/documents	Document management
Admin Routes (Protected)
Route	Description
/admin	Admin dashboard
/admin/properties	Property management
/admin/rooms	Room management
/admin/tenants	Tenant management
/admin/applications	Application review
/admin/payments	Payment management
/admin/reports	Reports and analytics

🔒 Authentication
The application uses token-based authentication with separate flows for tenants and admins:

Tenant Login: /tenant/login

Admin Login: /admin/login

Token Storage: localStorage (tenantToken / adminToken)

Protected Routes: Auto-redirect to login if unauthorized

Demo Credentials
javascript
// Tenant Demo
email: "tenant@studentstay.co.za"
password: "demo123"

// Admin Demo
email: "admin@studentstay.co.za"
password: "demo123"
Note: Demo credentials are for development only. Real authentication requires backend implementation.

📦 Project Status
✅ Completed
☑ React/Vite project setup
☑ Multi-layout architecture
☑ Complete routing system
☑ Public website with navigation
☑ Property showcase page
☑ Application form with file upload
☑ Tenant portal with all features
☑ Tenant dashboard with stats
☑ Payment system (frontend)
☑ Profile management
☑ Maintenance requests
☑ Document management
☑ Authentication framework
☑ Admin layout structure

🚧 In Progress
□ Admin dashboard implementation
□ Property management (admin)
□ Room management (admin)
□ Tenant management (admin)
□ Application review system (admin)
□ Payment management (admin)
□ Reports and analytics (admin)

📋 Planned
□ Backend API development
□ Database integration
□ Payment gateway integration
□ Email notifications
□ SMS notifications
□ Export reports to PDF/Excel
□ Mobile responsive enhancements

🏗️ Architecture Decisions
Multi-Layout Architecture
Three separate layouts for different user experiences:

Public Layout: Marketing-focused, premium design

Tenant Layout: Dashboard-focused, operational tools

Admin Layout: Management-focused, data-driven

CSS-in-JS
All styles are defined as JavaScript objects for:

Better component encapsulation

Dynamic styling capabilities

No external CSS files

Consistent theming

Service Layer
Dedicated service files for API communication:

tenantService.js - Tenant API calls

adminService.js - Admin API calls

authService.js - Authentication calls

Authentication Strategy
Token-based authentication

Separate tokens for tenants and admins

Protected routes with role-based access

Auto-redirect on unauthorized access

🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

Development Guidelines
Follow the existing code style and structure

Use CSS-in-JS for all styling

Maintain consistent color palette

Write clean, maintainable code

Add comments for complex logic

Update the README when adding features

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👥 Authors
Your Name - Initial work - YourGitHub

🙏 Acknowledgments
South African student accommodation providers for real-world requirements

NSFAS for funding model insights

Open source community for amazing tools and libraries

📞 Contact
Project Link: https://github.com/mphosiphosenkosi-collab/student-accommodation-system

Email: mphosiphosenkosi@gmail.com

🎯 Future Enhancements
□ Real-time chat support
□ Mobile app (React Native)
□ Online payment integration
□ Automated invoicing
□ Room inspection scheduling
□ Maintenance prioritization algorithms
□ Tenant satisfaction surveys
□ Integration with university systems
□ Automated NSFAS verification
□ Document e-signatures
⚡ Quick Start Commands
bash
# Development
npm run dev

# Build
npm run build

# Preview Build
npm run preview

# Lint
npm run lint

# Format
npm run format
Built with ❤️ for South African Student Accommodation

StudentStay - Making student housing management simple, efficient, and professional.
