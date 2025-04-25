"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchContext } from "@/context/search-context"

export default function ChatButton() {
  const { setIsChatOpen } = useSearchContext()

  return (
    <Button
      className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-20 flex items-center justify-center"
      onClick={() => setIsChatOpen(true)}
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  )
}
