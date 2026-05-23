import { useParams, useNavigate } from "react-router-dom"

function PropertyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const properties = {
    1: {
      id: 1,
      name: "Mbombela Heights Residence",
      location: "Mbombela • Near Riverside Mall",
      shortDescription: "Modern student accommodation designed for comfort, convenience and secure living in the heart of Mbombela.",
      fullDescription: "Located in the prestigious Riverside area, Mbombela Heights offers premium student living with state-of-the-art security, high-speed internet, and modern furnishings. Each room features ample study space, comfortable bedding, and stunning views of the surrounding landscape. The residence is within walking distance to Riverside Mall, making shopping and entertainment easily accessible.",
      status: "NSFAS Friendly",
      rooms: "12 Rooms Available",
      price: "R2,500 - R3,500 per month",
      type: "Shared & Private",
      amenities: ["24/7 Security", "High-speed WiFi", "Study Lounge", "Shared Kitchen", "Laundry Facilities", "Secure Parking", "Common Area", "Backup Water"],
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1554995207-c18c203602cb",
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
      ]
    },
    2: {
      id: 2,
      name: "Lowveld Student Living",
      location: "West Acres • Nelspruit",
      shortDescription: "A calm and professionally managed student environment close to major transport routes and study facilities.",
      fullDescription: "Lowveld Student Living offers a peaceful academic environment just minutes from major shopping centers and transport hubs. The residence features modern security systems, comfortable study areas, and a supportive community atmosphere perfect for focused learning. Students enjoy easy access to bus routes and the Nelspruit CBD.",
      status: "Limited Space",
      rooms: "5 Rooms Remaining",
      price: "R2,800 - R3,800 per month",
      type: "Private Rooms",
      amenities: ["Biometric Access", "Study Rooms", "Common Area", "Kitchen", "Backup Power", "Parking", "Laundry", "24/7 Security"],
      image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
        "https://images.unsplash.com/photo-1554995207-c18c203602cb"
      ]
    },
    3: {
      id: 3,
      name: "Urban Nest Mbombela",
      location: "Mbombela Central",
      shortDescription: "Clean, modern and student-focused residences tailored for both private and NSFAS-funded students.",
      fullDescription: "Urban Nest provides contemporary living spaces in the heart of Mbombela. With easy access to the CBD, universities, and entertainment venues, this residence is perfect for students who want to be close to everything while enjoying modern amenities. The building features modern architecture and thoughtfully designed common areas.",
      status: "Now Accepting Applications",
      rooms: "Rooms Available",
      price: "R2,300 - R3,200 per month",
      type: "Shared & Private",
      amenities: ["24/7 Security", "High-speed WiFi", "Study Lounge", "Kitchen", "TV Room", "Secure Parking", "Rooftop Terrace", "Laundry"],
      image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4"
      ]
    },
    4: {
      id: 4,
      name: "Riverside Student Village",
      location: "Riverside • Mbombela",
      shortDescription: "Premium student village with resort-style amenities and stunning Crocodile River views.",
      fullDescription: "Experience luxury student living at Riverside Student Village. This brand-new development features modern apartments, a swimming pool, gym, and study areas overlooking the beautiful Crocodile River. Perfect for students who want the best of both worlds - academic focus and lifestyle. The village offers a resort-like atmosphere with premium finishes.",
      status: "Limited Availability",
      rooms: "8 Rooms Available",
      price: "R3,000 - R4,500 per month",
      type: "Private Studios",
      amenities: ["Swimming Pool", "Gym", "Study Lounge", "River Views", "Backup Power", "Shuttle Service", "Game Room", "Cafe", "Laundry"],
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
        "https://images.unsplash.com/photo-1554995207-c18c203602cb"
      ]
    },
    5: {
      id: 5,
      name: "Sunrise Student Suites",
      location: "Sonheuwel • Mbombela",
      shortDescription: "Cozy, secure suites designed for academic excellence and comfortable living near major institutions.",
      fullDescription: "Sunrise Student Suites offers a warm, welcoming environment just minutes from major educational institutions. Each suite is designed for optimal study conditions with natural lighting, quiet spaces, and modern security features. The property features a beautiful garden area perfect for relaxation between study sessions.",
      status: "NSFAS Friendly",
      rooms: "15 Rooms Available",
      price: "R2,400 - R3,300 per month",
      type: "Private Suites",
      amenities: ["24/7 Security", "Study Desks", "Common Kitchen", "Laundry", "Garden Area", "Parking", "Braai Area", "Backup Power"],
      image: "https://images.unsplash.com/photo-1560185009-5f9e67e2b6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1560185009-5f9e67e2b6c3",
        "https://images.unsplash.com/photo-1554995207-c18c203602cb",
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc"
      ]
    }
  }

  const property = properties[id]

  if (!property) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorContent}>
          <h2 style={styles.errorTitle}>Property Not Found</h2>
          <p style={styles.errorText}>The property you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate("/properties")} style={styles.backButton}>
            ← Back to Properties
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Back Button */}
        <button onClick={() => navigate("/properties")} style={styles.backBtn}>
          ← Back to Properties
        </button>

        {/* Main Image */}
        <div style={styles.imageContainer}>
          <img src={property.image} alt={property.name} style={styles.mainImage} />
          <div style={styles.priceOverlay}>{property.price}</div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          <div style={styles.header}>
            <span style={styles.statusBadge}>{property.status}</span>
            <span style={styles.typeBadge}>{property.type}</span>
          </div>
          
          <h1 style={styles.title}>{property.name}</h1>
          <p style={styles.location}>📍 {property.location}</p>
          
          {/* Quick Info Cards */}
          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>💰</div>
              <div style={styles.infoLabel}>Price Range</div>
              <div style={styles.infoValue}>{property.price}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>🏠</div>
              <div style={styles.infoLabel}>Availability</div>
              <div style={styles.infoValue}>{property.rooms}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>📋</div>
              <div style={styles.infoLabel}>Property Type</div>
              <div style={styles.infoValue}>{property.type}</div>
            </div>
          </div>

          {/* Description */}
          <h3 style={styles.sectionTitle}>About This Property</h3>
          <p style={styles.description}>{property.fullDescription}</p>

          {/* Amenities */}
          <h3 style={styles.sectionTitle}>Amenities & Features</h3>
          <div style={styles.amenitiesList}>
            {property.amenities.map((amenity, index) => (
              <span key={index} style={styles.amenityTag}>
                ✓ {amenity}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonGroup}>
            <button style={styles.applyBtn} onClick={() => navigate("/apply")}>
              Apply Now
            </button>
            <button style={styles.contactBtn}>
               Contact Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    background: "linear-gradient(180deg, #041C1F, #062C2F)",
    minHeight: "100vh",
    color: "white",
    padding: "80px 20px 60px"
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto"
  },

  backBtn: {
    background: "rgba(75,199,176,0.15)",
    border: "1px solid rgba(75,199,176,0.3)",
    color: "#7EE8D7",
    padding: "10px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    marginBottom: "30px",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
    '&:hover': {
      background: "rgba(75,199,176,0.25)",
      transform: "translateX(-5px)"
    }
  },

  imageContainer: {
    position: "relative",
    marginBottom: "40px",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
  },

  mainImage: {
    width: "100%",
    height: "500px",
    objectFit: "cover",
    display: "block"
  },

  priceOverlay: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    background: "#4BC7B0",
    color: "#08363C",
    padding: "12px 24px",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
  },

  content: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "24px",
    padding: "40px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.08)"
  },

  header: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },

  statusBadge: {
    display: "inline-block",
    padding: "8px 16px",
    background: "rgba(75,199,176,0.2)",
    borderRadius: "999px",
    color: "#7EE8D7",
    fontSize: "0.85rem",
    fontWeight: "500"
  },

  typeBadge: {
    display: "inline-block",
    padding: "8px 16px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "999px",
    color: "white",
    fontSize: "0.85rem",
    fontWeight: "500"
  },

  title: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    marginBottom: "12px",
    fontWeight: "700",
    letterSpacing: "-1px"
  },

  location: {
    color: "#7EE8D7",
    marginBottom: "30px",
    fontSize: "1rem"
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px"
  },

  infoCard: {
    background: "rgba(255,255,255,0.08)",
    padding: "20px",
    borderRadius: "16px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.05)"
  },

  infoIcon: {
    fontSize: "2rem",
    marginBottom: "8px"
  },

  infoLabel: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "5px"
  },

  infoValue: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#7EE8D7"
  },

  sectionTitle: {
    fontSize: "1.5rem",
    marginTop: "30px",
    marginBottom: "15px",
    fontWeight: "600"
  },

  description: {
    lineHeight: "1.8",
    color: "rgba(255,255,255,0.85)",
    marginBottom: "20px"
  },

  amenitiesList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "40px"
  },

  amenityTag: {
    background: "rgba(75,199,176,0.1)",
    padding: "8px 16px",
    borderRadius: "10px",
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(75,199,176,0.2)"
  },

  buttonGroup: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap"
  },

  applyBtn: {
    background: "#4BC7B0",
    color: "#08363C",
    border: "none",
    padding: "14px 32px",
    borderRadius: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    '&:hover': {
      transform: "translateY(-2px)",
      boxShadow: "0 5px 20px rgba(75,199,176,0.4)"
    }
  },

  contactBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "white",
    padding: "14px 32px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    '&:hover': {
      background: "rgba(255,255,255,0.1)"
    }
  },

  errorContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg, #041C1F, #062C2F)",
    color: "white",
    padding: "20px"
  },

  errorContent: {
    textAlign: "center",
    maxWidth: "500px"
  },

  errorTitle: {
    fontSize: "2rem",
    marginBottom: "15px"
  },

  errorText: {
    color: "rgba(255,255,255,0.7)",
    marginBottom: "30px"
  },

  backButton: {
    background: "#4BC7B0",
    color: "#08363C",
    border: "none",
    padding: "12px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500"
  }
}

// Add hover styles with CSS injection
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  button:hover {
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
`
document.head.appendChild(styleSheet)

export default PropertyDetails