import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { createChat } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function NewChatButton() {
  const router = useRouter()

  const handleNewChat = async () => {
    const newChat = await createChat('New Chat')
    router.push(`/chat/${newChat.id}`)
  }

  return (
    <Button onClick={handleNewChat} className="w-full mt-10">
      <Plus className="mr-2 h-4 w-4" /> New Chat
    </Button>
  )
}