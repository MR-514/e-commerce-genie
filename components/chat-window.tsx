"use client"

import { useState, useEffect, useRef } from "react"
import { Send, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearchContext } from "@/context/search-context"

type Message = {
  id: number
  text: string
  isUser: boolean
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm your shopping assistant. How can I help you today?", isUser: false },
  ])
  const [input, setInput] = useState("")
  const { searchQuery, setSearchQuery, isChatOpen, setIsChatOpen } = useSearchContext()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle search queries from the header
  useEffect(() => {
    if (searchQuery) {
      handleSendMessage(searchQuery)
      setSearchQuery("") // Clear the search query after handling
    }
  }, [searchQuery])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isChatOpen])

  const handleSendMessage = (text: string = input) => {
    if (!text.trim()) return

    // Add user message
    const newUserMessage = { id: messages.length + 1, text, isUser: true }
    setMessages([...messages, newUserMessage])
    setInput("")

    // Simulate agent response
    setTimeout(() => {
      let response = ""

      // Simple keyword matching for demo purposes
      const lowerText = text.toLowerCase()
      if (
        lowerText.includes("fashion") ||
        lowerText.includes("clothes") ||
        lowerText.includes("shirt") ||
        lowerText.includes("jeans")
      ) {
        response = "I found several fashion items that might interest you. Check out the product list above!"
      } else if (lowerText.includes("skin") || lowerText.includes("care") || lowerText.includes("cream")) {
        response = "Looking for skincare products? We have a great selection of skincare items from top brands."
      } else if (lowerText.includes("price") || lowerText.includes("discount") || lowerText.includes("offer")) {
        response = "We have several items on discount right now, with up to 70% off on selected products!"
      } else if (lowerText.includes("help") || lowerText.includes("how")) {
        response =
          "I can help you find products, compare prices, or learn about specific items. Just let me know what you're looking for!"
      } else {
        const responses = [
          "I can help you find products that match your preferences.",
          "Would you like to see more fashion items or skincare products?",
          "I found several items that might interest you. Check out the product list!",
          "Is there a specific brand or price range you're looking for?",
        ]
        response = responses[Math.floor(Math.random() * responses.length)]
      }

      setMessages((prev) => [...prev, { id: prev.length + 1, text: response, isUser: false }])
    }, 1000)
  }

  if (!isChatOpen) return null

  return (
    <div className="fixed top-[61px] right-0 bottom-0 border-l border-gray-200 z-30 flex flex-col bg-white w-full md:w-96 shadow-lg">
      <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-medium">Shopping Assistant</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-160px)] scrollbar-hide">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser ? "bg-blue-500 text-white rounded-tr-none" : "bg-gray-200 text-gray-800 rounded-tl-none"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-200">
        <form
          className="flex items-center space-x-2"
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
        >
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
