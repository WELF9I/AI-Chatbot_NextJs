'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ChatInput from '@/components/ChatInput'
import ChatMessage from '@/components/ChatMessage'
import Sidebar from '@/components/Sidebar'
import { getChatHistory, sendMessage, generateTitle, createOrGetUser } from '@/lib/api'
import { Message } from '@/types'
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'

export default function ChatPage() {
  const { id } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [title, setTitle] = useState('')
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/')
    } else if (isLoaded && isSignedIn && user) {
      createOrGetUser(user.id, user.fullName || '', user.primaryEmailAddress?.emailAddress || '')
        .then(userData => {
          return fetchChatHistory(user.id)
        })
        .catch(error => console.error('Error creating/getting user:', error))
    }
  }, [isLoaded, isSignedIn, user, router])

  const fetchChatHistory = async (clerkUserId: string) => {
    if (id) {
      const history = await getChatHistory(Number(id), clerkUserId)
      setMessages(history)
      if (history.length > 0) {
        const generatedTitle = await generateTitle(Number(id))
        setTitle(generatedTitle)
      }
    }
  }

  const handleSendMessage = async (content: string) => {
    if (id && user) {
      const newMessage = await sendMessage(Number(id), content, user.id)
      setMessages(prev => [...prev, newMessage.userMessage, newMessage.assistantMessage])
    }
  }

  if (!isLoaded || !user) {
    return null
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 flex flex-col relative">
        <div className="absolute top-4 right-4">
          <UserButton afterSignOutUrl="/" />
        </div>
        <Link href="/" className="text-2xl font-bold p-4 text-center">AI Chatbot</Link>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 mb-[130px]">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} isNew={message.isNew} />
          ))}
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  )
}