"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ActivityGraph from '@/components/ActivityGraph';
import SidebarLeft from '@/components/layout/SidebarLeft';
import SidebarRight from '@/components/layout/SidebarRight';
import DoubtFeed from '@/components/layout/DoubtFeed';

export default function Home() {
  const { user } = useAuth();

  const [doubts, setDoubts] = useState<any[]>([]);
  const [trendingDoubts, setTrendingDoubts] = useState<any[]>([]);
  const [hubs, setHubs] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [platformStats, setPlatformStats] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recentChat, setRecentChat] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const quotes = [
    "The best way to learn something is to teach it to someone else.",
    "Logic is the beginning of wisdom, not the end.",
    "The only true wisdom is in knowing you know nothing.",
    "Programming isn't about what you know; it's about what you can figure out.",
    "Education is not the learning of facts, but the training of the mind to think.",
  ];
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const [hubsRes, doubtsRes, trendingRes, statsRes, leaderboardRes, chatRes] = await Promise.all([
          fetch('/api/hubs'),
          fetch('/api/doubts'),
          fetch('/api/doubts?trending=true'),
          fetch('/api/stats'),
          fetch('/api/leaderboard'),
          fetch('/api/chat'),
        ]);

        const [hubsData, doubtsData, trendingData, statsData, leaderboardData, chatData] = await Promise.all([
          hubsRes.json(), doubtsRes.json(), trendingRes.json(),
          statsRes.json(), leaderboardRes.json(), chatRes.json(),
        ]);

        setHubs(hubsData.hubs || []);
        setDoubts(doubtsData.doubts || []);
        setTrendingDoubts((trendingData.doubts || []).slice(0, 5));
        setPlatformStats(statsData.stats || null);
        setLeaderboard((leaderboardData.leaderboard || []).slice(0, 3));
        setRecentChat((chatData.messages || []).slice(-10));
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalData();
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`/api/users/${user.id}`, { cache: "no-store" })
        .then(res => res.json())
        .then(data => { if (data.user) setUserProfile(data.user); });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="home-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="w-10 h-10 border-4 border-white/5 border-t-accent-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="home-container animate-fade-in">

      {/* ── Welcome Banner ── */}
      <section className="welcome-card shadow-glow">
        <div style={{ position: 'relative', zIndex: 10, flex: 1 }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'white', marginBottom: '0.75rem' }}>
            Welcome back,{' '}
            <span style={{ color: 'var(--accent-primary)' }}>{user?.username || 'Learner'}</span> 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '480px', marginBottom: '1.75rem', fontWeight: 500 }}>
            Ready to solve some doubts today? Your contributions are making the community smarter.
          </p>
          <div className="flex gap-4">
            <Link href="/ask" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontWeight: 700 }}>Ask a Doubt</Link>
            <Link href="/chat" className="btn btn-secondary" style={{ padding: '0.875rem 2rem', fontWeight: 700 }}>Chat Lounge</Link>
          </div>
        </div>

        <div className="stat-grid" style={{ zIndex: 10, width: '100%', maxWidth: '480px' }}>
          {[
            { label: 'Doubts Asked', val: userProfile?._count?.doubts || 0, icon: '❓' },
            { label: 'Answers Given', val: userProfile?._count?.answers || 0, icon: '💡' },
            { label: 'Reputation', val: userProfile?.reputation || 0, icon: '⭐' },
            { label: 'Bookmarks', val: userProfile?._count?.bookmarks || 0, icon: '🔖' },
          ].map(stat => (
            <div key={stat.label} className="stat-card">
              <span style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>{stat.icon}</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white' }}>{stat.val}</span>
              <span style={{ fontSize: '9px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main 3-Column Grid ── */}
      <div className="home-grid">

        {/* LEFT — col-span-3 (hidden on tablet/mobile) */}
        <div className="home-grid__left">
          <SidebarLeft hubs={hubs} platformStats={platformStats} quote={quote} />
        </div>

        {/* CENTER — col-span-6 */}
        <div className="home-grid__center">
          <DoubtFeed doubts={doubts} />
        </div>

        {/* RIGHT — col-span-3 */}
        <div className="home-grid__right">
          <SidebarRight trendingDoubts={trendingDoubts} leaderboard={leaderboard} recentChat={recentChat} />
        </div>

      </div>

      {userProfile && (userProfile.doubts?.length > 0 || userProfile.answers?.length > 0) && (
        <section style={{ marginTop: '3rem' }}>
          <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'white' }}>Your Learning Journey</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, marginTop: '4px' }}>
                  Community impact over the last 120 days
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>
                  {userProfile?._count?.answers || 0}
                </p>
                <p style={{ fontSize: '9px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Total Answers
                </p>
              </div>
            </div>
            <ActivityGraph doubts={userProfile.doubts} answers={userProfile.answers} />
          </div>
        </section>
      )}

    </div>
  );
}
