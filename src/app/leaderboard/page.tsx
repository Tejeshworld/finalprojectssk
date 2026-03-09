"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) setLeaderboard(data.leaderboard);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/5 border-t-accent-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in py-12">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-4xl font-extrabold mb-3 text-white tracking-tight">
          Community Leaderboard
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
          Celebrating our most helpful students and expert contributors.
        </p>
      </div>

      <div
        className="mt-14 glass-panel border-white/10 shadow-3xl p-10"
        style={{ borderRadius: "24px" }}
      >
        {/* Header */}
        <div
          className="bg-white/[0.02] border-b border-white/5 grid grid-cols-[120px_1fr_150px_150px_150px] px-6 py-8 items-center"
          style={{
            color: "var(--text-muted)",
            fontSize: "0.75rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
          }}
        >
          <div className="flex items-center justify-center tracking-wider">
            Rank
          </div>

          <div className="flex items-center gap-4 tracking-wider">
            Contributor
          </div>

          <div className="flex items-center justify-center tracking-wider">
            Reputation
          </div>

          <div className="flex items-center justify-center tracking-wider">
            Answers
          </div>

          <div className="flex items-center justify-center tracking-wider">
            Doubts
          </div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-6 mt-6">
          {leaderboard.length === 0 ? (
            <div className="p-20 text-center text-text-muted font-bold uppercase tracking-widest text-xs">
              No contributors found yet.
            </div>
          ) : (
            leaderboard.map((user, index) => (
              <div
                key={user.id}
                className="hover:bg-white/[0.01] transition-colors grid grid-cols-[120px_1fr_150px_150px_150px] items-center px-6 py-8 border-b border-white/5"
              >
                {/* Rank */}
                <div
                  className={`text-xl flex items-center justify-center font-black ${index < 3 ? "text-accent-primary" : "text-white/20"
                    }`}
                >
                  {index === 0
                    ? "🥇"
                    : index === 1
                      ? "🥈"
                      : index === 2
                        ? "🥉"
                        : `#${index + 1}`}
                </div>

                {/* Contributor */}
                <div className="flex items-center gap-5">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-lg shadow-inner flex-shrink-0 ${index < 3
                      ? "bg-accent-primary/10 border-accent-primary/20 text-accent-primary"
                      : "bg-white/5 border-white/5 text-white"
                      }`}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex flex-col">
                    <Link
                      href={`/profile/${user.id}`}
                      className="font-semibold text-white hover:text-accent-primary transition-colors flex items-center"
                    >
                      {user.username}

                      {index === 0 && (
                        <span className="ml-2 text-[10px] bg-accent-warning/20 text-accent-warning px-2 py-0.5 rounded-md mx-5">
                          King of Hub
                        </span>
                      )}
                    </Link>

                    <span className="text-sm text-gray-400 mt-1 uppercase tracking-widest font-bold text-[10px]">
                      {user.badges?.[0]?.name || "Apprentice"}
                    </span>
                  </div>
                </div>

                {/* Reputation */}
                <div className="text-2xl font-black text-white flex items-center justify-center tabular-nums">
                  {user.reputation}
                </div>

                {/* Answers */}
                <div className="flex items-center justify-center text-sm font-bold text-text-secondary">
                  {user._count?.answers || 0}
                </div>

                {/* Doubts */}
                <div className="flex items-center justify-center text-sm font-bold text-text-secondary">
                  {user._count?.doubts || 0}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}