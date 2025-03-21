import { Loader } from "../ui/loader";



interface Props {
    type: "user" | "ai";
    text: string;
    generating?: boolean;
}

export function ChatMessage({ type, text, generating }: Props) {
    return (
        <div className={`py-3 gap-0 ${type === "ai" ? "opacity-100" : "opacity-60"}`}>
            <strong className="text-xs">{type === "ai" ? "AI" : "USER"}</strong>
            <div>
                {text}
                {generating && (
                    <Loader />
                )}
            </div>
        </div>
    );
}
