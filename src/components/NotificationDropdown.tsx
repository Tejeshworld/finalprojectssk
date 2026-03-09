"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

import { HiOutlineLightBulb, HiOutlineHandThumbUp, HiOutlineShare, HiOutlineTrophy, HiOutlineChatBubbleLeftEllipsis, HiOutlineMegaphone, HiOutlineBell } from 'react-icons/hi2';

const typeIconMap: Record<string, React.ReactNode> = {
  answer: <HiOutlineLightBulb size={16} className="text-yellow-400" />,
  reaction: <HiOutlineHandThumbUp size={16} className="text-blue-400" />,
  share: <HiOutlineShare size={16} className="text-green-400" />,
  best_answer: <HiOutlineTrophy size={16} className="text-amber-400" />,
  mention: <HiOutlineChatBubbleLeftEllipsis size={16} className="text-purple-400" />,
  system: <HiOutlineMegaphone size={16} className="text-indigo-400" />,
};

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.notifications) setNotifications(data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', { method: 'POST' });
      if (res.ok) setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const removeNotification = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <>
      {/* Inline keyframes for dropdown animation */}
      <style>{`
        @keyframes notif-drop-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .notif-dropdown-panel {
          animation: notif-drop-in 0.2s ease forwards;
        }
        .notif-item:hover { background: rgba(255,255,255,0.04); }
        .notif-footer-link:hover { color: var(--accent-primary); }
        .notif-bell:hover { background: rgba(255,255,255,0.08); }
      `}</style>

      <div className="relative inline-block" ref={dropdownRef}>
        {/* Bell Button */}
        <button
          onClick={() => setIsOpen(prev => !prev)}
          aria-label="Notifications"
          className="notif-bell"
          style={{
            position: 'relative',
            padding: '8px',
            borderRadius: '10px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HiOutlineBell size={22} className="text-gray-300" />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              minWidth: '16px',
              height: '16px',
              padding: '0 4px',
              borderRadius: '999px',
              background: 'var(--accent-primary)',
              color: '#fff',
              fontSize: '9px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #0f1115',
              lineHeight: 1,
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div
            className="notif-dropdown-panel"
            style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',
              right: 0,
              width: '320px',
              background: 'linear-gradient(160deg, rgba(26,27,38,0.98) 0%, rgba(18,19,28,0.98) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.04)',
              zIndex: 200,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 16px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HiOutlineBell size={18} className="text-gray-300" />
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 }}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span style={{
                    background: 'rgba(99,102,241,0.15)',
                    color: 'var(--accent-primary)',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '999px',
                    border: '1px solid rgba(99,102,241,0.25)',
                  }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'var(--accent-primary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    opacity: 0.85,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.85')}
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Body */}
            <div
              className="custom-scrollbar"
              style={{ maxHeight: '320px', overflowY: 'auto' }}
            >
              {notifications.length === 0 ? (
                <div style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <HiOutlineBell size={40} className="text-gray-500 opacity-50" />
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, margin: 0 }}>
                    No notifications yet
                  </p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
                    We'll let you know when something happens
                  </p>
                </div>
              ) : (
                notifications.map(n => (
                  <Link
                    key={n.id}
                    href={n.link || '#'}
                    className="notif-item"
                    onClick={() => {
                      if (!n.isRead) markAsRead(n.id);
                      setIsOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px 16px',
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    <button
                      onClick={(e) => removeNotification(n.id, e)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-gray-700 transition"
                      title="Remove notification"
                    >
                      ✕
                    </button>
                    {/* Unread dot */}
                    {!n.isRead && (
                      <span style={{
                        position: 'absolute',
                        left: '6px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: 'var(--accent-primary)',
                        flexShrink: 0,
                      }} />
                    )}
                    {/* Icon */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      flexShrink: 0,
                      marginLeft: '4px',
                    }}>
                      {typeIconMap[n.type] || <HiOutlineMegaphone size={16} />}
                    </div>
                    {/* Content */}
                    <div style={{ minWidth: 0, flex: 1, paddingRight: '1.5rem' }}>
                      <p style={{
                        fontSize: '12px',
                        fontWeight: n.isRead ? 400 : 600,
                        color: n.isRead ? 'var(--text-secondary)' : '#fff',
                        margin: 0,
                        lineHeight: 1.5,
                      }}>
                        {n.message}
                      </p>
                      <p style={{
                        fontSize: '10px',
                        color: 'var(--text-muted)',
                        margin: '4px 0 0',
                        fontWeight: 500,
                      }}>
                        {new Date(n.createdAt).toLocaleDateString()} · {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <Link
                href="/notifications"
                className="notif-footer-link"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px 16px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  transition: 'color 0.15s ease',
                }}
              >
                See all notifications →
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
