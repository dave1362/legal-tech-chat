import { ChatMessage } from "./message";

export function ChatOutput() {
    return (
        <div className="flex-1 relative">
            <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto px-3 inset-shadow-md">
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
                <ChatMessage />
            </div>
        </div>
    );
}
