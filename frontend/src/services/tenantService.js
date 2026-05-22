// src/services/tenantService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class TenantService {
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/tenant/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token
      if (data.token) {
        localStorage.setItem('tenantToken', data.token);
        localStorage.setItem('tenantUser', JSON.stringify(data.user));
      }
      
      return {
        success: true,
        user: data.user,
        token: data.token
      };
    } catch (error) {
      console.error('Login API Error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
  
  async logout() {
    try {
      const token = localStorage.getItem('tenantToken');
      
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('tenantToken');
      localStorage.removeItem('tenantUser');
    }
  }
  
  async verifyToken() {
    const token = localStorage.getItem('tenantToken');
    
    if (!token) {
      return { valid: false };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      return {
        valid: response.ok,
        user: data.user
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return { valid: false };
    }
  }
  
  async getProfile() {
    const token = localStorage.getItem('tenantToken');
    
    const response = await fetch(`${API_BASE_URL}/tenant/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return await response.json();
  }
  
  async updateProfile(profileData) {
    const token = localStorage.getItem('tenantToken');
    
    const response = await fetch(`${API_BASE_URL}/tenant/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return await response.json();
  }
  
  async getPayments() {
    const token = localStorage.getItem('tenantToken');
    
    const response = await fetch(`${API_BASE_URL}/tenant/payments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }
    
    return await response.json();
  }
  
  async submitMaintenanceRequest(requestData) {
    const token = localStorage.getItem('tenantToken');
    
    const response = await fetch(`${API_BASE_URL}/tenant/maintenance`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit request');
    }
    
    return await response.json();
  }
  
  async getMaintenanceRequests() {
    const token = localStorage.getItem('tenantToken');
    
    const response = await fetch(`${API_BASE_URL}/tenant/maintenance`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch maintenance requests');
    }
    
    return await response.json();
  }
}

export default new TenantService();