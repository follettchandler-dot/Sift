"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { SendHorizonal, Bot, Loader2 } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import { Button } from "@/components/ui/button"

const transport = new DefaultChatTransport({ api: "/api/chat" })

const SUGGESTIONS = [
  "How much did I spend this month?",
  "What's my biggest spending category?",
  "Am I over budget anywhere?",
  "Show me my top 5 purchases this week",
]

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat({ transport })
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    sendMessage({ text })
    setInput("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  function handleSuggestion(text: string) {
    sendMessage({ text })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Chat</h1>
        <p className="text-sm text-zinc-400 mt-1">Ask Sift anything about your spending</p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <Bot className="size-7" />
            </div>
            <div>
              <p className="font-semibold text-zinc-200">Hi, I&apos;m Sift</p>
              <p className="text-sm text-zinc-500 mt-1">
                Ask me anything about your spending, budgets, or receipts.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-300 text-left hover:border-zinc-700 hover:bg-zinc-800 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((m) => {
              const content =
                m.parts
                  ?.filter((p: { type: string }) => p.type === "text")
                  .map((p: { type: string; text?: string }) => p.text ?? "")
                  .join("") || ""
              if (!content && m.role !== "user") return null
              return (
                <ChatMessage
                  key={m.id}
                  role={m.role as "assistant" | "user"}
                  content={content}
                />
              )
            })}
            {isLoading && (
              <div className="flex items-center gap-2 self-start text-zinc-500 text-sm">
                <Loader2 className="size-4 animate-spin" />
                <span>Thinking…</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your spending…"
          rows={1}
          className="flex-1 resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600 transition-colors max-h-32 overflow-y-auto"
          style={{ fieldSizing: "content" } as React.CSSProperties}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading}
          className="shrink-0 size-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40"
        >
          <SendHorizonal className="size-4" />
        </Button>
      </form>
      <p className="mt-1.5 text-center text-xs text-zinc-600">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}
