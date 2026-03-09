"use client";

import { KeyboardEvent } from "react";

interface ChatInputProps {
    value: string;
    onChange: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    sending: boolean;
    disabled?: boolean;
    placeholder?: string;
}

export default function ChatInput({
    value,
    onChange,
    onSubmit,
    sending,
    disabled = false,
    placeholder = "Send a message...",
}: ChatInputProps) {
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !sending && !disabled) {
                onSubmit(e as any);
            }
        }
    };

    const canSend = !!value.trim() && !sending && !disabled;

    return (
        <div style={{
            flexShrink: 0,
            padding: '0.875rem 1.25rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(12px)',
        }}>
            <form
                onSubmit={onSubmit}
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '0.625rem',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: '16px',
                    padding: '0.6rem 0.6rem 0.6rem 1rem',
                    transition: 'border-color 0.2s',
                }}
            >
                {/* Textarea */}
                <textarea
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled || sending}
                    rows={1}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        fontSize: '0.875rem',
                        color: '#fff',
                        lineHeight: 1.5,
                        fontFamily: 'inherit',
                        padding: '4px 0',
                        maxHeight: '120px',
                        overflowY: 'auto',
                    }}
                />

                {/* Send button */}
                <button
                    type="submit"
                    disabled={!canSend}
                    style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        background: canSend ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                        border: 'none',
                        cursor: canSend ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: canSend ? '#fff' : 'rgba(255,255,255,0.2)',
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
                        boxShadow: canSend ? '0 4px 14px rgba(99,102,241,0.35)' : 'none',
                        transform: 'scale(1)',
                    }}
                >
                    {sending ? (
                        <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgba(255,255,255,0.2)',
                            borderTop: '2px solid #fff',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                    ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 2L11 13" />
                            <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                        </svg>
                    )}
                </button>
            </form>

            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)', fontWeight: 600, marginTop: '6px', paddingLeft: '4px' }}>
                Enter to send · Shift+Enter for new line
            </p>
        </div>
    );
}
