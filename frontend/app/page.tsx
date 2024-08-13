'use client'

import Image from 'next/image'
import ChatInput from '@/components/ChatInput'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  const handleSendMessage = (message: string) => {
    console.log(message)
    // Implement your logic here
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <Image src="/ai-avatar.png" alt="Chatbot Logo" width={200} height={200} />
        <h1 className="text-3xl font-bold mt-4 mb-8">Welcome to AI Chatbot</h1>
        <div className="w-full max-w-2xl">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </main>
    </div>
  )
}