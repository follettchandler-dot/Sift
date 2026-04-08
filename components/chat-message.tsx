import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: "assistant" | "user"
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isAssistant = role === "assistant"

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%]",
        isAssistant ? "self-start" : "self-end flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full",
          isAssistant ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-700 text-zinc-300"
        )}
      >
        {isAssistant ? <Bot className="size-4" /> : <User className="size-4" />}
      </div>
      <div
        className={cn(
          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isAssistant
            ? "bg-zinc-800 text-zinc-100 rounded-tl-sm"
            : "bg-emerald-600 text-white rounded-tr-sm"
        )}
      >
        {content}
      </div>
    </div>
  )
}
