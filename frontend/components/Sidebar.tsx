'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import NewChatButton from './NewChatButton'
import ChatHistoryItem from './ChatHistoryItem'
import { Conversation } from '@/types'
import { getAllChats, createOrGetUser } from '@/lib/api'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { SignedIn, useUser } from '@clerk/nextjs'

export default function Sidebar() {
  const pathname = usePathname()
  const [chats, setChats] = useState<Conversation[]>([])
  const { isLoaded, isSignedIn, user } = useUser()
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      createOrGetUser(user.id, user.fullName || '', user.primaryEmailAddress?.emailAddress || '')
        .then(userData => {
          return fetchChats(user.id);
        })
        .catch(error => console.error('Error creating/getting user:', error));
    }
  }, [isLoaded, isSignedIn, user]);
  
  const fetchChats = async (clerkUserId: string) => {
    try {
      const fetchedChats = await getAllChats(clerkUserId);
      setChats(fetchedChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };
  const handleDeleteChat = (chatId: number) => {
    setChats(chats.filter(chat => chat.id !== chatId))
  }

  const handleUpdateChatTitle = (chatId: number, newTitle: string) => {
    setChats(chats.map(chat =>
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ))
  }

  return (
    <SignedIn>
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed top-4 left-4 z-10">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <NewChatButton />
          </div>
          <ScrollArea className="flex-1">
          {chats.map((chat) => (
            <ChatHistoryItem
              key={chat.id}
              chat={chat}
              isActive={pathname === `/chat/${chat.id}`}
              onDelete={handleDeleteChat}
              onUpdate={handleUpdateChatTitle}
            />
          ))}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
    </SignedIn>
  )
}
