import { Card } from "../ui/card";

interface Props {
    type: "user" | "ai";
}

export function ChatMessage({ type }: Props) {
    return (
        <Card className={`mt-3 p-3 gap-0 ${type === "ai" ? "opacity-100" : "opacity-60"}`}>
            <strong className="text-xs">{type === "ai" ? "AI" : "USER"}</strong>
            <div>Quit touching me</div>
        </Card>
    );
}
