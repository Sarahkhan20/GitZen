import React, { useState } from "react";
import axios from "axios";
import CodeSummarizer from "./CodeSummarizer";
import { FaCopy, FaDownload } from "react-icons/fa";
import "../App.css";

const CodeExtractor = () => {
  const [repoLink, setRepoLink] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
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
    const token = process.env.REACT_APP_GITHUB_TOKEN;
    const parts = repoLink.split("/");
    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];

    const fetchContents = async (path) => {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      console.log("Fetching URL:", url);

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3.raw",
          },
        });

        console.log("Response data:", response.data);

        let contentOutput = "";

        for (const item of response.data) {
          if (item.type === "file") {
            const fileResponse = await axios.get(item.download_url);
            contentOutput += `File: ${item.path}\n`;
            contentOutput += "=".repeat(60) + "\n";
            contentOutput += fileResponse.data + "\n";
            contentOutput += "=".repeat(60) + "\n\n";
          } else if (item.type === "dir") {
            contentOutput += await fetchContents(item.path);
          }
        }

        return contentOutput;
      } catch (err) {
        console.error(
          "Error fetching contents:",
          err.response?.data || err.message
        );
        setError(err.response?.data?.message || "An error occurred");
        return "";
      }
    };

    const allCode = await fetchContents("");
    console.log("All Code Fetched:", allCode);
    setCode(allCode);
    setError("");
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
          />
          <button className="extractCodeButton" onClick={extractCode}>
            Extract Code
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

          {/* Summary Section */}
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
