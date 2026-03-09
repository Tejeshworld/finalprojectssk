"use client";

import Link from 'next/link';
import DoubtCard from '@/components/layout/DoubtCard';
import { HiOutlineRocketLaunch } from 'react-icons/hi2';

interface DoubtFeedProps {
    doubts: any[];
}

export default function DoubtFeed({ doubts }: DoubtFeedProps) {
    return (
        <section className="flex flex-col gap-5 min-w-0 w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                    Recent Community Doubts
                </h2>
                <Link
                    href="/hubs"
                    style={{ fontSize: '10px', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}
                >
                    View All →
                </Link>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-4 w-full">
                {doubts.length === 0 ? (
                    <div className="glass-panel w-full p-8 flex flex-col items-center justify-center gap-4 min-h-[140px]">
                        <p style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '14px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            No doubts yet. Start the conversation! <HiOutlineRocketLaunch size={18} />
                        </p>
                        <Link href="/ask" className="btn btn-primary mt-4" style={{ padding: '0.75rem 2rem' }}>
                            Ask a Doubt
                        </Link>
                    </div>
                ) : (
                    doubts.map(doubt => (
                        <DoubtCard key={doubt.id} doubt={doubt} />
                    ))
                )}
            </div>
        </section>
    );
}
