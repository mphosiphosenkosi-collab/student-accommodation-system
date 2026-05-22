function Properties() {

  const properties = [

    {
      id: 1,
      name: "Mbombela Heights Residence",
      location: "Mbombela • Near Riverside Mall",
      description:
        "Modern student accommodation designed for comfort, convenience and secure living in the heart of Mbombela.",
      status: "NSFAS Friendly",
      rooms: "12 Rooms Available"
    },

    {
      id: 2,
      name: "Lowveld Student Living",
      location: "West Acres • Nelspruit",
      description:
        "A calm and professionally managed student environment close to major transport routes and study facilities.",
      status: "Limited Space",
      rooms: "5 Rooms Remaining"
    },

    {
      id: 3,
      name: "Urban Nest Mbombela",
      location: "Mbombela Central",
      description:
        "Clean, modern and student-focused residences tailored for both private and NSFAS-funded students.",
      status: "Now Accepting Applications",
      rooms: "Rooms Available"
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

              <div style={styles.imagePlaceholder}>

                <div style={styles.imageGlow}></div>

                <span style={styles.placeholderText}>
                  Residence Preview
                </span>

              </div>

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

                <button style={styles.primaryButton}>
                  View Residence
                </button>

                <button style={styles.secondaryButton}>
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

  /* PAGE */

  page: {
    background: "#065A63",
    minHeight: "100vh",
    color: "white",
    overflow: "hidden"
  },

  /* HERO */

  hero: {
    position: "relative",
    padding: "160px 20px 120px",
    textAlign: "center",
    overflow: "hidden"
  },

  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(
        circle at top,
        rgba(75,199,176,0.22),
        transparent 65%
      )
    `
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

  /* SECTION */

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

  /* IMAGE SIDE */

  imageContainer: {
    flex: 1,
    minWidth: "340px",
    position: "relative"
  },

  imagePlaceholder: {
    width: "100%",
    height: "560px",
    borderRadius: "38px",
    background: `
      linear-gradient(
        135deg,
        #0F7C82,
        #2FA7A0
      )
    `,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)"
  },

  imageGlow: {
    position: "absolute",
    width: "320px",
    height: "320px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "50%",
    filter: "blur(80px)"
  },

  placeholderText: {
    position: "relative",
    zIndex: 2,
    color: "rgba(255,255,255,0.8)",
    fontSize: "1.1rem",
    letterSpacing: "2px"
  },

  /* CONTENT */

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

  /* BUTTONS */

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
    cursor: "pointer"
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
    backdropFilter: "blur(10px)"
  }

}

export default Properties