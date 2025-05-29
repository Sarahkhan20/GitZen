import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CodeExtractor from "./components/CodeExtractor";

const App = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh", // Use minHeight instead of height
            }}
        >
            <Header />
            <main
                style={{
                    flex: 1,
                    width: "100%",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    // Remove overflow: "hidden"
                }}
            >
                <CodeExtractor />
            </main>
            <Footer />
        </div>
    );
};

export default App;
