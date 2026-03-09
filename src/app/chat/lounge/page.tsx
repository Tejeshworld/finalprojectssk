"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ChatLayout from "@/components/chat/ChatLayout";

export default function LoungePage() {
    const router = useRouter();
    const { user } = useAuth();

    // All hooks MUST be declared before any conditional returns
    const [allowed, setAllowed] = useState<boolean | null>(null);
    const [activeHubId, setActiveHubId] = useState<string | null>(null);
    const [hubs, setHubs] = useState<any[]>([]);

    // Check localStorage gate on mount
    useEffect(() => {
        try {
            const accepted = localStorage.getItem("loungeAccepted") === "true";
            if (!accepted) {
                router.replace("/chat");
            } else {
                setAllowed(true);
            }
        } catch (_) {
            setAllowed(true); // allow if localStorage unavailable
        }
    }, [router]);

    // Fetch hubs once allowed
    useEffect(() => {
        if (!allowed) return;
        fetch("/api/hubs")
            .then(r => r.json())
            .then(data => { if (data.hubs) setHubs(data.hubs); })
            .catch(console.error);
    }, [allowed]);

    // ── Render: checking localStorage ──
    if (allowed === null) {
        return (
            <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{
                    width: "40px", height: "40px",
                    border: "4px solid rgba(255,255,255,0.08)",
                    borderTop: "4px solid var(--accent-primary)",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                }} />
            </div>
        );
    }

    // ── Render: not logged in ──
    if (!user) {
        return (
            <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
                <div className="glass-panel" style={{ padding: "2.5rem", maxWidth: "380px", width: "100%", textAlign: "center" }}>
                    <div style={{
                        width: "64px", height: "64px", borderRadius: "16px",
                        background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "2rem", margin: "0 auto 1.5rem",
                    }}>💬</div>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#fff", marginBottom: "0.75rem" }}>
                        Community Lounge
                    </h2>
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

    // ── Render: full chat UI ──
    return (
        <div style={{ width: "100%", display: "flex", height: "calc(100vh - 64px)", overflow: "hidden", position: "relative" }}>

            {/* Mobile Sidebar Overlay */}
            {activeHubId === 'mobile-menu-open' && (
                <div
                    onClick={() => setActiveHubId(null)}
                    style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
                />
            )}

            {/* ── Left Sidebar (Responsive) ── */}
            <aside style={{
                height: "100%", width: "260px", flexShrink: 0,
                borderRight: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)",
                display: "flex", flexDirection: "column",
                position: typeof window !== 'undefined' && window.innerWidth <= 768 ? "absolute" : "relative",
                left: typeof window !== 'undefined' && window.innerWidth <= 768 ? (activeHubId === 'mobile-menu-open' ? 0 : "-100%") : 0,
                transition: "left 0.3s ease",
                zIndex: 50,
            }}>
                {/* Navigation */}
                <div style={{ padding: "1.25rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontSize: "9px", fontWeight: 900, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.3em", marginBottom: "0.875rem" }}>
                            Navigation
                        </p>
                        <button
                            onClick={() => { setActiveHubId(null); }}
                            style={{
                                width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
                                padding: "0.6rem 0.75rem", borderRadius: "12px",
                                fontSize: "0.875rem", fontWeight: 700, transition: "all 0.2s",
                                background: !activeHubId ? "var(--accent-primary)" : "transparent",
                                color: !activeHubId ? "#fff" : "rgba(255,255,255,0.4)",
                                boxShadow: !activeHubId ? "0 4px 14px rgba(99,102,241,0.25)" : "none",
                                cursor: "pointer", border: "none",
                            }}
                        >
                            <span style={{ fontSize: "1rem" }}>🌐</span>
                            <span>General Lounge</span>
                        </button>
                    </div>
                    {typeof window !== 'undefined' && window.innerWidth <= 768 && (
                        <button onClick={() => setActiveHubId(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                    )}
                </div>

                {/* Hub list */}
                <div className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
                    {hubs.length > 0 && (
                        <p style={{ fontSize: "9px", fontWeight: 900, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.3em", marginBottom: "0.75rem" }}>
                            Active Hubs
                        </p>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        {hubs.map(hub => (
                            <button
                                key={hub.id}
                                onClick={() => setActiveHubId(hub.id)}
                                title={hub.name}
                                style={{
                                    width: "100%", display: "flex", alignItems: "center", gap: "0.625rem",
                                    padding: "0.6rem 0.75rem", borderRadius: "10px",
                                    fontSize: "0.875rem", fontWeight: 700, transition: "all 0.15s",
                                    background: activeHubId === hub.id ? "var(--accent-primary)" : "transparent",
                                    color: activeHubId === hub.id ? "#fff" : "rgba(255,255,255,0.4)",
                                    cursor: "pointer", border: "none",
                                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                }}
                            >
                                <span style={{ opacity: 0.4, fontFamily: "monospace", flexShrink: 0 }}>#</span>
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{hub.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* User card */}
                <div style={{ padding: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{
                        display: "flex", alignItems: "center", gap: "0.75rem",
                        padding: "0.75rem", borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.06)",
                        background: "rgba(255,255,255,0.02)",
                    }}>
                        <div style={{
                            width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                            background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 900, color: "var(--accent-primary)", fontSize: "0.875rem",
                        }}>
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: "12px", fontWeight: 800, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {user.username}
                            </p>
                            <p style={{ fontSize: "8px", fontWeight: 900, color: "var(--accent-success)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: "2px" }}>
                                Online
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Main Chat ── */}
            <main style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{
                    width: "100%", maxWidth: "900px", margin: "0 auto", height: "100%",
                    display: "flex", flexDirection: "column",
                    background: "rgba(0,0,0,0.25)", backdropFilter: "blur(8px)",
                    borderLeft: "1px solid rgba(255,255,255,0.04)",
                    borderRight: "1px solid rgba(255,255,255,0.04)",
                }}>
                    <div style={{ padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: typeof window !== 'undefined' && window.innerWidth <= 768 ? 'block' : 'none' }}>
                        <button onClick={() => setActiveHubId(activeHubId === 'mobile-menu-open' ? null : 'mobile-menu-open')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            ☰ <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Channels</span>
                        </button>
                    </div>
                    <ChatLayout hubId={(activeHubId && activeHubId !== 'mobile-menu-open') ? activeHubId : undefined} />
                </div>
            </main>
        </div>
    );
}
