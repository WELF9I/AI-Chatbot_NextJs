import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Message } from '@/types'

interface ChatMessageProps {
  message: Message;
  isNew?: boolean;
}

export default function ChatMessage({ message, isNew = false }: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (message.role === 'assistant' && isNew) {
      setIsTyping(true)
      let i = 0
      const typingInterval = setInterval(() => {
        if (i < message.content.length) {
          setDisplayedContent(prev => prev + message.content[i])
          i++
        } else {
          clearInterval(typingInterval)
          setIsTyping(false)
        }
      }, 10)

      return () => clearInterval(typingInterval)
    } else {
      setDisplayedContent(message.content)
    }
  }, [message, isNew])

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
        {message.role === 'assistant' && (
          <Avatar>
            <AvatarImage src="/ai-avatar.png" alt="AI" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        )}
        {message.role === 'assistant' ? (
          <Badge variant="secondary" className="text-sm p-2 rounded-lg min-h-[2.5rem] flex items-center">
            {isTyping && displayedContent === '' ? (
              <span className="typing-animation">...</span>
            ) : (
              displayedContent
            )}
          </Badge>
        ) : (
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            {displayedContent}
          </div>
        )}
      </div>
    </div>
  )
}