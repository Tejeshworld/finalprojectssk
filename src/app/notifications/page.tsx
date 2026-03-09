"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        if (data.notifications) setNotifications(data.notifications);
        setLoading(false);
      });

    // Mark as read when unmounting
    return () => {
      fetch('/api/notifications', { method: 'POST' }).catch(() => { });
    };
  }, [user]);

  const removeNotification = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await fetch(`/api/notifications/${id}`, {
      method: "DELETE"
    });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!user) return <div style={{ textAlign: 'center', padding: '4rem' }}>Please log in to view notifications.</div>;
  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading notifications...</div>;

  return (
    <div className="container animate-fade-in py-10">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Notifications</h1>
      </div>

      <div className="glass-panel" style={{ padding: '1rem' }}>
        {notifications.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>You're all caught up!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {notifications.map((n) => (
              <Link key={n.id} href={n.link || '#'} style={{ display: 'block' }}>
                <div className="relative" style={{ padding: '1.25rem', background: n.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.05)', borderLeft: n.isRead ? '3px solid transparent' : '3px solid var(--accent-primary)', borderRadius: 'var(--radius-sm)', transition: 'background 0.2s', ...{ ':hover': { background: 'rgba(255,255,255,0.03)' } } as any }}>
                  <button
                    onClick={(e) => removeNotification(n.id, e)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-gray-700 transition"
                  >
                    ✕
                  </button>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingRight: '1rem' }}>
                    <p style={{ fontSize: '1rem', color: n.isRead ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: n.isRead ? 400 : 500 }}>
                      {n.message}
                    </p>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
