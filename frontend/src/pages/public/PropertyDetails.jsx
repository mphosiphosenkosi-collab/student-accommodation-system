import Navbar from "../../components/public/Navbar"
import PropertyCard from "../../components/public/PropertyCard"

function Properties() {

  const properties = [
    {
      id: 1,
      name: "GreenView Residence",
      location: "Cape Town CBD",
      price: 4500,
      type: "Shared",
      status: "Available"
    },
    {
      id: 2,
      name: "Urban Nest",
      location: "Braamfontein",
      price: 5200,
      type: "Studio",
      status: "Limited"
    },
    {
      id: 3,
      name: "Student Hub",
      location: "Pretoria",
      price: 3900,
      type: "Shared",
      status: "Available"
    },
    {
      id: 4,
      name: "City Living",
      location: "Johannesburg",
      price: 6100,
      type: "Apartment",
      status: "New"
    }
  ]

  return (
    <div>

    

      <div style={styles.container}>

        <h1 style={styles.title}>
          Available Properties
        </h1>

        <p style={styles.subtitle}>
          Find safe, verified student accommodation
        </p>

        <div style={styles.grid}>

          {properties.map((item) => (
            <PropertyCard key={item.id} property={item} />
          ))}

        </div>

      </div>

    </div>
  )
}

const styles = {

  container: {
    padding: "40px 7%",
    background: "linear-gradient(180deg, #041C1F, #062C2F)",
    minHeight: "100vh",
    color: "white"
  },

  title: {
    fontSize: "2.3rem",
    fontWeight: "800",
    marginBottom: "8px",
    color: "#EFFFFB"
  },

  subtitle: {
    opacity: 0.7,
    marginBottom: "30px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "22px"
  }

}

export default Properties