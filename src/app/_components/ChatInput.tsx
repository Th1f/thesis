"use client";

import { useState } from "react";

interface ChatInputProps {
  sendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ sendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full gap-2 rounded-2xl bg-gray-700/50 p-2 shadow-xl backdrop-blur-sm"
    >
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 bg-transparent px-4 py-2 text-white placeholder-gray-400 outline-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isLoading}
      />
      <button
        type="submit"
        className="rounded-xl bg-gray-600 px-6 py-2 font-semibold text-white transition hover:bg-gray-500 active:scale-95 disabled:opacity-50"
        disabled={!message.trim() || isLoading}
      >
        Send
      </button>
    </form>
  );
}
