"use client";

import { useState, useEffect } from "react";
import MessageList from "./components/MessageList";
import type {
  ChatMessage,
  NormalResponse,
  ClarificationResponse,
} from "./types/chat";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ---- Send a new query ---- //
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/analyse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_query: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            type: "error",
            content: `❌ Error: ${data.detail || "Something went wrong."}`,
          },
        ]);
        return;
      }

      // Backend says it needs clarification
      if (data.needs_clarification) {
        const clarification = data as ClarificationResponse;
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            type: "clarification",
            message: clarification.message,
            threadId: clarification.thread_id,
            corrections: clarification.corrections,
          },
        ]);
        return;
      }

      // Normal parsed response
      const normal = data as NormalResponse;
      setMessages((prev) => [
        ...prev,
        { role: "bot", type: "normal", data: normal },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          type: "error",
          content: "❌ Error connecting to server. Is the backend running?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ---- Handle clarification response (Yes / custom correction) ---- //
  const handleClarificationSubmit = async (
    threadId: string,
    userInput: string,
  ) => {
    // Show user's clarification reply in chat
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/analyse/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thread_id: threadId,
          user_reply: userInput,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            type: "error",
            content: `❌ Error: ${data.detail || "Something went wrong."}`,
          },
        ]);
        return;
      }

      // After clarification, backend should return a normal response
      const normal = data as NormalResponse;
      setMessages((prev) => [
        ...prev,
        { role: "bot", type: "normal", data: normal },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          type: "error",
          content: "❌ Error connecting to server. Is the backend running?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Messages */}
      <MessageList
        messages={messages}
        loading={loading}
        onClarificationSubmit={handleClarificationSubmit}
      />

      {/* Input — fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your query..."
            className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-sm text-gray-800 bg-white outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-gray-700 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
