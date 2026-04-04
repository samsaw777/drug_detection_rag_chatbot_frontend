"use client";

import type { ChatMessage } from "../types/chat";
import MessageBubble from "./Message_bubble";
import { useState, useEffect } from "react";

type MessageListProps = {
    messages: ChatMessage[];
    loading: boolean;
    onClarificationSubmit?: (threadId: string, userInput: string) => void;
    onMissingSubmit?: (threadId: string, userInput: string) => void;
};

export default function MessageList({
	messages,
	loading,
	onClarificationSubmit,
	onMissingSubmit,
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
			onMissingSubmit={onMissingSubmit}
			/>
		))}

		{loading && <LoadingBubble />}
		</div>
	);
}


// Loader
const LOADING_MESSAGES = [
	"Analysing query...",
	"Checking interaction database...",
	"Generating results...",
];

function LoadingBubble() {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (index === LOADING_MESSAGES.length) return; // ← stop at last step
		const timeout = setTimeout(() => {
			setIndex((prev) => prev + 1);
		}, 3500);
		return () => clearTimeout(timeout);
		}, [index]);

	return (
		<div className="flex justify-start">
		<div className="bg-white border rounded-2xl rounded-bl-none px-4 py-3 text-sm shadow-sm space-y-2">
			{LOADING_MESSAGES.map((msg, i) => (
			<div key={i} className="flex items-center gap-2">
				{/* Icon */}
				{i < index ? (
				// Done — green check
				<span className="text-green-500 text-xs">✓</span>
				) : i === index ? (
				// Active — blue pulse
				<span className="text-blue-500 animate-pulse text-xs">●</span>
				) : (
				// Pending — gray dot
				<span className="text-gray-300 text-xs">●</span>
				)}

				{/* Text */}
				<span
				className={
					i < index
					? "text-green-500"
					: i === index
					? "text-blue-500 font-medium"
					: "text-gray-300"
				}
				>
				{msg}
				</span>
			</div>
			))}
		</div>
		</div>
	);
}