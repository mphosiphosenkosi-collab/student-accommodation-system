function PropertyCard({ property }) {
  return (
    <div style={styles.card}>

      {/* IMAGE SECTION */}
      <div style={styles.imageBox}>
        <div style={styles.badge}>
          {property.status}
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>

        <h3 style={styles.title}>
          {property.name}
        </h3>

        <p style={styles.location}>
          {property.location}
        </p>

        <div style={styles.row}>
          <span style={styles.price}>
            R {property.price}/month
          </span>

          <span style={styles.tag}>
            {property.type}
          </span>
        </div>

        <button style={styles.button}>
          View Details
        </button>

      </div>

    </div>
  )
}

const styles = {

  card: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "0.3s",
    backdropFilter: "blur(12px)"
  },

  imageBox: {
    height: "160px",
    background: "linear-gradient(135deg, #0A5C63, #2EBFA5)",
    position: "relative"
  },

  badge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    background: "#2EBFA5",
    padding: "6px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#062C2F"
  },

  content: {
    padding: "16px"
  },

  title: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#EFFFFB",
    marginBottom: "6px"
  },

  location: {
    fontSize: "0.9rem",
    opacity: 0.7,
    marginBottom: "12px"
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px"
  },

  price: {
    fontWeight: "700",
    color: "#4FF0D2"
  },

  tag: {
    fontSize: "12px",
    padding: "5px 10px",
    background: "rgba(79, 240, 210, 0.15)",
    borderRadius: "10px",
    color: "#4FF0D2"
  },

  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "12px",
    border: "none",
    background: "#2EBFA5",
    color: "#062C2F",
    fontWeight: "700",
    cursor: "pointer"
  }

}

export default PropertyCard