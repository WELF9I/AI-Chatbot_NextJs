'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MoreHorizontal, Trash2, Edit2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Conversation } from '@/types'
import { updateChatTitle, deleteChat } from '@/lib/api'

interface ChatHistoryItemProps {
  chat: Conversation;
  isActive: boolean;
  onDelete: (chatId: number) => void;
  onUpdate: (chatId: number, newTitle: string) => void;
}

export default function ChatHistoryItem({ chat, isActive, onDelete, onUpdate }: ChatHistoryItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(chat.title)
  const [originalTitle, setOriginalTitle] = useState(chat.title)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const handleEdit = () => {
    setOriginalTitle(title)
    setIsEditing(true)
  }
  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    try {
      setTitle(title)
      setOriginalTitle(title)
      setIsEditing(false)

      await updateChatTitle(chat.id, title)
      onUpdate(chat.id, title)
    } catch (err) {
      setError('Failed to update title. Please try again.')
      setTitle(originalTitle)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    await deleteChat(chat.id)
    onDelete(chat.id)
  }
  return (
    <div className={`flex items-center justify-between p-2 ${isActive ? 'bg-secondary' : 'hover:bg-secondary'}`}>
      {isEditing ? (
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave()
            }
          }}
          autoFocus
          className="flex-1 mr-2"
          disabled={isLoading}
        />
      ) : (
        <Link href={`/chat/${chat.id}`} className="flex-1 truncate text-foreground">
          {title}
        </Link>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your chat.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
