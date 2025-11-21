"use client";
import React from 'react';
import useChatLogic from './hooks/useChatLogic';
import ChatList from '@/modules/chat/components/ChatList';
import ChatWindow from '@/modules/chat/components/ChatWindow';
import { Typography } from '@/components'; 

const ChatPage: React.FC = () => {
    const {
        selectedChatId,
        inputValue,
        setInputValue,
        currentMessages,
        handleChatSelect,
        handleSendMessage,
        handleAudioSend,
        handleImageUpload,
        mockChats,
        mockChatHeaders,
        fileInputRef
    } = useChatLogic();

    const selectedChatHeaderData = selectedChatId ? mockChatHeaders[selectedChatId] : undefined;

    return (
        <div className="flex flex-1">
            <div className={
                `w-full border-r border-gray-200 dark:border-slate-700 flex flex-col 
                 ${selectedChatId ? 'hidden md:block' : 'block'} 
                 md:w-64 lg:w-80 xl:w-96 ` 
            }>
                <ChatList
                    chats={mockChats}
                    selectedChatId={selectedChatId}
                    onChatSelect={handleChatSelect}
                />
            </div>

            <div className={
                `flex-1 flex flex-col 
                 ${selectedChatId ? 'block' : 'hidden md:block'}`
            }>
                {selectedChatId && selectedChatHeaderData ? (
                    <ChatWindow
                        headerProps={{
                            ...selectedChatHeaderData,
                            onMoreOptionsClick: selectedChatHeaderData.onMoreOptionsClick,
                            leftActionContent: undefined,
                            onLeftActionClick: undefined,
                        }}
                        messages={currentMessages}
                        inputValue={inputValue}
                        onInputValueChange={setInputValue}
                        onSendMessage={handleSendMessage}
                        onAudioSend={handleAudioSend}
                        onImageUpload={() => fileInputRef.current?.click()}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <Typography as="p" className="text-lg">
                            Selecione uma conversa para começar.
                        </Typography>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            </div>
        </div>
    );
};

export default ChatPage;