"use client";

import Link from 'next/link';

interface Hub {
  id: string;
  name: string;
}

interface PlatformStats {
  totalUsers?: number;
  totalDoubts?: number;
  totalAnswers?: number;
  totalSolved?: number;
}

interface SidebarLeftProps {
  hubs: Hub[];
  platformStats: PlatformStats | null;
  quote: string;
}

import { HiOutlineSparkles, HiOutlineRectangleGroup, HiOutlineRocketLaunch, HiOutlineBookmark, HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';

export default function SidebarLeft({ hubs, platformStats, quote }: SidebarLeftProps) {
  return (
    <aside className="sticky top-24 flex flex-col min-w-0" style={{ gap: '24px' }}>

      {/* Quick Actions */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <p className="sidebar-label" style={{ marginBottom: '16px' }}>Quick Actions</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { label: 'Ask a Doubt', link: '/ask', icon: <HiOutlineSparkles size={18} /> },
            { label: 'Explore Hubs', link: '/hubs', icon: <HiOutlineRectangleGroup size={18} /> },
            { label: 'Start a Community', link: '/hubs/create', icon: <HiOutlineRocketLaunch size={18} /> },
            { label: 'Bookmarks', link: '/bookmarks', icon: <HiOutlineBookmark size={18} /> },
            { label: 'Chat Lounge', link: '/chat', icon: <HiOutlineChatBubbleLeftRight size={18} /> },
          ].map(action => (
            <Link key={action.label} href={action.link} className="quick-action-link group" style={{ paddingTop: '10px', paddingBottom: '10px', gap: '12px' }}>
              <div className="icon-box" style={{ padding: '6px', fontSize: 'inherit' }}>{action.icon}</div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended Hubs */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <p className="sidebar-label" style={{ marginBottom: '16px' }}>Recommended Hubs</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
          {hubs.slice(0, 8).map(hub => (
            <Link
              key={hub.id}
              href={`/hub/${hub.id}`}
              className="badge badge-primary hover:scale-105 transition-transform"
              style={{ padding: '0.4rem 0.85rem', fontSize: '12px' }}
            >
              {hub.name}
            </Link>
          ))}
          {hubs.length === 0 && (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No hubs yet.</p>
          )}
        </div>
      </div>

      {/* Network Growth */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <p className="sidebar-label" style={{ marginBottom: '16px' }}>Network Growth</p>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
          {[
            { label: 'Learners', val: platformStats?.totalUsers ?? 0, color: 'var(--accent-primary)' },
            { label: 'Doubts', val: platformStats?.totalDoubts ?? 0, color: '#fff' },
            { label: 'Answers', val: platformStats?.totalAnswers ?? 0, color: '#fff' },
            { label: 'Solved', val: platformStats?.totalSolved ?? 0, color: 'var(--accent-success)' },
          ].map(stat => (
            <div key={stat.label}>
              <p style={{ fontSize: '20px', fontWeight: 900, color: stat.color, lineHeight: 1 }}>
                {stat.val}
              </p>
              <p style={{ fontSize: '9px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tip of the Day */}
      <div
        style={{
          padding: '24px',
          background: 'linear-gradient(to bottom right, rgba(99,102,241,0.12), transparent)',
          border: '1px solid rgba(99,102,241,0.15)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>
          Tip of the Day
        </p>
        <p style={{ fontSize: '13px', fontStyle: 'italic', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6' }}>
          "{quote}"
        </p>
      </div>

    </aside>
  );
}
