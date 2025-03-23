import { Loader } from "../ui/loader";
import { Message } from "./provider";

interface Props {
    message: Message;
}

export function ChatMessage({ message }: Props) {
    const { type, text, generating, tool_message } = message;
    return (
        <div className={`py-3 gap-0 ${type === "ai" ? "opacity-100" : "opacity-60"}`}>
            <strong className="text-xs">{type === "ai" ? "AI" : "USER"}</strong>
            <div>
                {tool_message && (
                    <details className="mb-3 cursor-pointer">
                        <summary>Tool message</summary>
                        <code className="block p-1 bg-muted rounded-sm"><pre>{tool_message}</pre></code>
                    </details>
                )}
                {text}
                {generating && (
                    <Loader className="inline-flex" />
                )}
            </div>
        </div>
    );
}
