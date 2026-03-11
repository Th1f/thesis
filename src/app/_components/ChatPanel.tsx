"use client";
import { useState, useRef, useEffect } from "react";
import { ChatInput } from "./ChatInput";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content,
      sender: "user",
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsTyping(true);

    // Initial bot message for streaming
    const botMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: botMessageId, content: "", sender: "bot" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, content: "Sorry, I encountered an error." }
            : msg,
        ),
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center transition-all duration-1000 ease-in-out">
      <div
        className={`flex w-full flex-col overflow-y-auto rounded-xl bg-gray-600/40 shadow-lg backdrop-blur-sm transition-all duration-1000 ease-in-out ${
          messages.length > 0
            ? "mb-4 h-[calc(100vh-250px)] p-4 opacity-100"
            : "mb-0 h-0 p-0 opacity-0"
        }`}
      >
        <div className="flex-1 overflow-y-auto pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`animate-fade-in-up mb-4 flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 whitespace-pre-wrap ${
                  message.sender === "user"
                    ? "rounded-br-none bg-gray-600 text-white"
                    : "rounded-bl-none bg-gray-700 text-white"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="mb-4 flex justify-start">
              <div className="animate-pulse rounded-2xl rounded-bl-none bg-gray-700 px-4 py-2 text-white">
                ...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="w-full max-w-6xl transition-all duration-1000 ease-in-out">
        <ChatInput sendMessage={sendMessage} isLoading={isTyping} />
      </div>
    </div>
  );
}
