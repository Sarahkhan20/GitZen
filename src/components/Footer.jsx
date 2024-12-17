import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        Developed with <span style={{ color: "red" }}>❤️</span> by Sarah Khan
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#24292e",
    color: "#ffffff",
    position: "relative",
    bottom: 0,
    width: "100%",
    marginTop: "20px",
  },
  text: {
    margin: 0,
    fontSize: "1rem",
  },
};

export default Footer;
