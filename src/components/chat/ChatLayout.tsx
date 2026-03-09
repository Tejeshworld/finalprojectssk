"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";

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

interface ChatLayoutProps {
    hubId?: string;
}

export default function ChatLayout({ hubId }: ChatLayoutProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const fetchMessages = async () => {
        try {
            const url = `/api/chat${hubId ? `?hubId=${hubId}` : ''}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.messages) setMessages(data.messages);
        } catch (e) {
            console.error('Message fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [hubId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !user || sending) return;

        const tempId = 'temp-' + Date.now();
        const optimistic: Message = {
            id: tempId,
            content: inputValue,
            createdAt: new Date().toISOString(),
            author: {
                id: (user as any).id || '',
                username: user.username,
                avatar: (user as any).avatar || null,
            },
        };

        setMessages(prev => [...prev, optimistic]);
        setInputValue('');
        setSending(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: optimistic.content, hubId }),
            });
            const data = await res.json();
            if (data.success) {
                setMessages(prev => prev.map(m => (m.id === tempId ? data.message : m)));
            } else {
                setMessages(prev => prev.filter(m => m.id !== tempId));
            }
        } catch {
            setMessages(prev => prev.filter(m => m.id !== tempId));
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (messageId: string) => {
        if (!confirm('Delete this message?')) return;
        const prev = [...messages];
        setMessages(m => m.filter(msg => msg.id !== messageId));
        try {
            const res = await fetch(`/api/chat?id=${messageId}`, { method: 'DELETE' });
            const data = await res.json();
            if (!data.success) setMessages(prev);
        } catch {
            setMessages(prev);
        }
    };

    if (loading) {
        return (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid rgba(255,255,255,0.08)',
                    borderTop: '4px solid var(--accent-primary)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }} />
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
            overflow: 'hidden',
        }}>
            <ChatHeader hubId={hubId} />

            <ChatMessages
                messages={messages}
                currentUserId={(user as any)?.id}
                currentUserRole={(user as any)?.role}
                onDelete={handleDelete}
            />

            <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSend}
                sending={sending}
                disabled={!user}
                placeholder={user ? 'Send a message to the community...' : 'Please log in to chat...'}
            />
        </div>
    );
}
