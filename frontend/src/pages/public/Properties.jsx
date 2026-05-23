import { useNavigate } from "react-router-dom"

function Properties() {
  const navigate = useNavigate()

  const properties = [
    {
      id: 1,
      name: "Mbombela Heights Residence",
      location: "Mbombela • Near Riverside Mall",
      description: "Modern student accommodation designed for comfort, convenience and secure living in the heart of Mbombela.",
      status: "NSFAS Friendly",
      rooms: "12 Rooms Available",
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      price: "R2,500 - R3,500"
    },
    {
      id: 2,
      name: "Lowveld Student Living",
      location: "West Acres • Nelspruit",
      description: "A calm and professionally managed student environment close to major transport routes and study facilities.",
      status: "Limited Space",
      rooms: "5 Rooms Remaining",
      image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      price: "R2,800 - R3,800"
    },
    {
      id: 3,
      name: "Urban Nest Mbombela",
      location: "Mbombela Central",
      description: "Clean, modern and student-focused residences tailored for both private and NSFAS-funded students.",
      status: "Now Accepting Applications",
      rooms: "Rooms Available",
      image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      price: "R2,300 - R3,200"
    },
    {
      id: 4,
      name: "Riverside Student Village",
      location: "Riverside • Mbombela",
      description: "Premium student village with resort-style amenities and stunning Crocodile River views.",
      status: "Limited Availability",
      rooms: "8 Rooms Available",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      price: "R3,000 - R4,500"
    },
    {
      id: 5,
      name: "Sunrise Student Suites",
      location: "Sonheuwel • Mbombela",
      description: "Cozy, secure suites designed for academic excellence and comfortable living near major institutions.",
      status: "NSFAS Friendly",
      rooms: "15 Rooms Available",
      image: "https://images.unsplash.com/photo-1560185009-5f9e67e2b6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      price: "R2,400 - R3,300"
    }
  ]

  return (
    <div style={styles.page}>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <span style={styles.heroTag}>
            STUDENT ACCOMMODATION • MBOMBELA
          </span>
          <h1 style={styles.heroTitle}>
            Discover Modern Student Living In Nelspruit
          </h1>
          <p style={styles.heroSubtitle}>
            Explore professionally managed student accommodation
            designed around comfort, accessibility and modern living.
          </p>
        </div>
      </section>

      {/* PROPERTY SHOWCASE */}
      <section style={styles.section}>
        {properties.map((property, index) => (
          <div
            key={property.id}
            style={{
              ...styles.propertySection,
              flexDirection: index % 2 === 0 ? "row" : "row-reverse"
            }}
          >
            {/* IMAGE SIDE */}
            <div style={styles.imageContainer}>
              <img 
                src={property.image} 
                alt={property.name}
                style={styles.propertyImage}
              />
              <div style={styles.priceTag}>{property.price}</div>
            </div>

            {/* CONTENT SIDE */}
            <div style={styles.content}>
              <span style={styles.statusBadge}>
                {property.status}
              </span>
              <h2 style={styles.propertyTitle}>
                {property.name}
              </h2>
              <p style={styles.location}>
                 {property.location}
              </p>
              <p style={styles.description}>
                {property.description}
              </p>
              <div style={styles.roomsBox}>
                 {property.rooms}
              </div>
              <div style={styles.buttonGroup}>
                <button 
                  style={styles.primaryButton}
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  View Details
                </button>
                <button 
                  style={styles.secondaryButton}
                  onClick={() => navigate("/apply")}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

const styles = {
  page: {
    background: "#065A63",
    minHeight: "100vh",
    color: "white",
    overflow: "hidden"
  },

  hero: {
    position: "relative",
    padding: "160px 20px 120px",
    textAlign: "center",
    overflow: "hidden"
  },

  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at top, rgba(75,199,176,0.22), transparent 65%)"
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "950px",
    margin: "0 auto"
  },

  heroTag: {
    color: "#7EE8D7",
    letterSpacing: "3px",
    fontSize: "0.85rem"
  },

  heroTitle: {
    fontSize: "clamp(3rem, 7vw, 6rem)",
    lineHeight: "1",
    marginTop: "24px",
    marginBottom: "28px",
    letterSpacing: "-3px",
    fontWeight: "700"
  },

  heroSubtitle: {
    color: "rgba(255,255,255,0.74)",
    lineHeight: "1.9",
    fontSize: "1.1rem",
    maxWidth: "720px",
    margin: "0 auto"
  },

  section: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px 120px"
  },

  propertySection: {
    display: "flex",
    alignItems: "center",
    gap: "60px",
    marginBottom: "140px",
    flexWrap: "wrap"
  },

  imageContainer: {
    flex: 1,
    minWidth: "340px",
    position: "relative"
  },

  propertyImage: {
    width: "100%",
    height: "560px",
    objectFit: "cover",
    borderRadius: "38px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.1)"
  },

  priceTag: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    background: "#4BC7B0",
    color: "#08363C",
    padding: "8px 16px",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "1rem"
  },

  content: {
    flex: 1,
    minWidth: "320px"
  },

  statusBadge: {
    display: "inline-block",
    padding: "10px 18px",
    borderRadius: "999px",
    background: "rgba(75,199,176,0.12)",
    color: "#B8FFF1",
    marginBottom: "24px",
    fontSize: "0.9rem",
    border: "1px solid rgba(255,255,255,0.05)"
  },

  propertyTitle: {
    fontSize: "clamp(2.5rem, 5vw, 4.8rem)",
    lineHeight: "1",
    marginBottom: "18px",
    fontWeight: "700",
    letterSpacing: "-2px"
  },

  location: {
    color: "#7EE8D7",
    marginBottom: "28px",
    fontSize: "1rem",
    letterSpacing: "1px"
  },

  description: {
    color: "rgba(255,255,255,0.74)",
    lineHeight: "2",
    fontSize: "1.05rem",
    marginBottom: "36px",
    maxWidth: "560px"
  },

  roomsBox: {
    display: "inline-block",
    padding: "14px 22px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    marginBottom: "38px",
    backdropFilter: "blur(10px)"
  },

  buttonGroup: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap"
  },

  primaryButton: {
    background: "#4BC7B0",
    color: "#08363C",
    border: "none",
    padding: "18px 34px",
    borderRadius: "18px",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "transform 0.2s"
  },

  secondaryButton: {
    background: "transparent",
    color: "white",
    border: "1px solid rgba(255,255,255,0.12)",
    padding: "18px 34px",
    borderRadius: "18px",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    transition: "transform 0.2s"
  }
}

export default Properties