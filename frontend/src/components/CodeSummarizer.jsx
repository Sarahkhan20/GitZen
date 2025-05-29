import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCopy, FaDownload } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const CodeSummarizer = ({ code, copyToClipboard, downloadAsTxt }) => {
    const [summary, setSummary] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState("");

    const summarizeCode = async (codeText) => {
        setLoading(true);
        setError("");
        setSummary("");
        setProgress("");

        try {
            // Estimate if this will require chunking
            if (codeText.length > 50000) {
                setProgress(
                    "Processing large repository - this may take a moment..."
                );
            }

            const response = await axios.post("/api/summarize-code", {
                code: codeText,
            });

            setSummary(response.data.summary);
            setProgress("");
        } catch (err) {
            console.error("Error summarizing code:", err);
            setError(err.response?.data?.error || "Failed to summarize code");
            setProgress("");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (code) {
            summarizeCode(code);
        }
    }, [code]);

    return (
        <div>
            <h2>AI Summary:</h2>
            {loading && <p>Generating summary...</p>}
            {progress && (
                <p style={{ color: "#2196F3", fontStyle: "italic" }}>
                    {progress}
                </p>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {summary && (
                <div>
                    <div>
                        <button
                            className="secbutton"
                            onClick={() => copyToClipboard(summary)}
                            title="Copy Summary"
                        >
                            <FaCopy />
                        </button>
                        <button
                            onClick={() =>
                                downloadAsTxt("code_summary.txt", summary)
                            }
                            className="secbutton"
                            title="Download Summary"
                        >
                            <FaDownload />
                        </button>
                    </div>
                    <div
                        className="summary-scroll"
                        style={{
                            background: "#23234b",
                            borderRadius: 8,
                            padding: 12,
                        }}
                    >
                        <ReactMarkdown
                            children={summary}
                            components={{
                                h1: ({ node, ...props }) => (
                                    <h1
                                        style={{ color: "#64b5f6" }}
                                        {...props}
                                    />
                                ),
                                h2: ({ node, ...props }) => (
                                    <h2
                                        style={{ color: "#90caf9" }}
                                        {...props}
                                    />
                                ),
                                li: ({ node, ...props }) => (
                                    <li
                                        style={{ marginBottom: 6 }}
                                        {...props}
                                    />
                                ),
                                strong: ({ node, ...props }) => (
                                    <strong
                                        style={{ color: "#ffd54f" }}
                                        {...props}
                                    />
                                ),
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodeSummarizer;
