"use client";

import type { ChatMessage } from "../types/chat";
import MessageBubble from "./Message_bubble";

type MessageListProps = {
  messages: ChatMessage[];
  loading: boolean;
  onClarificationSubmit?: (threadId: string, userInput: string) => void;
};

export default function MessageList({
  messages,
  loading,
  onClarificationSubmit,
}: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 pb-24">
      {messages.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          Ask something like: <em>Does aspirin interact with warfarin?</em>
        </div>
      )}

      {messages.map((msg, i) => (
        <MessageBubble
          key={i}
          message={msg}
          onClarificationSubmit={onClarificationSubmit}
        />
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="bg-white border rounded-2xl rounded-bl-none px-4 py-3 text-sm text-gray-400 shadow-sm">
            Analysing...
          </div>
        </div>
      )}
    </div>
  );
}
