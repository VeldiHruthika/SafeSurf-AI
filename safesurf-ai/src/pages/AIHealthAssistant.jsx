import { useState } from "react";
import "./../styles/AIHealthAssistant.css";
import suggestedQuestions from "../data/suggestedQuestions";

function AIHealthAssistant() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I'm SafeSurf AI. How can I help you today?"
    }
  ]);

  const [loading, setLoading] = useState(false);

  const sendMessage = async (text = message) => {
    if (!text.trim()) return;

    const userMessage = {
      sender: "user",
      text
    };

    setMessages((previous) => [...previous, userMessage]);

    setMessage("");

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message: text
          })
        }
      );

      const data = await response.json();

      setMessages((previous) => [
        ...previous,
        {
          sender: "ai",
          text: data.reply
        }
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          sender: "ai",
          text: "Sorry. Something went wrong."
        }
      ]);
    }

    setLoading(false);
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "ai",
        text: "Hello! I'm SafeSurf AI. How can I help you today?"
      }
    ]);
  };

  return (
    <div className="ai-page">

      <div className="ai-hero">

        <span className="ai-badge">
          ✦ AI HEALTH TOOL
        </span>

        <h1>
          Ask Your
          <span> Health Questions.</span>
        </h1>

        <p>
          Ask anything about health, medicines,
          reports, symptoms, nutrition, or
          SafeSurf features.
        </p>

      </div>

      <div className="ai-card">

        <h3>Suggested Questions</h3>

        <div className="question-buttons">

          {suggestedQuestions.map((question) => (
            <button
              key={question}
              onClick={() => sendMessage(question)}
            >
              {question}
            </button>
          ))}

        </div>

        <div className="chat-box">

          {messages.map((item, index) => (
            <div
              key={index}
              className={`chat-message ${item.sender}`}
            >
              {item.text}
            </div>
          ))}

          {loading && (
            <div className="chat-message ai">
              Thinking...
            </div>
          )}

        </div>

        <div className="input-section">

          <input
            type="text"
            placeholder="Type your question..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
          />

          <button onClick={() => sendMessage()}>
            Send
          </button>

          <button onClick={clearChat}>
            New Chat
          </button>

        </div>

        <div className="ai-warning">

          ⚠️ SafeSurf AI provides educational
          information only and does not replace
          professional medical advice.

        </div>

      </div>

    </div>
  );
}

export default AIHealthAssistant;