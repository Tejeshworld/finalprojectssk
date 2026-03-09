"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { HiOutlineScale, HiOutlineSparkles, HiOutlineShieldExclamation, HiOutlineLightBulb, HiOutlineChatBubbleLeftRight, HiOutlineNoSymbol, HiOutlineBookOpen, HiOutlineLockClosed, HiOutlineBolt, HiOutlineGlobeAlt, HiOutlineChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';

const GUIDELINES = [
  { icon: <HiOutlineChatBubbleLeftRight size={24} />, title: "Be Respectful", body: "Treat everyone with courtesy. No harassment, hate speech, or personal attacks." },
  { icon: <HiOutlineNoSymbol size={24} />, title: "No Spam", body: "Avoid repetitive messages, self-promotion or flooding the chat with irrelevant content." },
  { icon: <HiOutlineBookOpen size={24} />, title: "Academic Focus", body: "Keep discussions relevant — share knowledge, ask questions, and help fellow learners." },
  { icon: <HiOutlineLockClosed size={24} />, title: "Privacy Matters", body: "Never share personal information of yourself or others inside the lounge." },
  { icon: <HiOutlineBolt size={24} />, title: "Stay On Topic", body: "Each channel has a purpose. Respect it and contribute meaningfully to the conversation." },
  { icon: <HiOutlineGlobeAlt size={24} />, title: "Inclusive Space", body: "Welcome learners from all backgrounds. Diversity in perspective makes us all smarter." },
];

export default function ChatGatePage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleEnter = () => {
    try {
      localStorage.setItem("loungeAccepted", "true");
    } catch (_) { }
    router.push("/chat/lounge");
  };

  if (!user) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
        <div className="glass-panel" style={{ padding: "2.5rem", maxWidth: "380px", width: "100%", textAlign: "center" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "16px",
            background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2rem", margin: "0 auto 1.5rem",
          }}><HiOutlineChatBubbleOvalLeftEllipsis size={32} /></div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#fff", marginBottom: "0.75rem" }}>Community Lounge</h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "2rem", lineHeight: 1.6 }}>
            Please log in to participate in the real-time community chat.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ width: "100%", display: "block", textAlign: "center" }}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1.5rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: "absolute", top: "-20%", left: "-10%",
        width: "50%", height: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", bottom: "-15%", right: "-10%",
        width: "45%", height: "45%",
        background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
      }} />

      {/* Card */}
      <div className="glass-panel animate-fade-in" style={{
        width: "100%",
        maxWidth: "560px",
        padding: "2.75rem",
        position: "relative",
        zIndex: 10,
        border: "1px solid rgba(99,102,241,0.15)",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "20px",
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2rem", margin: "0 auto 1.25rem",
            boxShadow: "0 12px 32px rgba(99,102,241,0.3)",
          }}>
            <HiOutlineScale size={40} className="text-indigo-400" />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "0.5rem" }}>
            Welcome to the Global<br />Community Lounge
          </h1>
          <p style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
            Community Guidelines
          </p>
        </div>

        {/* Guidelines list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
          {GUIDELINES.map(g => (
            <div key={g.title} style={{
              display: "flex", alignItems: "flex-start", gap: "0.875rem",
              padding: "0.875rem 1rem",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px",
            }}>
              <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: "1px" }}>{g.icon}</span>
              <div>
                <p style={{ fontSize: "0.82rem", fontWeight: 800, color: "#fff", marginBottom: "2px" }}>{g.title}</p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5, fontWeight: 500 }}>{g.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleEnter}
          className="btn btn-primary"
          style={{
            width: "100%",
            padding: "0.9rem",
            fontSize: "0.875rem",
            fontWeight: 900,
            letterSpacing: "0.05em",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
          }}
        >
          Enter the Lounge →
        </button>

        <p style={{ textAlign: "center", fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", marginTop: "1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          By entering you agree to follow these guidelines
        </p>
      </div>
    </div>
  );
}
