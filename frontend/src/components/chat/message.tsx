import { Loader } from "../ui/loader";
import { Message, MessagePart } from "./provider";

interface Props {
    message: Message;
}

export function ChatMessage({ message }: Props) {
    const { type, parts, generating, } = message;
    return (
        <div className={`py-3 gap-0 ${type === "ai" ? "opacity-100" : "opacity-60"}`}>
            <strong className="text-xs">{type === "ai" ? "AI" : "USER"}</strong>
            <div>
                {parts.map(({ content, type }) => {
                    switch (type) {
                        case "tool_call":
                            return <details className="my-3 cursor-pointer">
                                <summary>Tool call</summary>
                                <code className="block p-1 bg-muted rounded-sm overflow-x-auto font-mono text-sm">{content}</code>
                            </details>
                        case "tool_message":
                            return <details className="my-3 cursor-pointer">
                                <summary>Tool message</summary>
                                <code className="block p-1 bg-muted rounded-sm overflow-x-auto font-mono text-sm">{content}</code>
                            </details>
                        default:
                            return <>{content}</>
                    }
                })}
                {generating && (
                    <Loader className="inline-flex" />
                )}
            </div>
        </div>
    );
}
