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
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Header />
      <main
        style={{
          flex: 1,
          height: "80vh",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflowX: "hidden",
        }}
      >
        <CodeExtractor />
      </main>
      <Footer />
    </div>
  );
};

export default App;
