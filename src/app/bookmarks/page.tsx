"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import DoubtCard from '@/components/DoubtCard';

export default function BookmarksPage() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch('/api/bookmarks')
      .then(res => res.json())
      .then(data => {
        if (data.bookmarks) setBookmarks(data.bookmarks);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  const toggleBookmark = async (id: string) => {
    await fetch(`/api/bookmarks/${id}`, {
      method: "DELETE"
    });
    setBookmarks((prev) =>
      prev.filter((b) => b.doubt.id !== id)
    );
  };

  if (!user) return (
    <div className="container py-20 flex items-center justify-center">
      <div className="glass-panel p-10 max-w-sm text-center border-white/10 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Your Bookmarks</h2>
        <p className="text-text-secondary mb-8 leading-relaxed">Please log in to see your saved doubts.</p>
        <Link href="/login" className="btn btn-primary w-full">Sign In</Link>
      </div>
    </div>
  );

  if (loading) return (
    <div className="container py-20 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-white/5 border-t-accent-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div
      className="animate-fade-in"
      style={{
        maxWidth: '900px',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingBottom: '80px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="text-4xl font-extrabold mb-4 text-white tracking-tight">Your Bookmarks</h1>
        <p className="text-text-secondary max-w-2xl mx-auto text-lg font-medium">
          Access all the doubts you've saved for later reference.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div
          className="glass-panel border-white/10"
          style={{
            borderRadius: '24px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', opacity: 0.6 }}>🔖</div>
          <h3 className="text-xl font-bold text-white" style={{ margin: 0 }}>No bookmarks yet</h3>
          <p className="text-text-secondary" style={{ margin: 0, maxWidth: '360px', lineHeight: 1.6 }}>
            Save interesting doubts to revisit them here.
          </p>
          <Link href="/" className="btn btn-secondary" style={{ marginTop: '16px' }}>
            Explore Doubts
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {bookmarks.map((b) => (
            <DoubtCard key={b.id} doubt={{ ...b.doubt, hasBookmarked: true }} onUnbookmark={toggleBookmark} />
          ))}
        </div>
      )}
    </div>
  );
}
