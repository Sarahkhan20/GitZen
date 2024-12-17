import React from "react";
import { FaGithub } from "react-icons/fa"; // GitHub Icon

const Header = () => {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>
        <FaGithub style={{ marginRight: "10px" }} />
        GitZen
      </h1>
      <a
        href="https://github.com/YOUR_REPO_LINK" // Replace with your GitHub repo link
        target="_blank"
        rel="noopener noreferrer"
        style={styles.link}
      >
        View on GitHub
      </a>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#24292e",
    color: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  title: {
    display: "flex",
    alignItems: "center",
    fontSize: "1.8rem",
    margin: 0,
  },
  link: {
    color: "#58a6ff",
    textDecoration: "none",
    fontSize: "1rem",
  },
};

export default Header;
