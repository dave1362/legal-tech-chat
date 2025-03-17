import { ChatInput } from "./input";
import { ChatOutput } from "./output";

export function Chat() {
    return (
        <div className="flex flex-col h-full gap-2">
            <ChatOutput />
            <ChatInput />
        </div>
    );
}
