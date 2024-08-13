"use client";
import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      // Adjust height based on content
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-border fixed bottom-0 left-0 right-0 bg-background">
      <div className="flex items-center space-x-2 max-w-4xl mx-auto top-0">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 min-h-[50px] rounded-[30px] resize-none overflow-hidden p-3 border border-border bg-input text-white leading-tight" 
          maxLength={1000}
          rows={1}
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
