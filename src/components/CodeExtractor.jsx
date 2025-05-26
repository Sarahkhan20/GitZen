import React, { useState } from "react";
import axios from "axios";
import CodeSummarizer from "./CodeSummarizer";
import { FaCopy, FaDownload } from "react-icons/fa";
import "../App.css";

const CodeExtractor = () => {
  const [repoLink, setRepoLink] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  const downloadAsTxt = (filename, content) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const extractCode = async () => {
    if (!repoLink.trim()) {
      setError("Please enter a repository URL");
      return;
    }

    setLoading(true);
    setError("");
    setCode("");

    try {
      const response = await axios.post('http://localhost:3001/api/extract-code', {
        repoUrl: repoLink
      });

      setCode(response.data.code);
    } catch (err) {
      console.error("Error extracting code:", err);
      setError(err.response?.data?.error || "Failed to extract code from repository");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="output-group">
      <h1>GitHub Code Summarizer</h1>
      <div className="input-group">
        <div className="input-group-insider">
          <input
            type="text"
            placeholder="Enter GitHub Repo URL"
            value={repoLink}
            onChange={(e) => setRepoLink(e.target.value)}
            disabled={loading}
          />
          <button 
            className="extractCodeButton" 
            onClick={extractCode}
            disabled={loading}
          >
            {loading ? "Extracting..." : "Extract Code"}
          </button>
        </div>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {code && (
        <div className="code-summary-container">
          <div className="code-section">
            <h2>Extracted Code:</h2>
            <div>
              <button
                className="secbutton"
                onClick={() => copyToClipboard(code)}
                title="Copy to Clipboard"
              >
                <FaCopy />
              </button>
              <button
                onClick={() => downloadAsTxt("extracted_code.txt", code)}
                className="secbutton"
                title="Download as Text"
              >
                <FaDownload />
              </button>
            </div>
            <pre>{code}</pre>
          </div>
          <div className="summary-section">
            <CodeSummarizer
              code={code}
              copyToClipboard={copyToClipboard}
              downloadAsTxt={downloadAsTxt}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeExtractor;