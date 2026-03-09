"use client";

export default function EmptyChatState() {
    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            padding: '3rem 1.5rem',
        }}>
            {/* Animated icon ring */}
            <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                border: '2px dashed rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                animation: 'pulse-soft 3s infinite',
            }}>
                💬
            </div>

            {/* Text */}
            <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                    Welcome to Global Community
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '280px', fontWeight: 500 }}>
                    Start chatting with other learners. Be kind, helpful, and respectful!
                </p>
            </div>

            {/* Decorative dots */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '0.25rem' }}>
                {[0, 1, 2].map((i) => (
                    <span key={i} style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.15)',
                        display: 'inline-block',
                    }} />
                ))}
            </div>
        </div>
    );
}
