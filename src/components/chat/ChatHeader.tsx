"use client";

interface ChatHeaderProps {
    hubId?: string;
}

export default function ChatHeader({ hubId }: ChatHeaderProps) {
    const title = hubId ? "Subject Channel" : "Global Community";

    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(12px)',
            flexShrink: 0,
        }}>
            {/* Left: icon + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 24px rgba(99,102,241,0.25)',
                    flexShrink: 0,
                }}>
                    {hubId ? 'S' : 'G'}
                </div>
                <div>
                    <h1 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '4px' }}>
                        # {title}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-success)', display: 'inline-block', animation: 'pulse-soft 2s infinite' }} />
                        <span style={{ fontSize: '9px', fontWeight: 900, color: 'var(--accent-success)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            Live — Active
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: member count badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Avatar stack */}
                <div style={{ display: 'flex', marginRight: '4px' }}>
                    {['A', 'B', 'C', 'D'].map((letter, i) => (
                        <div key={letter} style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            border: '2px solid rgba(0,0,0,0.4)',
                            background: 'rgba(255,255,255,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '9px',
                            fontWeight: 700,
                            color: 'rgba(255,255,255,0.5)',
                            marginLeft: i === 0 ? 0 : '-8px',
                        }}>
                            {letter}
                        </div>
                    ))}
                </div>
                {/* Members badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '5px 10px',
                }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
                    <span style={{ fontSize: '9px', fontWeight: 900, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                        24 Members
                    </span>
                </div>
            </div>
        </header>
    );
}
