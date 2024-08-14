'use client'

import Image from 'next/image'
import ChatInput from '@/components/ChatInput'
import Sidebar from '@/components/Sidebar'
import { useRouter } from 'next/navigation'
import { createChat, sendMessage } from '@/lib/api'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

export default function Home() {
  const router = useRouter()
  const handleSendMessage = async (message: string) => {
    const newChat = await createChat('New Chat')
    await sendMessage(newChat.id, message)
    router.push(`/chat/${newChat.id}`)
  }

  return (
    <div className="flex h-screen bg-background">
      <SignedIn>
        <Sidebar />
      </SignedIn>
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-4 right-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
        <Image src="/ai-avatar.png" alt="Chatbot Logo" width={200} height={200} />
        <h1 className="text-3xl font-bold mt-4 mb-8">Welcome to AI Chatbot</h1>
        <SignedIn>
          <div className="w-full max-w-2xl">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </SignedIn>
        <SignedOut>
          <p className="text-center">Please sign in to start chatting with the AI.</p>
        </SignedOut>
      </main>
    </div>
  )
}