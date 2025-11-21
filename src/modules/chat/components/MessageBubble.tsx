import React, { useMemo, useState } from 'react';
import Typography from '@/components/Typography';
import messageService from '@/lib/services/message';

export interface MessageBubbleProps {
    senderName: string;
    timestamp: string;
    message: string;
    isSender: boolean;
    avatar?: React.ReactElement;
    statusIcon?: React.ReactElement;
    image?: Buffer | string;
    audioUrl?: string;
    className?: string;
    enableTTS?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
    senderName,
    timestamp,
    message,
    isSender,
    avatar,
    statusIcon,
    image,
    audioUrl,
    className = '',
    enableTTS = false,
}) => {
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const audioBlobUrlRef = React.useRef<string | null>(null);
    
    const imageSource = useMemo(() => {
        if (!image) return null;
        if (typeof image === 'string') return image;
        
        // Convert Buffer to base64
        const buffer = Buffer.from(image as Buffer);
        return `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }, [image]);

    // Cleanup audio on unmount
    React.useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (audioBlobUrlRef.current) {
                URL.revokeObjectURL(audioBlobUrlRef.current);
                audioBlobUrlRef.current = null;
            }
        };
    }, []);

    const handlePlayAudio = async () => {
        // Se já está tocando, pausa
        if (isPlayingAudio && audioRef.current) {
            audioRef.current.pause();
            setIsPlayingAudio(false);
            return;
        }
        
        // Se já tem áudio carregado, apenas retoma
        if (audioRef.current && audioBlobUrlRef.current) {
            setIsPlayingAudio(true);
            setAudioError(null);
            try {
                await audioRef.current.play();
            } catch (error) {
                console.error('Error playing audio:', error);
                setIsPlayingAudio(false);
                setAudioError('Erro ao reproduzir áudio');
            }
            return;
        }
        
        // Primeira vez: busca o áudio
        setIsPlayingAudio(true);
        setAudioError(null);
        
        try {
            const audioBlob = await messageService.getTextToSpeech(message);
            const audioUrl = URL.createObjectURL(audioBlob);
            audioBlobUrlRef.current = audioUrl;
            
            const audio = new Audio(audioUrl);
            audioRef.current = audio;
            
            audio.onended = () => {
                setIsPlayingAudio(false);
            };
            
            audio.onerror = () => {
                setIsPlayingAudio(false);
                setAudioError('Erro ao reproduzir áudio');
            };
            
            audio.onpause = () => {
                setIsPlayingAudio(false);
            };
            
            audio.onplay = () => {
                setIsPlayingAudio(true);
            };
            
            await audio.play();
        } catch (error) {
            console.error('Error playing audio:', error);
            setIsPlayingAudio(false);
            setAudioError('Erro ao gerar áudio');
        }
    };

    const groupAlignmentClasses = isSender
        ? 'flex-row-reverse self-end'
        : 'self-start';

    const contentSpacingClasses = isSender ? 'space-x-reverse space-x-2.5' : 'space-x-2.5';

    const bubbleBaseStyling = 'p-3 rounded-xl text-sm shadow-md';
    const bubbleColorAndTailClasses = isSender
        ? 'bg-blue-500 text-white rounded-br-sm'
        : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 rounded-bl-sm';

    const nameTimestampContainerAlignment = isSender ? 'items-end' : 'items-start';

    return (
        <div
            className={`flex items-start mb-4 max-w-[80%] md:max-w-[100%] ${groupAlignmentClasses} ${contentSpacingClasses} ${className}`}
        >
            {avatar && <div className="flex-shrink-0 mt-1">{avatar}</div>}

            <div className={`flex flex-col ${nameTimestampContainerAlignment}`}>
                <div className={`flex items-baseline text-xs mb-1 ${isSender ? 'flex-row-reverse space-x-reverse space-x-2' : 'space-x-2'}`}>
                    {isSender ? (
                        <>
                            <Typography as="span" className="text-gray-500 dark:text-gray-400">
                                {timestamp}
                            </Typography>
                            <Typography as="span" className="font-semibold text-gray-700 dark:text-gray-300">
                                {senderName}
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Typography as="span" className="font-semibold text-gray-700 dark:text-gray-300">
                                {senderName}
                            </Typography>
                            <Typography as="span" className="text-gray-500 dark:text-gray-400">
                                {timestamp}
                            </Typography>
                        </>
                    )}
                </div>

                <div
                    className={`${bubbleBaseStyling} ${bubbleColorAndTailClasses} relative`}
                    style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                >
                    {imageSource && (
                        <div className="mb-2">
                            <img 
                                src={imageSource} 
                                alt="Sent image" 
                                className="rounded-lg max-w-full max-h-[300px] object-contain cursor-pointer"
                                onClick={() => window.open(imageSource, '_blank')}
                            />
                        </div>
                    )}
                    {audioUrl && (
                        <div className="mb-2 w-full">
                            <audio 
                                src={audioUrl} 
                                controls 
                                className="w-full min-w-[280px]"
                                style={{ height: '40px', minWidth: '280px' }}
                            />
                        </div>
                    )}
                    <div className="flex items-start gap-2">
                        <Typography as="p" className="whitespace-pre-wrap flex-1">
                            {message}
                        </Typography>
                        {enableTTS && (
                            <button
                                onClick={handlePlayAudio}
                                className={`flex-shrink-0 p-1.5 rounded-full transition-all duration-200 ${
                                    isPlayingAudio 
                                        ? isSender 
                                            ? 'bg-blue-400 hover:bg-blue-300 cursor-pointer' 
                                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 cursor-pointer'
                                        : isSender
                                            ? 'hover:bg-blue-400 active:bg-blue-300 cursor-pointer'
                                            : 'hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 cursor-pointer'
                                }`}
                                title={isPlayingAudio ? 'Pausar áudio' : 'Ouvir mensagem'}
                                aria-label={isPlayingAudio ? 'Pausar áudio' : 'Reproduzir áudio'}
                            >
                                {isPlayingAudio ? (
                                    <svg 
                                        className={`w-4 h-4 ${isSender ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`} 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                                        />
                                    </svg>
                                ) : (
                                    <svg 
                                        className={`w-4 h-4 ${isSender ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`} 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
                                        />
                                    </svg>
                                )}
                            </button>
                        )}
                    </div>
                    {audioError && (
                        <Typography as="p" className="text-xs text-red-500 mt-1">
                            {audioError}
                        </Typography>
                    )}
                    {statusIcon && (
                        <div className={`absolute bottom-1.5 ${isSender ? 'left-2' : 'right-2'} text-xs`}>
                            {statusIcon}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
