import React from "react";
import { FaHeart, FaGithub, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.content}>
          <p style={styles.madeWith}>
            Made with <FaHeart style={styles.heartIcon} /> by Sarah Khan
          </p>
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
              href="https://twitter.com/sarahkhan"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.socialLink}
              title="Twitter"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
        <div style={styles.copyright}>
          <span style={styles.copyrightText}>© {currentYear} GitZen</span>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: "rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(10px)",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    color: "#ffffff",
    marginTop: "auto",
    padding: "20px 0",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 30px",
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  madeWith: {
    margin: 0,
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.8)",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  heartIcon: {
    color: "#ff4757",
    fontSize: "0.8rem",
    animation: "pulse 2s infinite",
  },
  socialLinks: {
    display: "flex",
    gap: "15px",
  },
  socialLink: {
    width: "35px",
    height: "35px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,0.8)",
    fontSize: "1rem",
    textDecoration: "none",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  copyright: {
    textAlign: "center",
    paddingTop: "10px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  copyrightText: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.6)",
  },
};

export default Footer;