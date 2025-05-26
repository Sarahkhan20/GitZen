
import React from "react";
import { FaHeart, FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaCode, FaRocket } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.section}>
            <div style={styles.logoSection}>
              <div style={styles.logoIcon}>
                <FaCode style={styles.logoIconSvg} />
              </div>
              <div>
                <h3 style={styles.footerTitle}>GitZen</h3>
                <p style={styles.footerSubtitle}>AI-Powered Code Analysis</p>
              </div>
            </div>
            <p style={styles.description}>
              Revolutionizing code understanding with AI. Extract, analyze, and chat with your repositories effortlessly.
            </p>
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Quick Links</h4>
            <div style={styles.linksList}>
              <a href="#features" style={styles.footerLink}>Features</a>
              <a href="#about" style={styles.footerLink}>About</a>
              <a href="#contact" style={styles.footerLink}>Contact</a>
              <a href="#privacy" style={styles.footerLink}>Privacy Policy</a>
            </div>
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Technologies</h4>
            <div style={styles.techList}>
              <span style={styles.techTag}>React</span>
              <span style={styles.techTag}>Node.js</span>
              <span style={styles.techTag}>Gemini AI</span>
              <span style={styles.techTag}>GitHub API</span>
            </div>
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Connect</h4>
            <div style={styles.socialLinks}>
              <a
                href="https://github.com/Sarahkhan20"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialLink}
                title="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com/in/sarahkhan"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialLink}
                title="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://twitter.com/sarahkhan"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialLink}
                title="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="mailto:sarah@example.com"
                style={styles.socialLink}
                title="Email"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.bottomSection}>
          <div style={styles.copyright}>
            <p style={styles.copyrightText}>
              © {currentYear} GitZen. Made with <FaHeart style={styles.heartIcon} /> by Sarah Khan
            </p>
          </div>
          <div style={styles.badge}>
            <FaRocket style={styles.rocketIcon} />
            <span style={styles.badgeText}>Powered by AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: "linear-gradient(135deg, #1a1f25 0%, #24292e 100%)",
    color: "#ffffff",
    marginTop: "auto",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 30px 20px",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: "40px",
    marginBottom: "30px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px",
  },
  logoIcon: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(45deg, #64b5f6, #42a5f5)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 15px rgba(100, 181, 246, 0.3)",
  },
  logoIconSvg: {
    fontSize: "20px",
    color: "#fff",
  },
  footerTitle: {
    fontSize: "1.4rem",
    margin: 0,
    fontWeight: "700",
    color: "#fff",
  },
  footerSubtitle: {
    fontSize: "0.8rem",
    margin: 0,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "400",
  },
  description: {
    fontSize: "0.9rem",
    lineHeight: "1.6",
    color: "rgba(255,255,255,0.8)",
    margin: 0,
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#fff",
    margin: 0,
    marginBottom: "5px",
  },
  linksList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  footerLink: {
    color: "rgba(255,255,255,0.7)",
    textDecoration: "none",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    position: "relative",
  },
  techList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  techTag: {
    background: "rgba(255,255,255,0.1)",
    color: "#64b5f6",
    padding: "4px 12px",
    borderRadius: "15px",
    fontSize: "0.8rem",
    fontWeight: "500",
    border: "1px solid rgba(100, 181, 246, 0.3)",
    alignSelf: "flex-start",
  },
  socialLinks: {
    display: "flex",
    gap: "15px",
  },
  socialLink: {
    width: "40px",
    height: "40px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,0.8)",
    fontSize: "1.1rem",
    textDecoration: "none",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.1)",
    margin: "20px 0",
  },
  bottomSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
  },
  copyright: {
    display: "flex",
    alignItems: "center",
  },
  copyrightText: {
    margin: 0,
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.7)",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  heartIcon: {
    color: "#ff4757",
    fontSize: "0.8rem",
    animation: "pulse 2s infinite",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(100, 181, 246, 0.2)",
    padding: "8px 15px",
    borderRadius: "20px",
    border: "1px solid rgba(100, 181, 246, 0.3)",
  },
  rocketIcon: {
    color: "#64b5f6",
    fontSize: "0.9rem",
  },
  badgeText: {
    color: "#64b5f6",
    fontSize: "0.8rem",
    fontWeight: "600",
  },
};

export default Footer;
