import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Message } from '@/types'
import { Clipboard, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ChatMessageProps {
  message: Message;
  isNew?: boolean;
}

export default function ChatMessage({ message, isNew = false }: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copied, setCopied] = useState(false)

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

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    })
  }

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
          <div className="relative">
            <Badge variant="secondary" className="text-sm p-2 rounded-lg min-h-[2.5rem] flex items-center">
              {isTyping && displayedContent === '' ? (
                <span className="typing-animation">...</span>
              ) : (
                displayedContent
              )}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-2"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copied ? 'Copied!' : 'Copy'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            {displayedContent}
          </div>
        )}
      </div>
    </div>
  )
}
