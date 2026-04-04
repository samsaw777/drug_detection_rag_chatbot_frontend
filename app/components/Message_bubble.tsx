"use client";

import { useState } from "react";
import type { ChatMessage } from "../types/chat";

type MessageBubbleProps = {
  message: ChatMessage;
  onClarificationSubmit?: (threadId: string, userInput: string) => void;
  onMissingSubmit?: (threadId: string, userInput: string) => void;
};

export default function MessageBubble({
  message,
  onClarificationSubmit,
  onMissingSubmit,
}: MessageBubbleProps) {
  // ---- User Message ---- //
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-xl px-4 py-3 rounded-2xl rounded-br-none bg-blue-600 text-white text-sm">
          {message.content}
        </div>
      </div>
    );
  }

  // ---- Bot: Error ---- //
  if (message.type === "error") {
    return (
      <div className="flex justify-start">
        <div className="max-w-xl px-4 py-3 rounded-2xl rounded-bl-none bg-white text-gray-800 border shadow-sm text-sm">
          {message.content}
        </div>
      </div>
    );
  }

  // ---- Bot: Normal Response ---- //
  if (message.type === "normal") {
    const { data } = message;
    return (
      <div className="flex justify-start">
        <div className="max-w-xl px-4 py-3 rounded-2xl rounded-bl-none bg-white text-gray-800 border shadow-sm text-sm whitespace-pre-wrap">
          {data.final_output}
        </div>
      </div>
    );
  }

  // ---- Bot: Clarification ---- //
  if (message.type === "clarification") {
    return (
      <ClarificationBubble
        message={message.message}
        threadId={message.threadId}
        onSubmit={onClarificationSubmit}
      />
    );
  }

  // ---- Bot: Handling Missing Value ---- //
  if (message.type === "missing") {
    return (
      <MissingBubble
        message={message.message}
        threadId={message.threadId}
        onSubmit={onMissingSubmit}
      />
    );
  }
  return null;
}

// ---- Clarification Sub-component (keeps state local) ---- //

type ClarificationBubbleProps = {
  message: string;
  threadId: string;
  onSubmit?: (threadId: string, userInput: string) => void;
};

function ClarificationBubble({
  message,
  threadId,
  onSubmit,
}: ClarificationBubbleProps) {
  const [correctionInput, setCorrectionInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleConfirm = () => {
    if (onSubmit) {
      onSubmit(threadId, "yes");
      setSubmitted(true);
    }
  };

  const handleCustomSubmit = () => {
    if (!correctionInput.trim() || !onSubmit) return;
    onSubmit(threadId, correctionInput.trim());
    setSubmitted(true);
  };

  return (
    <div className="flex justify-start">
      <div className="max-w-xl px-4 py-3 rounded-2xl rounded-bl-none bg-amber-50 text-gray-800 border border-amber-200 shadow-sm text-sm">
        {/* Clarification message from backend */}
        <p className="mb-3">{message}</p>

        {!submitted ? (
          <div className="space-y-2">
            {/* Yes / Confirm button */}
            <button
              onClick={handleConfirm}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Yes, that&apos;s correct
            </button>

            {/* Custom correction input */}
            <input
              type="text"
              value={correctionInput}
              onChange={(e) => setCorrectionInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
              placeholder="Or type the correct name(s)..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />

            {/* Submit custom correction */}
            <button
              onClick={handleCustomSubmit}
              disabled={!correctionInput.trim()}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Correction
            </button>
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">Response submitted ✓</p>
        )}
      </div>
    </div>
  );
}

// ---- Missing Value Sub-component (keeps state local) ---- //
type MissingBubbleProps = {
  message: string;
  threadId: string;
  onSubmit?: (threadId: string, userInput: string) => void;
};

function MissingBubble({ message, threadId, onSubmit }: MissingBubbleProps) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!input.trim() || !onSubmit) return;
    onSubmit(threadId, input.trim());
    setSubmitted(true);
  };

  return (
    <div className="flex justify-start">
      <div className="max-w-xl px-4 py-3 rounded-2xl rounded-bl-none bg-red-50 text-gray-800 border border-red-200 shadow-sm text-sm">
        <p className="mb-3">{message}</p>

        {!submitted ? (
          <div className="space-y-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Enter the missing value..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">Response submitted ✓</p>
        )}
      </div>
    </div>
  );
}
