"use client";

interface Message {
    id: string;
    content: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
        avatar: string | null;
    };
}

interface ChatMessageProps {
    message: Message;
    isMine: boolean;
    isGrouped: boolean;
    canDelete: boolean;
    onDelete: (id: string) => void;
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatMessage({
    message,
    isMine,
    isGrouped,
    canDelete,
    onDelete,
}: ChatMessageProps) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '0.75rem',
            width: '100%',
            flexDirection: isMine ? 'row-reverse' : 'row',
            marginTop: isGrouped ? '4px' : '1.25rem',
        }}>
            {/* Avatar */}
            {!isGrouped ? (
                <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: isMine ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    color: '#fff',
                    flexShrink: 0,
                    overflow: 'hidden',
                }}>
                    {message.author.avatar ? (
                        <img src={message.author.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        message.author.username.charAt(0).toUpperCase()
                    )}
                </div>
            ) : (
                <div style={{ width: '34px', flexShrink: 0 }} />
            )}

            {/* Bubble column */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                maxWidth: '70%',
                alignItems: isMine ? 'flex-end' : 'flex-start',
            }}>
                {/* Username + time */}
                {!isGrouped && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0 4px',
                        flexDirection: isMine ? 'row-reverse' : 'row',
                    }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.01em' }}>
                            {message.author.username}
                        </span>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {formatTime(message.createdAt)}
                        </span>
                    </div>
                )}

                {/* Bubble row */}
                <div style={{ position: 'relative', display: 'inline-block' }} className="group">
                    <div style={{
                        padding: '0.6rem 0.9rem',
                        borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: isMine ? 'var(--accent-primary)' : 'rgba(255,255,255,0.07)',
                        border: isMine ? 'none' : '1px solid rgba(255,255,255,0.08)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: isMine ? '#fff' : 'rgba(255,255,255,0.9)',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        transition: 'background 0.2s',
                    }}>
                        {message.content}
                    </div>

                    {/* Delete button — positioned outside bubble */}
                    {canDelete && !message.id.startsWith('temp-') && (
                        <button
                            onClick={() => onDelete(message.id)}
                            title="Delete"
                            style={{
                                position: 'absolute',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                [isMine ? 'left' : 'right']: 'calc(100% + 8px)',
                                padding: '5px',
                                borderRadius: '8px',
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.25)',
                                color: '#ef4444',
                                cursor: 'pointer',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                            onFocus={e => (e.currentTarget.style.opacity = '1')}
                            onBlur={e => (e.currentTarget.style.opacity = '0')}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
