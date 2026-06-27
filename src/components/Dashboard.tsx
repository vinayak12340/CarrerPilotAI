"use client";

import React, { useState } from "react";
import { Award, AlertTriangle, ListChecks, Calendar, CheckSquare, Square, Star, TrendingUp } from "lucide-react";

interface RoadmapItem {
  day: number;
  title: string;
  description: string;
}

interface DashboardProps {
  summary: string;
  gaps: string[];
  roadmap: RoadmapItem[];
  readinessScore: number;
  weakestRound: string;
  weakestRoundReason: string;
  dailyTask: string;
  isDemo?: boolean;
}

export default function Dashboard({
  summary,
  gaps,
  roadmap,
  readinessScore,
  weakestRound,
  weakestRoundReason,
  dailyTask,
  isDemo
}: DashboardProps) {
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  // Toggle checklist for 7-day roadmap
  const toggleDay = (day: number) => {
    if (completedDays.includes(day)) {
      setCompletedDays(completedDays.filter((d) => d !== day));
    } else {
      setCompletedDays([...completedDays, day]);
    }
  };

  // Readiness Score calculations
  const radius = 45;
  const strokeDasharray = 2 * Math.PI * radius; // 282.74
  const strokeDashoffset = strokeDasharray - (readinessScore / 100) * strokeDasharray;

  // Determine score color based on rating
  let scoreColor = "var(--rose)";
  let scoreBadgeClass = "badge-rose";
  if (readinessScore >= 75) {
    scoreColor = "var(--emerald)";
    scoreBadgeClass = "badge-emerald";
  } else if (readinessScore >= 50) {
    scoreColor = "var(--amber)";
    scoreBadgeClass = "badge-amber";
  }

  // Determine round icon/colors
  let roundBadgeClass = "badge-rose";
  if (weakestRound.toLowerCase() === "hr") roundBadgeClass = "badge-amber";
  if (weakestRound.toLowerCase() === "communication") roundBadgeClass = "badge-cyan";

  // Calculate Roadmap Progress
  const roadmapProgress = Math.round((completedDays.length / roadmap.length) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Demo Mode Notice */}
      {isDemo && (
        <div
          className="fade-in"
          style={{
            background: "var(--amber-glow)",
            border: "1px solid var(--amber)",
            borderRadius: "12px",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "13px",
            color: "#fef3c7"
          }}
        >
          <AlertTriangle size={18} color="var(--amber)" />
          <span>
            <strong>Running in Demo Mode.</strong> Connect your Gemini API Key in settings (top-right gear icon) for custom AI coaching.
          </span>
        </div>
      )}

      {/* Summary Profile Card */}
      <div className="glass-card fade-in glow-indigo" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Star size={18} color="var(--cyan)" />
          <h3 style={{ fontSize: "16px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Student Profile Analysis
          </h3>
        </div>
        <p style={{ fontSize: "15px", lineHeight: "1.6", color: "var(--text-primary)" }}>
          {summary}
        </p>
      </div>

      {/* Grid of Key Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        {/* Readiness Score Gauge */}
        <div className="glass-card fade-in" style={{ display: "flex", alignItems: "center", gap: "24px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Award size={18} color={scoreColor} />
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Readiness Score</h3>
            </div>
            <span className={`badge ${scoreBadgeClass}`} style={{ width: "fit-content", marginTop: "4px" }}>
              {readinessScore >= 75 ? "Good Stand" : readinessScore >= 50 ? "Needs Practice" : "Critical Skill Deficit"}
            </span>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px", lineHeight: "1.4" }}>
              Score updates dynamically after mock answers. Goal: <strong>80+</strong>.
            </p>
          </div>

          {/* SVG Circular Gauge */}
          <div style={{ position: "relative", width: "110px", height: "110px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={scoreColor}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="progress-ring-circle"
                style={{
                  filter: `drop-shadow(0 0 4px ${scoreColor})`,
                  transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <span style={{ fontSize: "24px", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                {readinessScore}
              </span>
              <span style={{ fontSize: "9px", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                out of 100
              </span>
            </div>
          </div>
        </div>

        {/* Weakest Round Prediction */}
        <div className="glass-card fade-in" style={{ display: "flex", flexDirection: "column", justifySelf: "stretch" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <AlertTriangle size={18} color="var(--rose)" />
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Weakest Interview Round</h3>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div>
              <span className={`badge ${roundBadgeClass}`} style={{ fontSize: "13px", padding: "4px 12px" }}>
                {weakestRound} Round
              </span>
            </div>
            <p style={{ fontSize: "13px", lineHeight: "1.5", color: "var(--text-secondary)" }}>
              {weakestRoundReason}
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Skill Gaps */}
      <div className="glass-card fade-in" style={{ borderColor: "rgba(244, 63, 94, 0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <ListChecks size={18} color="var(--rose)" />
          <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Top 3 Skill Gaps to Fix</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {gaps.map((gap, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                background: "rgba(244, 63, 94, 0.03)",
                border: "1px solid rgba(244, 63, 94, 0.1)",
                borderRadius: "8px",
                fontSize: "14px"
              }}
            >
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "var(--rose-glow)",
                  color: "var(--rose)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "bold",
                  border: "1px solid rgba(244, 63, 94, 0.2)"
                }}
              >
                {index + 1}
              </span>
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{gap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Mentor Action Task */}
      <div
        className="glass-card fade-in glow-cyan"
        style={{
          background: "linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(16, 22, 38, 0.65) 100%)",
          borderColor: "rgba(6, 182, 212, 0.25)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <TrendingUp size={18} color="var(--cyan)" />
          <h3 style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", color: "var(--cyan)", letterSpacing: "0.05em" }}>
            Daily Mentor Mode: Today's Action
          </h3>
        </div>
        <p style={{ fontSize: "15px", fontWeight: 500, lineHeight: "1.5" }}>
          {dailyTask}
        </p>
      </div>

      {/* 7-Day Roadmap Timeline */}
      <div className="glass-card fade-in">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={18} color="var(--cyan)" />
            <h3 style={{ fontSize: "16px", fontWeight: 700 }}>7-Day Placement Prep Roadmap</h3>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Progress:</span>
            <div style={{ background: "rgba(255,255,255,0.05)", width: "100px", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
              <div
                style={{
                  background: "var(--cyan)",
                  height: "100%",
                  width: `${roadmapProgress}%`,
                  transition: "width 0.3s ease-out"
                }}
              />
            </div>
            <span style={{ fontSize: "12px", fontWeight: "bold", color: "var(--cyan)", width: "35px", textAlign: "right" }}>
              {roadmapProgress}%
            </span>
          </div>
        </div>

        <div className="timeline">
          {roadmap.map((item) => {
            const isCompleted = completedDays.includes(item.day);
            const isActive = completedDays.length + 1 === item.day;
            
            let itemClass = "timeline-item";
            if (isCompleted) itemClass += " completed";
            else if (isActive) itemClass += " active";

            return (
              <div key={item.day} className={itemClass}>
                <div className="timeline-marker" />
                <div className="timeline-content" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <button
                    onClick={() => toggleDay(item.day)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      marginTop: "2px",
                      color: isCompleted ? "var(--emerald)" : isActive ? "var(--cyan)" : "var(--text-muted)",
                      transition: "color 0.2s"
                    }}
                  >
                    {isCompleted ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: isCompleted ? "var(--text-secondary)" : "var(--text-primary)",
                        textDecoration: isCompleted ? "line-through" : "none",
                        marginBottom: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      Day {item.day}: {item.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "13px",
                        lineHeight: "1.5",
                        color: isCompleted ? "var(--text-muted)" : "var(--text-secondary)",
                        margin: 0
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
