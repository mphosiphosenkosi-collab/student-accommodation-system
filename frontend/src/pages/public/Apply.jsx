// src/pages/public/Apply.jsx - Updated with better error handling and feedback
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';

function Apply() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    property: '',
    fundingType: '',
    notes: ''
  });

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const propertiesData = await adminService.getProperties();
      console.log('Loaded properties:', propertiesData);
      setProperties(propertiesData);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoadingProperties(false);
    }
  };

  // Handle text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a valid file type. Please upload PDF, JPEG, or PNG files.`);
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`${file.name} exceeds 5MB limit.`);
        return false;
      }
      
      return true;
    });
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  // Remove a file
  const removeFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Convert files to base64 for storage
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.property || !formData.fundingType) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (files.length === 0) {
      alert('Please upload required supporting documents');
      return;
    }
    
    setIsSubmitting(true);
    setDebugInfo(null);
    
    try {
      // Convert files to base64 for mock storage
      const filePromises = files.map(async (file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        data: await fileToBase64(file)
      }));
      
      const fileData = await Promise.all(filePromises);
      
      // Create application object matching admin service structure
      const applicationData = {
        studentName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        preferredProperty: formData.property,
        fundingType: formData.fundingType,
        notes: formData.notes,
        documents: fileData.map(f => f.name),
        status: "pending",
        submittedDate: new Date().toISOString().split('T')[0],
        studentId: `STU${Date.now().toString().slice(-6)}`,
        // Additional fields that admin expects
        propertyId: properties.find(p => p.name === formData.property)?.id || null,
        institution: "Not specified",
        course: "Not specified",
        yearOfStudy: 1,
        roomType: "Standard",
        preferredMoveIn: new Date().toISOString().split('T')[0],
        preferredDuration: "12 months",
        nsfasFunding: formData.fundingType === "NSFAS",
        monthlyBudget: 4500
      };
      
      console.log('Submitting application:', applicationData);
      
      // Save to adminService
      const newApplication = await adminService.createApplication(applicationData);
      
      console.log('Application saved successfully:', newApplication);
      console.log('All applications now:', await adminService.getApplications());
      
      setDebugInfo({
        applicationId: newApplication.id,
        status: newApplication.status,
        message: 'Application saved to admin system'
      });
      
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          property: '',
          fundingType: '',
          notes: ''
        });
        setFiles([]);
        setSubmitStatus(null);
      }, 4000);
      
    } catch (error) {
      console.error("Error submitting application:", error);
      setDebugInfo({
        error: error.message,
        message: 'Failed to save application'
      });
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    document.getElementById('fileInput').click();
  };

  const styles = {
    page: {
      background: "linear-gradient(to bottom, #065A63, #0B6B73)",
      minHeight: "100vh",
      color: "white"
    },
    hero: {
      textAlign: "center",
      padding: "120px 20px 70px",
      maxWidth: "850px",
      margin: "0 auto"
    },
    tag: {
      color: "#7EE8D7",
      letterSpacing: "2px",
      fontSize: "0.9rem"
    },
    title: {
      fontSize: "clamp(2.8rem, 6vw, 5rem)",
      lineHeight: "1.1",
      marginTop: "18px",
      marginBottom: "20px"
    },
    subtitle: {
      color: "rgba(255,255,255,0.75)",
      lineHeight: "1.8"
    },
    section: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "0 20px 100px"
    },
    formContainer: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "32px",
      padding: "40px",
      backdropFilter: "blur(12px)"
    },
    formHeader: {
      marginBottom: "35px"
    },
    formTitle: {
      fontSize: "2rem",
      marginBottom: "12px"
    },
    formText: {
      color: "rgba(255,255,255,0.72)"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "24px"
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    },
    label: {
      color: "#B8FFF1",
      fontSize: "0.95rem",
      fontWeight: "500"
    },
    requiredStar: {
      color: "#C1785A",
      marginLeft: "4px"
    },
    input: {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      padding: "16px",
      color: "white",
      outline: "none",
      fontSize: "1rem",
      transition: "all 0.3s ease"
    },
    textarea: {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      padding: "16px",
      color: "white",
      outline: "none",
      resize: "vertical",
      fontSize: "1rem",
      fontFamily: "inherit"
    },
    uploadBox: {
      border: "2px dashed rgba(255,255,255,0.15)",
      borderRadius: "24px",
      padding: "35px",
      textAlign: "center",
      background: "rgba(255,255,255,0.02)"
    },
    uploadTitle: {
      fontSize: "1.1rem",
      marginBottom: "10px",
      fontWeight: "600"
    },
    uploadText: {
      color: "rgba(255,255,255,0.72)",
      marginBottom: "20px",
      fontSize: "0.9rem"
    },
    uploadBtn: {
      background: "#2FA7A0",
      color: "#08363C",
      border: "none",
      padding: "14px 22px",
      borderRadius: "14px",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s ease"
    },
    fileList: {
      marginTop: "20px",
      textAlign: "left"
    },
    fileItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "rgba(255,255,255,0.05)",
      padding: "10px 15px",
      borderRadius: "10px",
      marginBottom: "8px"
    },
    fileName: {
      fontSize: "0.85rem",
      color: "#B8FFF1"
    },
    removeBtn: {
      background: "rgba(193, 120, 90, 0.8)",
      border: "none",
      color: "white",
      padding: "4px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "0.75rem"
    },
    submitBtn: {
      background: "#4BC7B0",
      color: "#08363C",
      border: "none",
      padding: "18px",
      borderRadius: "18px",
      fontWeight: "700",
      fontSize: "1rem",
      cursor: "pointer",
      marginTop: "10px",
      transition: "all 0.3s ease"
    },
    submitBtnDisabled: {
      background: "#4BC7B0",
      color: "#08363C",
      border: "none",
      padding: "18px",
      borderRadius: "18px",
      fontWeight: "700",
      fontSize: "1rem",
      cursor: "not-allowed",
      marginTop: "10px",
      opacity: 0.6
    },
    successMessage: {
      background: "rgba(75, 199, 176, 0.2)",
      border: "1px solid #4BC7B0",
      borderRadius: "16px",
      padding: "16px",
      textAlign: "center",
      marginTop: "20px",
      color: "#4BC7B0"
    },
    errorMessage: {
      background: "rgba(193, 120, 90, 0.2)",
      border: "1px solid #C1785A",
      borderRadius: "16px",
      padding: "16px",
      textAlign: "center",
      marginTop: "20px",
      color: "#C1785A"
    },
    debugPanel: {
      background: "rgba(0,0,0,0.5)",
      borderRadius: "12px",
      padding: "12px",
      marginTop: "15px",
      fontSize: "0.75rem",
      fontFamily: "monospace",
      color: "#7EE8D7"
    },
    loadingText: {
      textAlign: "center",
      padding: "20px",
      color: "rgba(255,255,255,0.7)"
    }
  };

  return (
    <div style={styles.page}>
      {/* HERO */}
      <section style={styles.hero}>
        <span style={styles.tag}>APPLICATION</span>
        <h1 style={styles.title}>Start Your Accommodation Application</h1>
        <p style={styles.subtitle}>
          Complete the application form below to apply for student accommodation.
          Your application will be reviewed within 48 hours.
        </p>
      </section>

      {/* FORM SECTION */}
      <section style={styles.section}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Student Information</h2>
            <p style={styles.formText}>
              Fill in your details to begin the application process.
            </p>
          </div>

          <form style={styles.form} onSubmit={handleSubmit}>
            {/* FULL NAME */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Full Name <span style={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter full name"
                style={styles.input}
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* EMAIL */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Email Address <span style={styles.requiredStar}>*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                style={styles.input}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* PHONE */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Phone Number <span style={styles.requiredStar}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                style={styles.input}
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* PROPERTY */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Preferred Property <span style={styles.requiredStar}>*</span>
              </label>
              <select 
                style={styles.input}
                name="property"
                value={formData.property}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Property</option>
                {loadingProperties ? (
                  <option disabled>Loading properties...</option>
                ) : (
                  properties.map(property => (
                    <option key={property.id} value={property.name}>
                      {property.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* FUNDING */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Funding Type <span style={styles.requiredStar}>*</span>
              </label>
              <select 
                style={styles.input}
                name="fundingType"
                value={formData.fundingType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Funding Type</option>
                <option value="NSFAS">NSFAS Funded</option>
                <option value="Private">Private / Self-Funded</option>
              </select>
            </div>

            {/* MESSAGE */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Additional Notes</label>
              <textarea
                rows="5"
                name="notes"
                placeholder="Any additional information you'd like to share..."
                style={styles.textarea}
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>

            {/* FILE UPLOAD */}
            <div style={styles.uploadBox}>
              <p style={styles.uploadTitle}>Upload Supporting Documents</p>
              <p style={styles.uploadText}>
                ID Copy, Proof Of Registration, NSFAS Confirmation (if applicable), etc. (Max 5MB each)
              </p>
              
              {/* Hidden file input */}
              <input
                id="fileInput"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
              
              {/* Visible button that triggers file input */}
              <button 
                type="button" 
                style={styles.uploadBtn}
                onClick={triggerFileInput}
              >
                Choose Files
              </button>
              
              {/* Display selected files */}
              {files.length > 0 && (
                <div style={styles.fileList}>
                  {files.map((file, index) => (
                    <div key={index} style={styles.fileItem}>
                      <span style={styles.fileName}>
                        📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                      <button
                        type="button"
                        style={styles.removeBtn}
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit"
              style={isSubmitting ? styles.submitBtnDisabled : styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
            </button>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div style={styles.successMessage}>
                ✓ Application submitted successfully! Your application has been received.
                An admin will review it within 48 hours.
                {debugInfo && (
                  <div style={styles.debugPanel}>
                    Application ID: {debugInfo.applicationId} | Status: {debugInfo.status}
                  </div>
                )}
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div style={styles.errorMessage}>
                ✗ Submission failed. Please check your internet connection and try again.
                {debugInfo && (
                  <div style={styles.debugPanel}>
                    Error: {debugInfo.error}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

export default Apply;