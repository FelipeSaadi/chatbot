import React, { useState, useRef, useCallback } from 'react';

const PlaceholderMicIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 sm:w-6 sm:h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
);

export interface AudioRecorderProps {
    onAudioTranscribed: (text: string, audioBlob: Blob) => void;
    onError: (message: string) => void;
    onRecordingStateChange?: (isRecording: boolean) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
    onAudioTranscribed, 
    onError, 
    onRecordingStateChange
}) => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    const startRecording = useCallback(async () => {

        try {
            const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob: Blob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });

                console.log('Áudio gravado:', audioBlob);

                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }

                // Enviar automaticamente para o backend
                await sendAudioDirectly(audioBlob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            if (onRecordingStateChange) {
                onRecordingStateChange(true);
            }
        } catch (err: any) {
            console.error('Erro ao acessar microfone:', err);
            
            // Mensagem específica para contexto inseguro (HTTP)
            let errorMessage = 'Não foi possível acessar o microfone.';
            
            if (err.name === 'NotAllowedError') {
                errorMessage = 'Permissão negada para usar o microfone. Verifique as configurações do navegador.';
            } else if (err.name === 'NotSupportedError' || window.location.protocol === 'http:') {
                errorMessage = '⚠️ O microfone só funciona em HTTPS. Acesse o site via HTTPS para usar esta funcionalidade.';
            } else if (err.name === 'NotFoundError') {
                errorMessage = 'Nenhum microfone foi encontrado no dispositivo.';
            }
            
            onError(errorMessage);
            setIsRecording(false);
            if (onRecordingStateChange) {
                onRecordingStateChange(false);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        }
    }, [onError, onRecordingStateChange]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (onRecordingStateChange) {
                onRecordingStateChange(false);
            }
        }
    }, [isRecording, onRecordingStateChange]);

    const sendAudioDirectly = async (audioBlob: Blob) => {
        setIsLoading(true);

        const formData = new FormData();
        formData.append('audio', audioBlob, 'gravacao.webm');

        try {
            console.log('Enviando áudio para transcrição...', {
                size: audioBlob.size,
                type: audioBlob.type
            });

            const STT_URL = process.env.NEXT_PUBLIC_STT_URL || 'http://localhost:3001';
            const response = await fetch(`${STT_URL}/audio/transcribe`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro do backend:', errorText);
                throw new Error(`Falha na requisição ao backend: ${response.statusText} - ${errorText}`);
            }

            const data: { text: string } = await response.json();
            console.log('Transcrição recebida:', data.text);
            onAudioTranscribed(data.text, audioBlob);
        } catch (err: any) {
            console.error('Erro ao enviar áudio:', err);
            onError(err.message || 'Erro ao enviar áudio para transcrição.');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            className={`flex-shrink-0 p-1.5 sm:p-2 focus:outline-none rounded-full transition-all duration-200 ease-in-out ${
                isRecording
                    ? 'scale-125 bg-red-500 text-white animate-pulse'
                    : isLoading
                    ? 'scale-110 bg-blue-400 text-white'
                    : 'scale-100 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            title={isRecording ? 'Parar gravação' : isLoading ? 'Processando...' : 'Gravar áudio'}
        >
            <PlaceholderMicIcon />
        </button>
    );
};

export default AudioRecorder;
