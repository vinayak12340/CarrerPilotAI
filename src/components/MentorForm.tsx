"use client";

import React, { useState } from "react";
import { Briefcase, FileText, Code, Sparkles, BookOpen, UploadCloud, X } from "lucide-react";

interface MentorFormProps {
  onSubmit: (data: {
    resumeText: string;
    targetRole: string;
    skills: string;
    resumeFile?: { data: string; mimeType: string };
  }) => void;
  loading: boolean;
}

const PRESETS = [
  {
    label: "Frontend Engineer (Fresher)",
    role: "Frontend Engineer",
    skills: "HTML, CSS, JavaScript, React, Git, Responsive Web Design",
    resume: `VINAY SHARMA
vinay.sharma@email.com | +91 98765 43210 | Bangalore, India

EDUCATION
B.Tech in Computer Science, State University, 2025 (CGPA: 8.2)

PROJECTS
1. E-Commerce Product Catalog
- Built using React.js and CSS Grid, implementing client-side filtering and sorting.
- Configured local storage to persist shopping cart items, reducing load times.
2. Personal Portfolio Site
- Built responsive portfolio using HTML5, Vanilla CSS, and JavaScript.
- Deployed on GitHub Pages.

EXPERIENCE
Frontend Intern, Tech Solutions (2 months)
- Developed layout components and fixed UI alignments in main web application.
- Styled modern admin dashboards under supervision of senior frontend engineer.`
  },
  {
    label: "Software Developer (SDE)",
    role: "Software Development Engineer (SDE)",
    skills: "Java, Python, SQL, Git, Basic Algorithms",
    resume: `VINAY SHARMA
vinay.sharma@email.com | +91 98765 43210 | Bangalore, India

EDUCATION
B.Tech in Computer Science, State University, 2025 (CGPA: 8.5)

PROJECTS
1. Task Management REST API
- Built server-side REST APIs using Node.js, Express, and MongoDB.
- Implemented user registration, login, JWT token auth, and CRUD operations for tasks.
2. Library Management System
- Desktop application in Python using Tkinter and SQLite.

SKILLS & INTERESTS
- Knowledge of Data Structures (Arrays, Linked Lists, Stacks, Queues).
- Good understanding of Object-Oriented Programming (OOP) in Java.`
  }
];

export default function MentorForm({ onSubmit, loading }: MentorFormProps) {
  const [targetRole, setTargetRole] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeText, setResumeText] = useState("");
  
  // PDF file state
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setTargetRole(preset.role);
    setSkills(preset.skills);
    setResumeText(preset.resume);
    setFile(null);
    setFileBase64(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        alert("Please upload a PDF file only.");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File is too large. Maximum size allowed is 5MB.");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        setFileBase64(base64);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setFileBase64(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole.trim() || !skills.trim()) return;
    if (!fileBase64 && !resumeText.trim()) {
      alert("Please upload a PDF resume or paste your resume text details.");
      return;
    }
    
    onSubmit({
      resumeText: fileBase64 ? `[PDF Resume: ${file?.name}]` : resumeText,
      targetRole,
      skills,
      resumeFile: fileBase64 ? { data: fileBase64, mimeType: "application/pdf" } : undefined
    });
  };

  return (
    <div className="glass-card fade-in glow-indigo" style={{ maxWidth: "680px", margin: "0 auto 40px auto" }}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div
          style={{
            display: "inline-flex",
            padding: "10px",
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.1)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            marginBottom: "12px"
          }}
        >
          <Sparkles size={28} color="var(--primary)" />
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px" }}>
          Ready for Placements?
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: "480px", margin: "0 auto" }}>
          Provide your target role, skills, and resume details. CareerPilot AI will parse your profile, highlight skill gaps, compile a 7-day roadmap, and practice mock interviews.
        </p>
      </div>

      {/* Preset Quick Actions */}
      <div style={{ marginBottom: "24px" }}>
        <span className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
          <BookOpen size={14} /> Quick Setup Templates:
        </span>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "8px" }}>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-secondary"
              onClick={() => applyPreset(preset)}
              style={{
                fontSize: "12px",
                padding: "8px 12px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.02)"
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Briefcase size={16} color="var(--cyan)" /> Target Placement Role
          </label>
          <input
            type="text"
            className="form-input"
            required
            placeholder="e.g. Frontend Engineer, SDE, Data Analyst..."
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Code size={16} color="var(--cyan)" /> Current Technical Skills
          </label>
          <input
            type="text"
            className="form-input"
            required
            placeholder="e.g. React, Node.js, SQL, Java (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        {/* PDF File Upload Zone */}
        <div className="form-group">
          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <UploadCloud size={16} color="var(--cyan)" /> Upload PDF Resume
          </label>
          {!file ? (
            <div
              onClick={() => document.getElementById("pdf-input")?.click()}
              style={{
                border: "2px dashed var(--border-color)",
                borderRadius: "8px",
                padding: "20px 16px",
                textAlign: "center",
                background: "var(--bg-input)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <input
                id="pdf-input"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <UploadCloud size={24} color="var(--text-secondary)" style={{ marginBottom: "6px" }} />
              <p style={{ fontSize: "13px", fontWeight: 600, margin: 0 }}>Click to upload PDF resume</p>
              <p style={{ fontSize: "10px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>Max size 5MB • PDF format only</p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: "rgba(16, 185, 129, 0.04)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: "8px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FileText size={18} color="var(--emerald)" />
                <div style={{ overflow: "hidden", maxWidth: "400px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, margin: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{file.name}</p>
                  <p style={{ fontSize: "10px", color: "var(--text-secondary)", margin: 0 }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClearFile}
                style={{ padding: "4px 8px", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}
              >
                <X size={12} /> Remove
              </button>
            </div>
          )}
        </div>

        {/* Divider if no PDF uploaded */}
        {!file && (
          <div style={{ textAlign: "center", margin: "14px 0", color: "var(--text-muted)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
            — OR PASTE TEXT RESUME —
          </div>
        )}

        {/* Resume Text (Optional if PDF is uploaded) */}
        {!file && (
          <div className="form-group fade-in">
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FileText size={16} color="var(--cyan)" /> Resume Details (Paste Text)
            </label>
            <textarea
              className="form-textarea"
              required={!fileBase64}
              placeholder="Paste your education, projects, experience, and contact details from your resume..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              style={{ minHeight: "150px" }}
            />
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !targetRole || !skills || (!fileBase64 && !resumeText)}
          style={{ width: "100%", marginTop: "16px", height: "48px" }}
        >
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="animate-spin" style={{
                width: "18px",
                height: "18px",
                border: "2px solid #fff",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }} />
              <span>Analyzing Profile & Resume...</span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={18} />
              <span>Generate Placement Guidance Plan</span>
            </div>
          )}
        </button>
      </form>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
