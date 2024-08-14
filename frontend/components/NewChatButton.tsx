import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { createChat } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'  

export default function NewChatButton() {
  const router = useRouter()
  const { user } = useUser() 

  const handleNewChat = async () => {
    if (!user) return 
    const newChat = await createChat('New Chat', user.id)
    router.push(`/chat/${newChat.id}`)
  }

  return (
    <Button onClick={handleNewChat} className="w-full mt-10">
      <Plus className="mr-2 h-4 w-4" /> New Chat
    </Button>
  )
}