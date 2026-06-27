"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Mic, MicOff, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

interface ChatMessage {
  role: "mentor" | "student";
  content: string;
  feedback?: string;
  nextAction?: string;
}

interface MockInterviewProps {
  initialQuestion: string;
  chatHistory: ChatMessage[];
  onSubmitAnswer: (answer: string) => Promise<void>;
  loading: boolean;
}

export default function MockInterview({
  initialQuestion,
  chatHistory,
  onSubmitAnswer,
  loading
}: MockInterviewProps) {
  const [answer, setAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-IN"; // Good for Hinglish / Indian accents

        rec.onstart = () => setIsListening(true);
        rec.onend = () => setIsListening(false);
        rec.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          setAnswer((prev) => (prev ? prev + " " + resultText : resultText));
        };
        rec.onerror = (e: any) => {
          console.error("Speech recognition error:", e);
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, initialQuestion, loading]);

  const handleMicToggle = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || loading) return;
    onSubmitAnswer(answer.trim());
    setAnswer("");
  };

  return (
    <div className="glass-card fade-in" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "500px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "14px",
          marginBottom: "16px"
        }}
      >
        <MessageSquare size={18} color="var(--cyan)" />
        <h3 style={{ fontSize: "16px", fontWeight: 700 }}>
          Interactive Mock Interview
        </h3>
        <span className="badge badge-cyan" style={{ marginLeft: "auto", fontSize: "10px" }}>
          1-on-1 Session
        </span>
      </div>

      {/* Chat History and Feed */}
      <div
        className="chat-container"
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "16px",
          paddingRight: "6px"
        }}
      >
        {/* Intro Mentor Message */}
        <div className="chat-bubble chat-bubble-mentor fade-in">
          Hello! Welcome to your mock interview round. I will ask you questions based on your resume, target role, and identified gaps. Let's start!
        </div>

        {/* Dynamic chat content */}
        {chatHistory.map((msg, index) => (
          <React.Fragment key={index}>
            {msg.role === "mentor" ? (
              <div className="chat-bubble chat-bubble-mentor fade-in">
                {msg.content}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  width: "100%"
                }}
              >
                <div className="chat-bubble chat-bubble-student fade-in">
                  {msg.content}
                </div>
                {/* Mentor Feedback below student answer */}
                {msg.feedback && (
                  <div
                    className="feedback-box fade-in"
                    style={{
                      alignSelf: "stretch",
                      marginTop: "8px",
                      marginBottom: "8px"
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "11px", color: "var(--emerald)", display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                      <CheckCircle2 size={12} /> MENTOR FEEDBACK:
                    </div>
                    <div>{msg.feedback}</div>
                    {msg.nextAction && (
                      <div style={{ marginTop: "4px", fontSize: "11px", color: "var(--cyan)", fontWeight: 500 }}>
                        💡 Next Action: {msg.nextAction}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Current Active Question */}
        {!loading && initialQuestion && (
          <div
            className="chat-bubble chat-bubble-mentor fade-in"
            style={{
              borderColor: "var(--cyan)",
              background: "rgba(6, 182, 212, 0.02)",
              boxShadow: "0 0 10px rgba(6, 182, 212, 0.05)"
            }}
          >
            <div style={{ fontSize: "10px", color: "var(--cyan)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "4px" }}>
              Current Question:
            </div>
            {initialQuestion}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="chat-bubble chat-bubble-mentor fade-in" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="animate-spin" style={{
              width: "12px",
              height: "12px",
              border: "2px solid var(--cyan)",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Mentor is evaluating your response...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ borderTop: "1px solid var(--border-color)", paddingTop: "14px", marginTop: "auto" }}>
        <div style={{ display: "flex", position: "relative", alignItems: "flex-end", gap: "8px" }}>
          <textarea
            className="form-textarea"
            placeholder="Type your response here... (Bilingual Hinglish is allowed!)"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={loading || !initialQuestion}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            style={{
              minHeight: "56px",
              maxHeight: "120px",
              flex: 1,
              paddingRight: speechSupported ? "44px" : "12px",
              paddingTop: "14px",
              paddingBottom: "14px",
              fontSize: "14px",
              margin: 0
            }}
          />

          {/* Voice dictation button */}
          {speechSupported && initialQuestion && (
            <button
              type="button"
              onClick={handleMicToggle}
              disabled={loading}
              style={{
                position: "absolute",
                right: "60px",
                bottom: "10px",
                background: isListening ? "var(--rose-glow)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isListening ? "var(--rose)" : "var(--border-color)"}`,
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              title={isListening ? "Stop listening" : "Start speaking"}
            >
              {isListening ? (
                <MicOff size={16} color="var(--rose)" style={{ animation: "pulse 1.5s infinite" }} />
              ) : (
                <Mic size={16} color="var(--text-secondary)" />
              )}
            </button>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !answer.trim() || !initialQuestion}
            style={{
              padding: "0",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </form>

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
