
import React, { useState } from "react";
import axios from "axios";
import CodeSummarizer from "./CodeSummarizer";
import ChatInterface from "./ChatInterface";
import { FaCopy, FaDownload, FaCog, FaComments, FaCode } from "react-icons/fa";
import "../App.css";

const CodeExtractor = () => {
  const [repoLink, setRepoLink] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [showSettings, setShowSettings] = useState(false);
  const [fileFilters, setFileFilters] = useState({
    includeExtensions: ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h', '.php', '.rb', '.go', '.rs', '.swift', '.kt'],
    excludeExtensions: ['.css', '.scss', '.less', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.ttf'],
    excludeDirs: ['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '__pycache__'],
    maxFileSize: 100000 // 100KB
  });

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
      const response = await axios.post('/api/extract-code', {
        repoUrl: repoLink,
        filters: fileFilters
      });

      setCode(response.data.code);
    } catch (err) {
      console.error("Error extracting code:", err);
      setError(err.response?.data?.error || "Failed to extract code from repository");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFileFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="code-extractor-container">
      <div className="header-section">
        <h1 className="main-title">GitHub Code Analyzer</h1>
        <p className="subtitle">Extract, analyze, and chat with your code repositories</p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter GitHub Repository URL (e.g., https://github.com/user/repo)"
            value={repoLink}
            onChange={(e) => setRepoLink(e.target.value)}
            disabled={loading}
            className="repo-input"
          />
          <button
            className="settings-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Configure file filters"
          >
            <FaCog />
          </button>
        </div>

        {showSettings && (
          <div className="settings-panel">
            <h3>File Filtering Options</h3>
            <div className="filter-group">
              <label>Include Extensions (comma-separated):</label>
              <input
                type="text"
                value={fileFilters.includeExtensions.join(', ')}
                onChange={(e) => handleFilterChange('includeExtensions', e.target.value.split(',').map(ext => ext.trim()))}
                placeholder=".js, .jsx, .ts, .py"
              />
            </div>
            <div className="filter-group">
              <label>Exclude Extensions (comma-separated):</label>
              <input
                type="text"
                value={fileFilters.excludeExtensions.join(', ')}
                onChange={(e) => handleFilterChange('excludeExtensions', e.target.value.split(',').map(ext => ext.trim()))}
                placeholder=".css, .png, .jpg"
              />
            </div>
            <div className="filter-group">
              <label>Exclude Directories (comma-separated):</label>
              <input
                type="text"
                value={fileFilters.excludeDirs.join(', ')}
                onChange={(e) => handleFilterChange('excludeDirs', e.target.value.split(',').map(dir => dir.trim()))}
                placeholder="node_modules, .git, dist"
              />
            </div>
            <div className="filter-group">
              <label>Max File Size (bytes):</label>
              <input
                type="number"
                value={fileFilters.maxFileSize}
                onChange={(e) => handleFilterChange('maxFileSize', parseInt(e.target.value) || 100000)}
                placeholder="100000"
              />
            </div>
          </div>
        )}

        <button 
          className="extract-btn" 
          onClick={extractCode}
          disabled={loading}
        >
          {loading ? (
            <div className="loading-content">
              <div className="spinner"></div>
              Extracting Code...
            </div>
          ) : (
            <>
              <FaCode />
              Extract & Analyze Code
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <div className="error-content">
            <h3>⚠️ Error</h3>
            <p>{error}</p>
            <div className="error-tips">
              <h4>Common issues:</h4>
              <ul>
                <li>Make sure the repository URL is correct and public</li>
                <li>Check if the repository exists and is accessible</li>
                <li>Some large repositories may take longer to process</li>
                <li>Private repositories cannot be accessed</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {code && (
        <div className="results-container">
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              <FaCode />
              Code & Summary
            </button>
            <button
              className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <FaComments />
              Chat with Code
            </button>
          </div>

          {activeTab === 'summary' && (
            <div className="code-summary-container">
              <div className="code-section">
                <div className="section-header">
                  <h2>Extracted Code</h2>
                  <div className="action-buttons">
                    <button
                      className="action-btn"
                      onClick={() => copyToClipboard(code)}
                      title="Copy to Clipboard"
                    >
                      <FaCopy />
                    </button>
                    <button
                      onClick={() => downloadAsTxt("extracted_code.txt", code)}
                      className="action-btn"
                      title="Download as Text"
                    >
                      <FaDownload />
                    </button>
                  </div>
                </div>
                <div className="code-content">
                  <pre>{code}</pre>
                </div>
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

          {activeTab === 'chat' && (
            <ChatInterface code={code} />
          )}
        </div>
      )}
    </div>
  );
};

export default CodeExtractor;
