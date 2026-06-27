"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MentorForm from "@/components/MentorForm";
import Dashboard from "@/components/Dashboard";
import MockInterview from "@/components/MockInterview";
import { AlertCircle, HelpCircle } from "lucide-react";

interface StudentData {
  resumeText: string;
  targetRole: string;
  skills: string;
  resumeFile?: {
    data: string;
    mimeType: string;
  };
}

interface RoadmapItem {
  day: number;
  title: string;
  description: string;
}

interface SessionData {
  summary: string;
  gaps: string[];
  roadmap: RoadmapItem[];
  readinessScore: number;
  weakestRound: string;
  weakestRoundReason: string;
  dailyTask: string;
  mockQuestion: string;
  isDemo?: boolean;
}

interface ChatMessage {
  role: "mentor" | "student";
  content: string;
  feedback?: string;
  nextAction?: string;
}

export default function Home() {
  const [apiKey, setApiKey] = useState<string>("demo");
  const [hasLoadedKey, setHasLoadedKey] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load API key and previous session from local storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKey = localStorage.getItem("careerpilot_key");
      if (storedKey) {
        setApiKey(storedKey);
      } else {
        setApiKey("demo");
      }
      setHasLoadedKey(true);

      const storedStudent = localStorage.getItem("careerpilot_student");
      const storedSession = localStorage.getItem("careerpilot_session");
      const storedChat = localStorage.getItem("careerpilot_chat");

      if (storedStudent && storedSession) {
        try {
          setStudentData(JSON.parse(storedStudent));
          setSessionData(JSON.parse(storedSession));
          if (storedChat) {
            setChatHistory(JSON.parse(storedChat));
          }
        } catch (e) {
          console.error("Failed to restore session storage:", e);
        }
      }
    }
  }, []);

  // Sync API key updates
  const handleSetApiKey = (newKey: string) => {
    setApiKey(newKey);
    if (typeof window !== "undefined") {
      if (newKey && newKey !== "demo") {
        localStorage.setItem("careerpilot_key", newKey);
      } else {
        localStorage.removeItem("careerpilot_key");
      }
    }
  };

  // Profile analysis form submission
  const handleAnalyzeProfile = async (formData: StudentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-key": apiKey
        },
        body: JSON.stringify({
          action: "analyze",
          studentData: formData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze profile.");
      }

      setStudentData(formData);
      setSessionData(data);
      setChatHistory([]); // Clear chat history for the new session

      if (typeof window !== "undefined") {
        localStorage.setItem("careerpilot_student", JSON.stringify(formData));
        localStorage.setItem("careerpilot_session", JSON.stringify(data));
        localStorage.removeItem("careerpilot_chat");
      }
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err?.message || "Something went wrong while connecting to the AI Mentor.");
    } finally {
      setLoading(false);
    }
  };

  // Mock interview answer submission
  const handleSubmitAnswer = async (answer: string) => {
    if (!studentData || !sessionData) return;

    setInterviewLoading(true);
    setError(null);

    // 1. Add student's response to chat log
    const updatedHistory: ChatMessage[] = [
      ...chatHistory,
      { role: "mentor", content: sessionData.mockQuestion },
      { role: "student", content: answer }
    ];
    setChatHistory(updatedHistory);

    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-key": apiKey
        },
        body: JSON.stringify({
          action: "answer",
          studentData,
          chatHistory: updatedHistory.slice(-6), // Keep history compact
          latestAnswer: answer
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit answer.");
      }

      // 2. Add feedback to the last student answer
      const feedbackHistory = [...updatedHistory];
      const lastStudentMsgIdx = feedbackHistory.length - 1;
      feedbackHistory[lastStudentMsgIdx] = {
        ...feedbackHistory[lastStudentMsgIdx],
        feedback: data.feedback,
        nextAction: data.nextAction
      };

      setChatHistory(feedbackHistory);

      // 3. Update session stats and load the next question
      const updatedSession: SessionData = {
        ...sessionData,
        readinessScore: data.readinessScore,
        weakestRound: data.weakestRound,
        weakestRoundReason: data.weakestRoundReason,
        mockQuestion: data.nextQuestion,
        isDemo: data.isDemo
      };

      setSessionData(updatedSession);

      if (typeof window !== "undefined") {
        localStorage.setItem("careerpilot_session", JSON.stringify(updatedSession));
        localStorage.setItem("careerpilot_chat", JSON.stringify(feedbackHistory));
      }
    } catch (err: any) {
      console.error("Interview Evaluation Error:", err);
      setError(err?.message || "Failed to process interview response.");
      
      // Revert the history additions since the request failed
      setChatHistory(chatHistory);
    } finally {
      setInterviewLoading(false);
    }
  };

  // Reset Session
  const handleResetSession = () => {
    if (confirm("Are you sure you want to reset your placement session? This will clear your current roadmap and interview history.")) {
      setStudentData(null);
      setSessionData(null);
      setChatHistory([]);
      setError(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("careerpilot_student");
        localStorage.removeItem("careerpilot_session");
        localStorage.removeItem("careerpilot_chat");
      }
    }
  };

  return (
    <>
      <Navbar
        apiKey={apiKey}
        setApiKey={handleSetApiKey}
        onReset={handleResetSession}
        hasSession={!!sessionData}
      />

      <main className="main-container fade-in">
        {/* Error Banner */}
        {error && (
          <div
            style={{
              background: "var(--rose-glow)",
              border: "1px solid var(--rose)",
              color: "#fecdd3",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              fontSize: "14px",
              lineHeight: "1.5"
            }}
          >
            <AlertCircle size={20} color="var(--rose)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div style={{ flex: 1 }}>
              <strong style={{ display: "block", marginBottom: "4px" }}>Mentor Error</strong>
              {error}
            </div>
            <button
              onClick={() => setError(null)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px"
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Content routing */}
        {!hasLoadedKey ? (
          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
            <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Loading CareerPilot AI...</span>
          </div>
        ) : !sessionData ? (
          <MentorForm onSubmit={handleAnalyzeProfile} loading={loading} />
        ) : (
          <div className="dashboard-grid">
            {/* Left Dashboard Panel (Resume Analysis, Score, Roadmap) */}
            <div>
              <Dashboard
                summary={sessionData.summary}
                gaps={sessionData.gaps}
                roadmap={sessionData.roadmap}
                readinessScore={sessionData.readinessScore}
                weakestRound={sessionData.weakestRound}
                weakestRoundReason={sessionData.weakestRoundReason}
                dailyTask={sessionData.dailyTask}
                isDemo={sessionData.isDemo}
              />
            </div>

            {/* Right Interactive Panel (Mock Interview Chat) */}
            <div style={{ position: "sticky", top: "96px" }}>
              <MockInterview
                initialQuestion={sessionData.mockQuestion}
                chatHistory={chatHistory}
                onSubmitAnswer={handleSubmitAnswer}
                loading={interviewLoading}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "24px",
          color: "var(--text-muted)",
          fontSize: "12px",
          borderTop: "1px solid var(--border-color)",
          marginTop: "auto"
        }}
      >
        CareerPilot AI © 2026 • Simple, Smart, and Hackathon-Ready. Designed to get you placement-ready.
      </footer>
    </>
  );
}
