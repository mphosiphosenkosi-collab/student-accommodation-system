// src/components/public/Footer.jsx
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const styles = {
    footer: {
      background: '#065A63',
      color: 'white',
      marginTop: 'auto',
      padding: '3rem 2rem 1.5rem',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: '700',
      marginBottom: '1rem',
      color: '#B7E5CD',
    },
    description: {
      color: 'rgba(255, 255, 255, 0.8)',
      lineHeight: '1.6',
      fontSize: '0.9rem',
    },
    title: {
      fontSize: '1rem',
      fontWeight: '600',
      marginBottom: '1rem',
      color: '#B7E5CD',
    },
    links: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    linkItem: {
      marginBottom: '0.5rem',
    },
    link: {
      color: 'rgba(255, 255, 255, 0.8)',
      textDecoration: 'none',
      fontSize: '0.9rem',
      cursor: 'pointer',
    },
    contact: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '0.9rem',
      lineHeight: '1.8',
    },
    bottom: {
      borderTop: '1px solid rgba(183, 229, 205, 0.2)',
      paddingTop: '1.5rem',
      textAlign: 'center',
    },
    copyright: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '0.8rem',
      margin: 0,
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* About Section */}
          <div>
            <h3 style={styles.logo}>StudentStay</h3>
            <p style={styles.description}>
              Premium student accommodation in Mbombela, Nelspruit. Safe, comfortable, and NSFAS-friendly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={styles.title}>Quick Links</h4>
            <ul style={styles.links}>
              <li style={styles.linkItem}><Link to="/" style={styles.link}>Home</Link></li>
              <li style={styles.linkItem}><Link to="/properties" style={styles.link}>Properties</Link></li>
              <li style={styles.linkItem}><Link to="/apply" style={styles.link}>Apply</Link></li>
              <li style={styles.linkItem}><Link to="/tenant/login" style={styles.link}>Tenant Login</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={styles.title}>Contact</h4>
            <div style={styles.contact}>
              <p> Mbombela, Nelspruit</p>
              <p> +27 (0)13 123 4567</p>
              <p> info@studentstay.co.za</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottom}>
          <p style={styles.copyright}>
            © {currentYear} StudentStay Accommodation. All rights reserved_Project-T.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;