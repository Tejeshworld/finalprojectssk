"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import DoubtCard from '@/components/DoubtCard';

export default function HubsPage() {
  const { id } = useParams() as { id: string };
  const { user } = useAuth();
  const [doubts, setDoubts] = useState<any[]>([]);
  const [hub, setHub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  const fetchHubData = () => {
    fetch('/api/hubs')
      .then(res => res.json())
      .then(data => {
        const found = data.hubs?.find((h: any) => h.id === id);
        if (found) {
          setHub(found);
          setIsFollowing(found.isFollowing);
          setFollowerCount(found._count?.followers || 0);
        }
      });
  };

  useEffect(() => {
    fetchHubData();

    // Fetch doubts for this hub
    fetch(`/api/doubts?hubId=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.doubts) setDoubts(data.doubts);
        setLoading(false);
      });
  }, [id]);

  const handleFollow = async () => {
    if (!user) return alert('Please log in to follow hubs.');

    // Optimistic Update
    setIsFollowing(!isFollowing);
    setFollowerCount(prev => prev + (isFollowing ? -1 : 1));

    const res = await fetch('/api/hubs/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hubId: id })
    });
    if (!res.ok) {
      // Revert if failed
      setIsFollowing(isFollowing);
      setFollowerCount(prev => prev + (isFollowing ? 1 : -1));
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading hub...</div>;
  if (!hub) return <div style={{ textAlign: 'center', padding: '4rem' }}>Hub not found</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <div className="glass-panel flex flex-col md:flex-row items-center md:justify-between gap-6" style={{ padding: '2rem', marginBottom: '2rem', background: `linear-gradient(to right, ${hub.color}20, transparent)` }}>
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6">
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: hub.color, boxShadow: `0 0 20px ${hub.color}40`, flexShrink: 0 }}></div>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: hub.color }}>{hub.name}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{hub.description}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{followerCount} Followers</p>
          </div>
        </div>

        <button
          onClick={handleFollow}
          className={`${isFollowing ? "btn-secondary" : "btn-primary"} btn w-full md:w-auto`}
          style={{ padding: '0.5rem 1.5rem' }}
        >
          {isFollowing ? 'Following' : 'Follow Hub'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {doubts.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No doubts found in this hub.</p>
        ) : (
          doubts.map(doubt => (
            <DoubtCard key={doubt.id} doubt={doubt} />
          ))
        )}
      </div>
    </div>
  );
}
