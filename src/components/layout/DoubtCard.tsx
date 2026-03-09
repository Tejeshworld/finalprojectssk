"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function DoubtCard({ doubt: initialDoubt }: { doubt: any }) {
    const { user } = useAuth();
    const [doubt, setDoubt] = useState(initialDoubt);
    const [upvoting, setUpvoting] = useState(false);
    const [bookmarking, setBookmarking] = useState(false);

    const hasUpvoted = doubt.hasUpvoted || false;
    const hasBookmarked = doubt.hasBookmarked || false;

    const handleUpvote = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) return alert('Please login to upvote');
        if (upvoting) return;
        setUpvoting(true);
        const action = hasUpvoted ? -1 : 1;
        setDoubt((prev: any) => ({
            ...prev,
            hasUpvoted: !hasUpvoted,
            _count: { ...prev._count, reactions: Math.max(0, prev._count.reactions + action) }
        }));
        try {
            await fetch('/api/reactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ doubtId: doubt.id }),
            });
        } catch {
            setDoubt((prev: any) => ({
                ...prev,
                hasUpvoted,
                _count: { ...prev._count, reactions: prev._count.reactions - action }
            }));
        } finally {
            setUpvoting(false);
        }
    };

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) return alert('Please login to bookmark');
        if (bookmarking) return;
        setBookmarking(true);
        setDoubt((prev: any) => ({ ...prev, hasBookmarked: !hasBookmarked }));
        try {
            await fetch('/api/bookmarks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ doubtId: doubt.id }),
            });
        } catch {
            setDoubt((prev: any) => ({ ...prev, hasBookmarked }));
        } finally {
            setBookmarking(false);
        }
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) return alert('Please login to share');
        const targetUsername = window.prompt('Enter the username to share with:');
        if (!targetUsername) return;
        try {
            const res = await fetch('/api/shares', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ doubtId: doubt.id, targetUsername }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            alert(`Shared with ${targetUsername}!`);
            setDoubt((prev: any) => ({
                ...prev,
                _count: { ...prev._count, shares: (prev._count.shares || 0) + 1 }
            }));
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="doubt-card w-full">

            {/* Top Row: Hub badge + Author */}
            <div className="doubt-card__header">
                <div className="badge" style={{ backgroundColor: doubt.hub.color + '20', color: doubt.hub.color, border: `1px solid ${doubt.hub.color}30` }}>
                    {doubt.hub.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <div className="doubt-card__avatar">
                        {doubt.author.username.charAt(0).toUpperCase()}
                    </div>
                    <Link href={`/profile/${doubt.authorId || doubt.author?.id}`} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                        {doubt.author.username}
                    </Link>
                    <span>· {new Date(doubt.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Title & Description */}
            <Link href={`/doubt/${doubt.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <h2 className="doubt-card__title">{doubt.title}</h2>
                <p className="doubt-card__desc">{doubt.description}</p>
            </Link>

            {/* Stats Row */}
            <div className="doubt-card__stats">
                <span><strong>{doubt.views || 0}</strong> views</span>
                <span className="doubt-card__dot" />
                <span><strong>{doubt._count.answers || 0}</strong> answers</span>
                <span className="doubt-card__dot" />
                <span><strong>{doubt._count.reactions || 0}</strong> likes</span>
                <span className="doubt-card__dot" />
                <span><strong>{doubt._count.shares || 0}</strong> shares</span>
            </div>

            {/* Actions */}
            <div className="doubt-card__actions">
                <button
                    onClick={handleUpvote}
                    className={hasUpvoted ? 'btn btn-primary doubt-card__btn' : 'btn btn-secondary doubt-card__btn'}
                >
                    👍 {hasUpvoted ? 'Liked' : 'Like'}
                </button>

                <Link
                    href={`/doubt/${doubt.id}`}
                    className="btn btn-secondary doubt-card__btn"
                >
                    💬 Answer
                </Link>

                <button onClick={handleShare} className="btn btn-secondary doubt-card__btn">
                    🔗 Share
                </button>

                <button
                    onClick={handleBookmark}
                    className={hasBookmarked ? 'btn btn-primary doubt-card__btn' : 'btn btn-secondary doubt-card__btn'}
                    style={{ marginLeft: 'auto' }}
                >
                    {hasBookmarked ? '🔖 Saved' : '🔖 Save'}
                </button>
            </div>
        </div>
    );
}
