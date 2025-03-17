import { Textarea } from "@/components/ui/textarea"
import { Button } from "../ui/button";

export function ChatInput() {
    return (
        <div className="flex-0">
            <div className="flex flex-col gap-2 relative">
                <Textarea className="m-0 max-h-[400px]" placeholder="Type your prompt here!" />
                <Button className="flex-0">Send your prompt now!</Button>
            </div>
        </div>
    );
}
