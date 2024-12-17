import React, { useState, useEffect } from "react";
import Groq from "groq-sdk";
import { FaCopy, FaDownload } from "react-icons/fa";
const CodeSummarizer = ({ code, copyToClipboard, downloadAsTxt }) => {
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const summarizeCode = async (codeText) => {
    try {
      const groq = new Groq({
        apiKey: process.env.REACT_APP_GROQ_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const template = `Summarize this GitHub repository. The aim of this project is to assist individuals who are contributing to open source projects and may not fully understand the repository's purpose or functionality. Please provide a concise summary that includes key features, objectives, and any important information that would help new contributors understand the project better.\n\n\`\`\`${codeText}\`\`\`\n\nBULLET POINT SUMMARY:\n`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: template,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });

      if (chatCompletion && chatCompletion.choices.length > 0) {
        setSummary(chatCompletion.choices[0].message.content);
      } else {
        setError("No summary returned from API");
      }
    } catch (err) {
      console.error("Error summarizing code:", err.message);
      setError("Failed to summarize code");
    }
  };

  useEffect(() => {
    if (code) {
      summarizeCode(code);
    }
  }, [code]);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {summary && (
        <div>
          <h2>Summary:</h2>
          <div>
            <button
              onClick={() => copyToClipboard(summary)}
              title="Copy to Clipboard"
              className="secbutton"
            >
              <FaCopy />
            </button>
            <button
              onClick={() => downloadAsTxt("code_summary.txt", summary)}
              title="Download as Text"
              className="secbutton"
            >
              <FaDownload />
            </button>
          </div>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              backgroundColor: "#f5f5f5",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {summary}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeSummarizer;
