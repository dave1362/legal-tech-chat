import React, { createContext, useContext, useState, useCallback } from "react";

export type Message = {
    id: string;
    type: "user" | "ai";
    text: string;
    generating: boolean;
};

type ChatProviderProps = {
    children: React.ReactNode;
};

type ChatProviderState = {
    messages: Message[];
    addMessage: (message: Message) => void;
    updateMessageText: (id: string, text: string) => void;
    updateMessageGenerating: (id: string, generating: boolean) => void;
};

const initialState: ChatProviderState = {
    messages: [],
    addMessage: () => null,
    updateMessageText: () => null,
    updateMessageGenerating: () => null
};

const ChatProviderContext = createContext<ChatProviderState>(initialState);

export function ChatProvider({ children }: ChatProviderProps) {
    const [messages, setMessages] = useState<Message[]>([]);

    const addMessage = useCallback((message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    }, []);

    const updateMessageText = useCallback((id: string, text: string) => {
        setMessages((prevMessages) =>
            prevMessages.map((message) =>
                message.id === id ? { ...message, text: message.text + text } : message
            )
        );
    }, []);

    const updateMessageGenerating = useCallback((id: string, generating: boolean) => {
        setMessages((prevMessages) =>
            prevMessages.map((message) =>
                message.id === id ? { ...message, generating } : message
            )
        );
    }, []);

    const value = {
        messages,
        addMessage,
        updateMessageText,
        updateMessageGenerating
    };

    return (
        <ChatProviderContext.Provider value={value}>
            {children}
        </ChatProviderContext.Provider>
    );
}

export const useChat = () => {
    const context = useContext(ChatProviderContext);

    if (context === undefined) {
        throw new Error("useChat must be used within a ChatProvider");
    }

    return context;
};
