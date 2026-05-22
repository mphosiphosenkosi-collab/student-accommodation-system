import { Outlet } from "react-router-dom"
import Navbar from "../components/public/Navbar"
import Footer from "../components/public/Footer"

function PublicLayout() {
  return (
    <div style={styles.layout}>
      <Navbar />

      <main>
        <Outlet />
      </main>
      
      <Footer/>
    </div>
  )
}

const styles = {

  layout: {
    background: "#065A63",
    minHeight: "100vh",
    color: "white"
  }

}

export default PublicLayout