import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>

      {/* HERO SECTION */}
      <section style={styles.heroSection}>

        <div style={styles.heroOverlay}></div>

        <div style={styles.heroContent}>

          <span style={styles.badge}>
            Premium Student Accommodation
          </span>

          <h1 style={styles.heroTitle}>
            Modern Student Living Designed Around Comfort & Convenience
          </h1>

          <p style={styles.heroSubtitle}>
            Explore safe, affordable and student-friendly accommodation
            tailored for modern academic living.
          </p>

          <div style={styles.heroButtons}>

            <button
              style={styles.primaryBtn}
              onClick={() => navigate("/properties")}
            >
              Explore Accommodation
            </button>

            <button
              style={styles.secondaryBtn}
              onClick={() => navigate("/apply")}
            >
              Apply Now
            </button>

          </div>

        </div>

      </section>

      {/* ABOUT SECTION */}
      <section style={styles.section}>

        <div style={styles.aboutGrid}>

          <div>

            <span style={styles.sectionTag}>
              ABOUT US
            </span>

            <h2 style={styles.sectionTitle}>
              A Better Student Living Experience
            </h2>

            <p style={styles.sectionText}>
              We provide comfortable and professionally managed student
              accommodation designed to support academic growth, safety,
              and convenience.
            </p>

            <p style={styles.sectionText}>
              Our residences are tailored for both NSFAS-funded and private
              students, creating spaces where students can focus, connect
              and thrive.
            </p>

          </div>

          <div style={styles.aboutCard}>

            <div style={styles.aboutCardInner}>
              <h3 style={styles.aboutCardTitle}>
                Designed For Modern Students
              </h3>

              <p style={styles.aboutCardText}>
                Clean spaces, secure environments and simplified accommodation
                processes all in one place.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* WHY CHOOSE US */}
      <section style={styles.section}>

        <div style={styles.sectionHeader}>

          <span style={styles.sectionTag}>
            WHY US
          </span>

          <h2 style={styles.sectionTitle}>
            Why Students Choose Our Accommodation
          </h2>

        </div>

        <div style={styles.whyGrid}>

          <div style={styles.whyCard}>
            <h3 style={styles.whyTitle}>Safe Environment</h3>

            <p style={styles.whyText}>
              Student-focused residences designed with comfort and safety in mind.
            </p>
          </div>

          <div style={styles.whyCard}>
            <h3 style={styles.whyTitle}>Affordable Living</h3>

            <p style={styles.whyText}>
              Accommodation solutions suitable for both NSFAS and private students.
            </p>
          </div>

          <div style={styles.whyCard}>
            <h3 style={styles.whyTitle}>Modern Management</h3>

            <p style={styles.whyText}>
              Streamlined applications, communication and tenant support systems.
            </p>
          </div>

        </div>

      </section>

      {/* CTA SECTION */}
      <section style={styles.ctaSection}>

        <div style={styles.ctaCard}>

          <h2 style={styles.ctaTitle}>
            Ready To Secure Your Student Accommodation?
          </h2>

          <p style={styles.ctaText}>
            Begin your accommodation application today and explore available spaces.
          </p>

          <button
            style={styles.ctaBtn}
            onClick={() => navigate("/apply")}
          >
            Start Application
          </button>

        </div>

      </section>

    </div>
  )
}

const styles = {

  page: {
    background: "linear-gradient(to bottom, #065A63, #0B6B73)",
    minHeight: "100vh",
    color: "white",
    overflow: "hidden"
  },

  /* HERO */

  heroSection: {
    position: "relative",
    padding: "140px 20px 100px",
    textAlign: "center"
  },

  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(circle at top,
      rgba(75, 199, 176, 0.18),
      transparent 60%)
    `
  },

  heroContent: {
    position: "relative",
    maxWidth: "900px",
    margin: "0 auto",
    zIndex: 2
  },

  badge: {
    display: "inline-block",
    padding: "10px 18px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.08)",
    marginBottom: "28px",
    color: "#B8FFF1",
    fontSize: "0.95rem"
  },

  heroTitle: {
    fontSize: "clamp(3rem, 7vw, 5.8rem)",
    lineHeight: "1",
    fontWeight: "700",
    letterSpacing: "-3px",
    marginBottom: "24px"
  },

  heroSubtitle: {
    maxWidth: "700px",
    margin: "0 auto",
    fontSize: "1.15rem",
    lineHeight: "1.8",
    color: "rgba(255,255,255,0.75)"
  },

  heroButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginTop: "40px",
    flexWrap: "wrap"
  },

  primaryBtn: {
    background: "#4BC7B0",
    color: "#08363C",
    border: "none",
    padding: "15px 28px",
    borderRadius: "18px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "1rem"
  },

  secondaryBtn: {
    background: "transparent",
    color: "white",
    border: "1px solid rgba(255,255,255,0.15)",
    padding: "15px 28px",
    borderRadius: "18px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "1rem"
  },

  /* GLOBAL SECTION */

  section: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "70px 20px"
  },

  sectionHeader: {
    marginBottom: "45px"
  },

  sectionTag: {
    color: "#7EE8D7",
    fontSize: "0.85rem",
    letterSpacing: "2px"
  },

  sectionTitle: {
    fontSize: "2.7rem",
    marginTop: "12px",
    marginBottom: "18px",
    lineHeight: "1.2"
  },

  sectionSubtitle: {
    color: "rgba(255,255,255,0.72)",
    lineHeight: "1.8",
    maxWidth: "700px"
  },

  sectionText: {
    color: "rgba(255,255,255,0.72)",
    lineHeight: "1.9",
    marginBottom: "18px"
  },

  /* ABOUT */

  aboutGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "35px",
    alignItems: "center"
  },

  aboutCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "32px",
    padding: "50px",
    backdropFilter: "blur(12px)"
  },

  aboutCardInner: {
    borderLeft: "4px solid #4BC7B0",
    paddingLeft: "20px"
  },

  aboutCardTitle: {
    fontSize: "1.6rem",
    marginBottom: "16px"
  },

  aboutCardText: {
    color: "rgba(255,255,255,0.72)",
    lineHeight: "1.8"
  },

  /* WHY SECTION */

  whyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px"
  },

  whyCard: {
    background: "rgba(255,255,255,0.04)",
    padding: "32px",
    borderRadius: "26px",
    border: "1px solid rgba(255,255,255,0.05)"
  },

  whyTitle: {
    marginBottom: "16px",
    fontSize: "1.3rem"
  },

  whyText: {
    color: "rgba(255,255,255,0.72)",
    lineHeight: "1.8"
  },

  /* CTA */

  ctaSection: {
    padding: "70px 20px 120px"
  },

  ctaCard: {
    maxWidth: "950px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "36px",
    padding: "70px 30px",
    textAlign: "center",
    backdropFilter: "blur(14px)"
  },

  ctaTitle: {
    fontSize: "2.5rem",
    marginBottom: "20px"
  },

  ctaText: {
    color: "rgba(255,255,255,0.72)",
    marginBottom: "35px",
    lineHeight: "1.8"
  },

  ctaBtn: {
    background: "#4BC7B0",
    color: "#08363C",
    border: "none",
    padding: "16px 32px",
    borderRadius: "18px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "1rem"
  }

}

export default Home