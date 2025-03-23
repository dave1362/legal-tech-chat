import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Button } from "../ui/button";
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { MouseEvent } from 'react';
import { SendHorizontal } from "lucide-react";
import { Message, useChat } from "./provider";

export function ChatInput() {
    const { addMessage, updateMessageText, updateMessageGenerating, updateToolMessage, reset } = useChat();

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const model = formData.get("model") as string;
        const prompt = formData.get("prompt") as string;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            text: prompt,
            generating: false
        };

        const aiMessage: Message = {
            id: Date.now().toString() + "ai",
            type: "ai",
            text: "",
            generating: true
        };

        addMessage(userMessage);
        addMessage(aiMessage)

        await fetchEventSource('http://localhost:8000/run/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ model, prompt }),
            onmessage(event) {
                const data = JSON.parse(event.data);

                if (data.type === "end") {
                    updateMessageGenerating(aiMessage.id, false);
                } else if (data.type === "tool_message") {
                    updateToolMessage(aiMessage.id, data.text);
                } else {
                    updateMessageText(aiMessage.id, data.text);
                }
            },
            onerror(err) {
                console.error('Error:', err);
                updateMessageText(aiMessage.id, "Error: Failed to generate the response.");
                updateMessageGenerating(aiMessage.id, false);
                throw new Error('Connection closed due to error');
            }
        });
    };

    const handleClear = (event: MouseEvent) => {
        event.preventDefault();
        reset();
    }

    return (
        <div className="flex-0">
            <form className="flex flex-col gap-2 relative" onSubmit={handleSubmit}>
                <Textarea name="prompt" className="m-0 max-h-[400px]" placeholder="Type your prompt here!" />
                <div className="flex gap-2">
                    <Select name="model" defaultValue="gemini">
                        <SelectTrigger className=" flex-1 text-foreground">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="gemini">gemini</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="flex-0" onClick={handleClear}>
                        Reset
                    </Button>
                    <Button className="flex-0" type="submit">
                        Send your prompt now!
                        <SendHorizontal />
                    </Button>
                </div>
            </form>
        </div>
    );
}
