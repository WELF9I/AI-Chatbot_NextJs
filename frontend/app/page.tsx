'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import ChatInput from '@/components/ChatInput'
import Sidebar from '@/components/Sidebar'
import { useRouter } from 'next/navigation'
import { createChat, sendMessage, createOrGetUser,getAllChats } from '@/lib/api'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs'

export default function Home() {
  const router = useRouter()
  const { isLoaded, isSignedIn, user } = useUser()
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      createOrGetUser(user.id, user.fullName || '', user.primaryEmailAddress?.emailAddress || '')
        .then(userData => {
          // Fetch user's chats after creating/getting user
          fetchUserChats(user.id);
        })
        .catch(error => console.error('Error creating/getting user:', error));
    }
  }, [isLoaded, isSignedIn, user]);
  
  const fetchUserChats = async (clerkUserId: string) => {
    try {
      const chats = await getAllChats(clerkUserId);
      // Update state or context with user's chats
    } catch (error) {
      console.error('Error fetching user chats:', error);
    }
  };
  

  const handleSendMessage = async (message: string) => {
    if (user) {
      const newChat = await createChat('New Chat', user.id)
      await sendMessage(newChat.id, message, user.id)
      router.push(`/chat/${newChat.id}`)
    }
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