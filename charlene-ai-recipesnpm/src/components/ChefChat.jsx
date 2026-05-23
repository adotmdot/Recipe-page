import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

function ChefChat() {

    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);

    const chatEndRef = useRef(null);

    useEffect(() => {

        chatEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [chat, loading]);

    const sendMessage = async () => {

        if (!message.trim()) return;

        const userMessage = {
            role: "user",
            content: message
        };

        setChat((prev) => [...prev, userMessage]);

        const currentMessage = message;

        setMessage("");

        setLoading(true);

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/chef-chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: message,
                        history: chat.map((msg) => ({
                            role: msg.role,
                            content: msg.content
                        }))
                    }),
                }
            );

            const reader = response.body.getReader();

            const decoder = new TextDecoder();

            let aiResponse = "";

            setChat((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: ""
                }
            ]);

            while (true) {

                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value);

                aiResponse += chunk;

                setChat((prev) => {

                    const updatedChat = [...prev];

                    updatedChat[updatedChat.length - 1] = {
                        role: "assistant",
                        content: aiResponse
                    };

                    return updatedChat;
                });
            }

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="chef-chat-container">

            <h2 className="chef-title">
                AI Chef Assistant
            </h2>

            <div className="chat-box">

                {chat.length === 0 && (

                    <div className="welcome-message">

                        👋 Hi! I'm your AI Chef Assistant.

                        <br /><br />

                        Ask me things like:

                        <ul>
                            <li>🍳 High protein breakfast ideas</li>
                            <li>🥗 Healthy meal prep recipes</li>
                            <li>🌶️ Spicy dinner ideas</li>
                            <li>🛒 Grocery list suggestions</li>
                            <li>🥩 Meals with chicken and rice</li>
                        </ul>

                    </div>

                )}

                {chat.map((msg, index) => (

                    <div
                        key={index}
                        className={
                            msg.role === "user"
                                ? "user-message"
                                : "ai-message"
                        }
                    >

                        <strong>
                            {msg.role === "user"
                                ? "You"
                                : "AI Chef"}
                        </strong>

                        <br /><br />

                        <ReactMarkdown>
                            {msg.content}
                        </ReactMarkdown>

                    </div>

                ))}

                {loading && (

                    <div className="ai-message">

                        <strong>AI Chef</strong>

                        <br /><br />

                        <div className="typing-indicator">

                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>

                        </div>

                    </div>

                )}

                <div ref={chatEndRef}></div>

            </div>

            <div className="chat-input-area">

                <input
                    type="text"
                    placeholder="Ask the AI chef anything..."
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {

                        if (e.key === "Enter") {
                            sendMessage();
                        }

                    }}
                />

                <button onClick={sendMessage}>
                    Send
                </button>

            </div>

        </div>

    );
}

export default ChefChat;