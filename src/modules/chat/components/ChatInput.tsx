import React, { useRef, useState, useCallback } from 'react';
import AudioRecorder from '@/components/AudioRecorder';

const PlaceholderSendIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 sm:w-6 sm:h-6" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
);

const ImageIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export interface ChatInputProps {
    value: string;
    onValueChange: (value: string) => void;
    onSend: () => void;
    onAudioSend?: (text: string, audioBlob: Blob) => void;
    onImageUpload?: () => void;
    onMicClick?: () => void;
    placeholder?: string;
    disabled?: boolean;
    isSending?: boolean;
    emojiIcon?: React.ReactNode;
    micIcon?: React.ReactNode;
    sendIcon?: React.ReactNode;
    className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
    value,
    onValueChange,
    onSend,
    onAudioSend,
    onImageUpload,
    onMicClick,
    placeholder = "Type message...",
    disabled = false,
    isSending = false,
    emojiIcon,
    micIcon,
    sendIcon,
    className = ''
}) => {
    const [error, setError] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const handleAudioTranscribed = (text: string, audioBlob: Blob) => {
        if (onAudioSend) {
            onAudioSend(text, audioBlob);
        }
        setIsRecording(false);
    };

    const handleTranscriptionError = (message: string) => {
        setError(message);
        setIsRecording(false);
    };

    const handleSend = () => {
        if (value.trim() && !disabled && !isSending) {
            onSend();
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    const handleRecordingStateChange = (recording: boolean) => {
        setIsRecording(recording);
    };

    const actualSendIcon = sendIcon || <PlaceholderSendIcon />;
    const canSend = !disabled && !isSending && value.trim().length > 0;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleSend();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`flex items-center p-2 sm:p-3 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 ${className}`}
        >
            {error && (
                <div className="absolute bottom-full left-0 right-0 p-2 bg-red-100 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <div className='flex w-full items-center flex-row gap-2'>
                <div className="flex-grow flex items-center px-2 sm:px-3 bg-gray-100 dark:bg-slate-800 rounded-full relative">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onValueChange(e.target.value)}
                        placeholder={placeholder}
                        className="flex-grow h-10 sm:h-11 py-2 px-1 sm:px-2 bg-transparent text-gray-900 dark:text-slate-100 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-70"
                        disabled={disabled || isSending || isRecording}
                        onKeyDown={handleKeyDown}
                        aria-label="Message input"
                    />
                </div>

                {onImageUpload && (
                    <button
                        type="button"
                        onClick={onImageUpload}
                        className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none rounded-full transition-colors duration-150"
                        disabled={disabled || isRecording}
                        aria-label="Upload image"
                    >
                        <ImageIcon />
                    </button>
                )}

                <AudioRecorder
                    onAudioTranscribed={handleAudioTranscribed}
                    onError={handleTranscriptionError}
                    onRecordingStateChange={handleRecordingStateChange}
                />

                <button
                    type="submit"
                    className={`flex-shrink-0 p-0 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-900 focus:ring-blue-500
                    ${!canSend
                            ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                        }`}
                    disabled={!canSend}
                    aria-label="Send message"
                >
                    {actualSendIcon}
                </button>
            </div>
        </form>
    );
};

export default ChatInput;
