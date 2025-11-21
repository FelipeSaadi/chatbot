"use client";
import React, { useEffect, useRef } from 'react';
import ChatHeader, { ChatHeaderProps } from './ChatHeader';
import MessageBubble, { MessageBubbleProps } from './MessageBubble';
import ChatInput from './ChatInput';

type MessageData = MessageBubbleProps & { id: string | number };

export interface ChatWindowProps {
    headerProps: ChatHeaderProps;
    messages: MessageData[];
    inputValue: string;
    onInputValueChange: (value: string) => void;
    onSendMessage: () => void;
    onAudioSend?: (text: string, audioBlob: Blob) => void;
    onEmojiClick?: () => void;
    onMicClick?: () => void;
    onImageUpload?: () => void;
    typingIndicator?: React.ReactNode;
    className?: string;
    disableInput?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
    headerProps,
    messages,
    inputValue,
    onInputValueChange,
    onSendMessage,
    onAudioSend,
    onEmojiClick,
    onMicClick,
    onImageUpload,
    typingIndicator,
    className = '',
    disableInput = false,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className={`flex flex-col h-full bg-gray-50 dark:bg-slate-850 ${className}`}>
            <ChatHeader {...headerProps} />

            <div className="flex-grow overflow-y-auto p-4 space-y-2 sm:space-y-4">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} {...msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {typingIndicator && (
                <div className="px-4 pb-1 flex justify-start">
                    {typingIndicator}
                </div>
            )}

           {!disableInput && (
                <ChatInput
                    value={inputValue}
                    onValueChange={onInputValueChange}
                    onSend={onSendMessage}
                    onAudioSend={onAudioSend}
                    onImageUpload={onImageUpload}
                    onMicClick={onMicClick}
                />
            )}
        </div>
    );
};

export default ChatWindow;
