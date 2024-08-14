import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { createChat } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'  // Import Clerk's useAuth hook

export default function NewChatButton() {
  const router = useRouter()
  const { userId } = useAuth()  // Get the userId from Clerk's useAuth hook

  const handleNewChat = async () => {
    if (!userId) return // Ensure userId is available
    const newChat = await createChat('New Chat', userId)
    router.push(`/chat/${newChat.id}`)
  }

  return (
    <Button onClick={handleNewChat} className="w-full mt-10">
      <Plus className="mr-2 h-4 w-4" /> New Chat
    </Button>
  )
}
