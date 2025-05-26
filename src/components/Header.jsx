import React, { useState, useEffect } from "react";
import { FaGithub, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            style={{
                ...styles.header,
                backdropFilter: isScrolled ? "blur(10px)" : "none",
                backgroundColor: isScrolled
                    ? "rgba(36, 41, 46, 0.95)"
                    : "#24292e",
                boxShadow: isScrolled
                    ? "0 4px 20px rgba(0,0,0,0.3)"
                    : "0 2px 4px rgba(0,0,0,0.2)",
            }}
        >
            <div style={styles.container}>
                <div style={styles.logoSection}>
                    <div style={styles.logoIcon}>
                        <FaGithub style={styles.githubIcon} />
                    </div>
                    <div style={styles.logoText}>
                        <h1 style={styles.title}>GitZen</h1>
                        <span style={styles.tagline}>AI Code Analyzer</span>
                    </div>
                </div>

                <nav style={styles.nav}>
                    <div style={styles.navLinks}></div>

                    <a
                        href="https://github.com/Sarahkhan20/GitZen"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.githubButton}
                    >
                        <FaGithub style={{ marginRight: "8px" }} />
                        View on GitHub
                    </a>

                    <button
                        style={styles.mobileMenuButton}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </nav>
            </div>

            {isMobileMenuOpen && (
                <div style={styles.mobileMenu}>
                    <a href="#features" style={styles.mobileNavLink}>
                        Features
                    </a>
                    <a href="#about" style={styles.mobileNavLink}>
                        About
                    </a>
                    <a href="#contact" style={styles.mobileNavLink}>
                        Contact
                    </a>
                    <a
                        href="https://github.com/Sarahkhan20/GitZen"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.mobileGithubLink}
                    >
                        <FaGithub style={{ marginRight: "8px" }} />
                        View on GitHub
                    </a>
                </div>
            )}
        </header>
    );
};

const styles = {
    header: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "all 0.3s ease",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
    },
    container: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        maxWidth: "1200px",
        margin: "0 auto",
    },
    logoSection: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
    },
    logoIcon: {
        width: "45px",
        height: "45px",
        background: "linear-gradient(45deg, #64b5f6, #42a5f5)",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 15px rgba(100, 181, 246, 0.3)",
    },
    githubIcon: {
        fontSize: "24px",
        color: "#fff",
    },
    logoText: {
        display: "flex",
        flexDirection: "column",
    },
    title: {
        fontSize: "1.8rem",
        margin: 0,
        color: "#fff",
        fontWeight: "700",
        lineHeight: "1",
    },
    tagline: {
        fontSize: "0.75rem",
        color: "rgba(255,255,255,0.7)",
        fontWeight: "400",
        marginTop: "2px",
    },
    nav: {
        display: "flex",
        alignItems: "center",
        gap: "30px",
    },
    navLinks: {
        display: "flex",
        gap: "25px",
        alignItems: "center",
    },
    navLink: {
        color: "rgba(255,255,255,0.8)",
        textDecoration: "none",
        fontSize: "0.95rem",
        fontWeight: "500",
        transition: "all 0.3s ease",
        position: "relative",
        padding: "8px 0",
    },
    githubButton: {
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(45deg, #64b5f6, #42a5f5)",
        color: "#fff",
        textDecoration: "none",
        padding: "10px 20px",
        borderRadius: "25px",
        fontSize: "0.9rem",
        fontWeight: "600",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 15px rgba(100, 181, 246, 0.3)",
    },
    mobileMenuButton: {
        display: "none",
        background: "none",
        border: "none",
        color: "#fff",
        fontSize: "1.2rem",
        cursor: "pointer",
        padding: "8px",
    },
    mobileMenu: {
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        background: "rgba(36, 41, 46, 0.98)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        padding: "20px 30px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    mobileNavLink: {
        color: "rgba(255,255,255,0.8)",
        textDecoration: "none",
        fontSize: "1rem",
        fontWeight: "500",
        padding: "10px 0",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
    },
    mobileGithubLink: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(45deg, #64b5f6, #42a5f5)",
        color: "#fff",
        textDecoration: "none",
        padding: "12px 20px",
        borderRadius: "25px",
        fontSize: "0.9rem",
        fontWeight: "600",
        marginTop: "10px",
    },
};

// Add responsive styles
const mediaQuery = window.matchMedia("(max-width: 768px)");
if (mediaQuery.matches) {
    styles.navLinks.display = "none";
    styles.githubButton.display = "none";
    styles.mobileMenuButton.display = "block";
}

export default Header;
