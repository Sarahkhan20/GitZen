import React, { useState } from "react";
import axios from "axios";
import { FaPaperPlane, FaUser, FaRobot } from "react-icons/fa";

const ChatInterface = ({ code }) => {
    const [messages, setMessages] = useState([
        {
            type: "bot",
            content:
                "Hi! I'm here to help you understand this codebase. You can ask me questions about the code structure, functionality, or any specific files. What would you like to know?",
        },
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = inputMessage.trim();
        setInputMessage("");

        // Add user message to chat
        setMessages((prev) => [
            ...prev,
            { type: "user", content: userMessage },
        ]);
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:3001/api/chat-with-code",
                {
                    message: userMessage,
                    code: code,
                }
            );

            // Add bot response to chat
            setMessages((prev) => [
                ...prev,
                { type: "bot", content: response.data.response },
            ]);
        } catch (error) {
            console.error("Error in chat:", error);
            setMessages((prev) => [
                ...prev,
                {
                    type: "bot",
                    content:
                        "Sorry, I encountered an error processing your question. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chat-interface">
            <div className="chat-header">
                <h2>Chat with Your Code</h2>
                <p>This feature is in development process !</p>
            </div>
        </div>
    );
};

export default ChatInterface;
