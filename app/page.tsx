"use client";

import { useState } from "react";

type Message = {
    role: "user" | "bot";
    content: string;
};


// messages — stores the entire chat history
// input — tracks what the user is typing
// loading — tracks if we're waiting for the backend response
export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
        const res = await fetch("http://localhost:8000/api/v1/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_query: input }),
        });

        const data = await res.json();

        if (!res.ok) {
        setMessages((prev) => [
            ...prev,
            { role: "bot", content: `❌ Error: ${data.detail || "Something went wrong."}` },
        ]);
        return;
        }

        const botMessage: Message = {
        role: "bot",
        content: `🔍 Corrected Query: ${data.corrected_query}\n\n💊 Drugs: ${data.drugs.length ? data.drugs.join(", ") : "None"}\n🥗 Foods: ${data.foods.length ? data.foods.join(", ") : "None"}\n🌿 Herbs: ${data.herbs.length ? data.herbs.join(", ") : "None"}\n⚡ Interaction Types: ${data.interaction_types.length ? data.interaction_types.join(", ") : "None"}`,
        };
        setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
        setMessages((prev) => [
        ...prev,
        { role: "bot", content: "❌ Error connecting to server. Is the backend running?" },
        ]);
    } finally {
        setLoading(false);
    }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            {/* <div className="bg-white border-b px-6 py-4 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-800">Drug Interaction Chatbot</h1>
            <p className="text-sm text-gray-500">Ask about drug, food, or herb interactions</p>
            </div> */}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-20">
                Ask something like: "Does aspirin interact with warfarin?"
                </div>
            )}
            {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                    className={`max-w-xl px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border rounded-bl-none shadow-sm"
                    }`}
                >
                    {msg.content}
                </div>
                </div>
            ))}
            {loading && (
                <div className="flex justify-start">
                <div className="bg-white border rounded-2xl rounded-bl-none px-4 py-3 text-sm text-gray-400 shadow-sm">
                    Analysing...
                </div>
                </div>
            )}
            </div>

            {/* Input */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4">
            <div className="flex gap-3 max-w-3xl mx-auto">
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your query..."
                className="flex-1 border rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-gray-700 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-blue-600"
                >
                Send
                </button>
            </div>
            </div>
        </div>
    );
}