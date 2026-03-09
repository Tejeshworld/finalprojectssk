"use client";

import Link from 'next/link';

interface TrendingDoubt {
    id: string;
    title: string;
    _count: { answers: number };
    views: number;
}

interface LeaderboardUser {
    id: string;
    username: string;
    reputation: number;
}

interface ChatMessage {
    id: string;
    content: string;
    author: { username: string };
}

interface SidebarRightProps {
    trendingDoubts: TrendingDoubt[];
    leaderboard: LeaderboardUser[];
    recentChat: ChatMessage[];
}

import { HiOutlineFire, HiOutlineTrophy, HiOutlineChatBubbleLeftEllipsis } from 'react-icons/hi2';

export default function SidebarRight({ trendingDoubts, leaderboard, recentChat }: SidebarRightProps) {
    return (
        <aside className="sticky top-24 flex flex-col min-w-0" style={{ gap: '24px' }}>

            {/* Trending Now */}
            <div className="glass-panel" style={{ padding: '24px' }}>
                <p className="sidebar-label" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}><HiOutlineFire size={16} className="text-orange-500" /> Trending Now</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {trendingDoubts.length === 0 ? (
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Nothing trending yet.</p>
                    ) : (
                        trendingDoubts.map((td, idx) => (
                            <Link key={td.id} href={`/doubt/${td.id}`} className="trending-item">
                                <span className="trending-rank">0{idx + 1}</span>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <h4
                                        style={{
                                            fontSize: '13px', fontWeight: 700, color: '#fff',
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '3px'
                                        }}
                                    >
                                        {td.title}
                                    </h4>
                                    <p style={{ fontSize: '9px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        {td._count.answers} Answers · {td.views} Views
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Top Contributors */}
            <div className="glass-panel" style={{ padding: '24px' }}>
                <p className="sidebar-label" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}><HiOutlineTrophy size={16} className="text-amber-500" /> Top Contributors</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {leaderboard.map((u, idx) => (
                        <Link
                            key={u.id}
                            href={`/profile/${u.id}`}
                            className="flex items-center group"
                            style={{ transition: 'transform 0.2s', gap: '12px', paddingTop: '8px', paddingBottom: '8px' }}
                        >
                            <div
                                style={{
                                    width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '12px', fontWeight: 900,
                                    background: idx === 0 ? 'var(--accent-warning)' : 'rgba(255,255,255,0.05)',
                                    color: idx === 0 ? '#000' : 'var(--text-muted)',
                                }}
                            >
                                {idx + 1}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {u.username}
                                </p>
                                <p style={{ fontSize: '9px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {u.reputation} pts
                                </p>
                            </div>
                        </Link>
                    ))}
                    <Link
                        href="/leaderboard"
                        className="btn btn-secondary w-full"
                        style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', padding: '0.6rem', marginTop: '1rem', textAlign: 'center' }}
                    >
                        Full Leaderboard
                    </Link>
                </div>
            </div>

            {/* Live Chat Lounge */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <HiOutlineChatBubbleLeftEllipsis size={18} className="text-indigo-400" />
                        <h3 style={{ fontSize: '10px', fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            Live Chat Lounge
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span style={{ fontSize: '9px', fontWeight: 900, color: 'var(--accent-success)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Active
                        </span>
                        <div
                            className="pulse-success"
                            style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-success)' }}
                        />
                    </div>
                </div>

                {/* Messages */}
                <div
                    className="custom-scrollbar"
                    style={{
                        height: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px',
                        background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', padding: '0.85rem',
                    }}
                >
                    {recentChat.length === 0 ? (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Lounge is quiet
                            </p>
                        </div>
                    ) : (
                        recentChat.map(msg => (
                            <div key={msg.id} style={{ display: 'flex', gap: '6px', fontSize: '12px', lineHeight: '1.4', flexWrap: 'wrap', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 800, color: 'var(--accent-primary)', flexShrink: 0 }}>
                                    {msg.author.username}:
                                </span>
                                <span style={{ color: 'var(--text-secondary)', wordBreak: 'break-word' }}>
                                    {msg.content}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Join Button */}
                <Link
                    href="/chat"
                    className="btn btn-secondary w-full"
                    style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', padding: '0.75rem', textAlign: 'center' }}
                >
                    Join Chat Lounge
                </Link>
            </div>

        </aside>
    );
}
