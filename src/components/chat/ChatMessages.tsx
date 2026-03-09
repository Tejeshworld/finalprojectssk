"use client";

import { useRef, useEffect } from "react";
import ChatMessage from "@/components/chat/ChatMessage";
import EmptyChatState from "@/components/chat/EmptyChatState";

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

interface ChatMessagesProps {
    messages: Message[];
    currentUserId?: string;
    currentUserRole?: string;
    onDelete: (id: string) => void;
}

export default function ChatMessages({
    messages,
    currentUserId,
    currentUserRole,
    onDelete,
}: ChatMessagesProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div
            ref={scrollRef}
            className="custom-scrollbar"
            style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem 1.5rem',
                minHeight: 0,
            }}
        >
            {messages.length === 0 ? (
                <EmptyChatState />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {messages.map((msg, idx) => {
                        const isMine = !!currentUserId && msg.author.id === currentUserId;
                        const prevMsg = idx > 0 ? messages[idx - 1] : null;
                        const isGrouped =
                            !!prevMsg &&
                            prevMsg.author.id === msg.author.id &&
                            new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() < 5 * 60 * 1000;
                        const canDelete = isMine || currentUserRole === 'ADMIN';

                        return (
                            <ChatMessage
                                key={msg.id}
                                message={msg}
                                isMine={isMine}
                                isGrouped={isGrouped}
                                canDelete={canDelete}
                                onDelete={onDelete}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
