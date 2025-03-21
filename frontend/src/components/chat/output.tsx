import { useEffect, useRef } from "react";
import { useChat } from "./provider";
import { ChatMessage } from "./message";

export function ChatOutput() {
    const { messages } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="flex-1 relative">
            <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto pr-3 inset-shadow-md">
                <div>
                    {messages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            type={message.type}
                            text={message.text}
                            generating={message.generating}
                        />
                    ))}
                </div>
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
