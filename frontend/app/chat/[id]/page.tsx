'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ChatInput from '@/components/ChatInput'
import ChatMessage from '@/components/ChatMessage'
import Sidebar from '@/components/Sidebar'
import { getChatHistory, sendMessage, generateTitle } from '@/lib/api'
import { Message } from '@/types'

export default function ChatPage() {
  const { id } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (id) {
        const history = await getChatHistory(Number(id))
        setMessages(history)
        if (history.length > 0) {
          const generatedTitle = await generateTitle(Number(id))
          setTitle(generatedTitle)
        }
      }
    }
    fetchChatHistory()
  }, [id])

  const handleSendMessage = async (content: string) => {
    if (id) {
      const newMessage = await sendMessage(Number(id), content)
      setMessages(prev => [...prev, newMessage.userMessage, newMessage.assistantMessage])
    }
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <h1 className="text-2xl font-bold p-4 text-center">{title}</h1>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 mb-[130px]">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  )
}