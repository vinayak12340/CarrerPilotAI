"use client";

import React, { useState, useEffect } from "react";
import { Compass, Key, Settings, HelpCircle, AlertCircle } from "lucide-react";

interface NavbarProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onReset: () => void;
  hasSession: boolean;
}

export default function Navbar({ apiKey, setApiKey, onReset, hasSession }: NavbarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTempKey(apiKey);
  }, [apiKey]);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(tempKey);
    setShowSettings(false);
  };

  return (
    <header
      className="glass-card"
      style={{
        borderRadius: "0 0 16px 16px",
        padding: "16px 24px",
        marginBottom: "24px",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Logo and Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }} onClick={onReset} className="cursor-pointer">
          <div
            style={{
              background: "var(--primary-glow)",
              border: "1px solid var(--primary)",
              borderRadius: "10px",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Compass size={24} color="var(--cyan)" style={{ filter: "drop-shadow(0 0 4px var(--cyan))" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 800, margin: 0 }}>
              CareerPilot <span style={{ color: "var(--cyan)" }}>AI</span>
            </h1>
            <p style={{ fontSize: "11px", color: "var(--text-secondary)", margin: 0, fontWeight: 500 }}>
              PLACEMENT READY IN 7 DAYS
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {hasSession && (
            <button className="btn btn-secondary" onClick={onReset} style={{ padding: "8px 16px", fontSize: "13px" }}>
              Reset Session
            </button>
          )}

          <button
            className="btn btn-secondary"
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderColor: showSettings ? "var(--cyan)" : "var(--border-color)",
            }}
            title="Configure Gemini API Key"
          >
            <Settings size={18} color={showSettings ? "var(--cyan)" : "var(--text-primary)"} />
          </button>
        </div>
      </div>

      {/* API Key Modal/Dropdown */}
      {showSettings && (
        <div
          className="fade-in"
          style={{
            marginTop: "16px",
            padding: "16px",
            background: "rgba(11, 15, 28, 0.95)",
            border: "1px solid var(--border-color)",
            borderRadius: "10px",
            animation: "fadeIn 0.2s ease-out forwards",
          }}
        >
          <form onSubmit={handleSaveKey}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Key size={16} color="var(--cyan)" />
                <h3 style={{ fontSize: "14px", fontWeight: 600 }}>Gemini API Settings</h3>
              </div>
              <span
                className={`badge ${!apiKey || apiKey === "demo" ? "badge-amber" : "badge-emerald"}`}
                style={{ fontSize: "10px" }}
              >
                {!apiKey || apiKey === "demo" ? "Demo Mode" : "AI Connected"}
              </span>
            </div>

            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px", lineHeight: "1.4" }}>
              Enter your Gemini API key below to get personalized AI placement coaching. Leave blank to run in <strong>Demo Mode</strong> with mock placement data.
            </p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                type="password"
                className="form-input"
                placeholder="AIzaSy..."
                value={tempKey === "demo" ? "" : tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                style={{ flex: 1, minWidth: "200px", fontSize: "14px", padding: "8px 12px" }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="submit" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setTempKey("demo");
                    setApiKey("demo");
                    setShowSettings(false);
                  }}
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  Use Demo Mode
                </button>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px" }}>
              <AlertCircle size={12} color="var(--text-muted)" />
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                Your API key is only stored in your browser's local storage and sent straight to the Next.js API route.
              </span>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
