"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Send, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearchContext } from "@/context/search-context"
import MarkdownMessage from "./markdown-message"

// API Constants
const TOKEN_ENDPOINT = "https://1faec9f48e2be23587233f4068fbaf.8e.environment.api.powerplatform.com/powervirtualagents/botsbyschema/cr49d_csvDataParser/directline/token?api-version=2022-03-01-preview"
const DIRECT_LINE_BASE = "https://directline.botframework.com/v3/directline"
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000 // 5 minutes buffer
const MAX_RETRIES = 3
const POLLING_INTERVAL = 1000 // 1 second
const MAX_POLLING_ATTEMPTS = 60 // 60 seconds (1 minute)

type Message = {
  id: string
  text: string
  isUser: boolean
  isMarkdown?: boolean
  timestamp: number
}

export default function ChatWindow({ updateBotProducts }) {
  // State management
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const { searchQuery, setSearchQuery, isChatOpen, setIsChatOpen } = useSearchContext()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [lastMessageTime, setLastMessageTime] = useState(0)
  const [isBotTyping, setIsBotTyping] = useState(false)

  // API state
  const [conversationId, setConversationId] = useState("")
  const [userId] = useState(() => crypto.randomUUID())
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState("")
  const [tokenExpiry, setTokenExpiry] = useState<number>(0)
  const [watermark, setWatermark] = useState<string | null>(null)

  // Console logging
  const logInfo = useCallback((message: string, data?: any) => {
    console.log(`ℹ️ ${message}`, data || "")
  }, [])

  const logError = useCallback((message: string, error?: any) => {
    console.error(`❌ ${message}`, error || "")
  }, [])

  // Generate unique message IDs
  const generateUniqueId = useCallback(() => {
    return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }, [])

  // Clear chat and start fresh
  const resetChat = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('chatState')
    
    // Reset all state
    setConversationId("")
    setToken("")
    setTokenExpiry(0)
    setWatermark(null)
    
    // Set welcome message with unique ID
    setMessages([{ 
      id: generateUniqueId(), 
      text: "Hello! I'm your shopping assistant. How can I help you today?", 
      isUser: false,
      timestamp: Date.now()
    }])
    
    logInfo("Chat has been reset")
  }, [generateUniqueId, logInfo])

  // Initialize chat
  useEffect(() => {
    const loadChatState = () => {
      try {
        const saved = localStorage.getItem('chatState')
        if (saved) {
          const parsedState = JSON.parse(saved)
          
          // Only use saved state if token is still valid and we have a conversation
          if (parsedState.tokenExpiry > Date.now() + TOKEN_EXPIRY_BUFFER && 
              parsedState.conversationId && 
              parsedState.messages && 
              parsedState.messages.length > 0) {
            
            // Ensure all message IDs are unique
            const fixedMessages = parsedState.messages.map((msg: any) => ({
              ...msg,
              id: msg.id || generateUniqueId()
            }))
            
            setConversationId(parsedState.conversationId)
            setMessages(fixedMessages)
            setToken(parsedState.token)
            setTokenExpiry(parsedState.tokenExpiry)
            if (parsedState.watermark) setWatermark(parsedState.watermark)
            
            logInfo("Chat state loaded from localStorage")
            return
          }
        }
      } catch (e) {
        logError("Failed to parse saved chat state", e)
      }
      
      // Fall back to reset if there's any issue
      resetChat()
    }

    loadChatState()
  }, [generateUniqueId, logInfo, logError, resetChat])

  // Save state to localStorage
  useEffect(() => {
    const saveChatState = () => {
      localStorage.setItem('chatState', JSON.stringify({
        conversationId,
        messages,
        token,
        tokenExpiry,
        watermark
      }))
    }

    saveChatState()
  }, [conversationId, messages, token, tokenExpiry, watermark])

  // Handle search queries from header
  useEffect(() => {
    if (searchQuery) {
      handleSendMessage(searchQuery)
      setSearchQuery("")
    }
  }, [searchQuery])

  // Auto-scroll and focus management
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [messages, isChatOpen])

  // Token management
  const getFreshToken = useCallback(async (forceNew = false): Promise<string> => {
    if (!forceNew && token && Date.now() < tokenExpiry - TOKEN_EXPIRY_BUFFER) {
      logInfo("Using existing token")
      return token
    }

    let attempt = 0
    while (attempt < MAX_RETRIES) {
      try {
        logInfo(`Fetching new token - attempt ${attempt + 1}`)
        const res = await fetch(TOKEN_ENDPOINT, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // Use a cache-busting query parameter
          cache: 'no-store'
        })

        if (!res.ok) {
          const responseText = await res.text()
          throw new Error(`HTTP ${res.status}: ${responseText}`)
        }

        const data = await res.json()
        
        if (!data.token) {
          throw new Error("Token missing from response")
        }
        
        const newToken = data.token
        const newExpiry = Date.now() + 30 * 60 * 1000 // 30 minutes expiration

        setToken(newToken)
        setTokenExpiry(newExpiry)
        logInfo("Token successfully fetched")
        return newToken

      } catch (error) {
        attempt++
        logError(`Token fetch attempt ${attempt} failed:`, error)
        if (attempt >= MAX_RETRIES) throw error
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }

    throw new Error("Failed to get token after retries")
  }, [token, tokenExpiry, logInfo, logError])

  // Create a new conversation
  const createNewConversation = useCallback(async (freshToken: string): Promise<string> => {
    try {
      logInfo("Creating new conversation")
      const res = await fetch(`${DIRECT_LINE_BASE}/conversations`, {
        method: "POST",
        headers: { Authorization: `Bearer ${freshToken}` },
      })

      if (!res.ok) {
        const responseText = await res.text()
        throw new Error(`HTTP ${res.status}: ${responseText}`)
      }

      const data = await res.json()
      
      if (!data.conversationId) {
        throw new Error("Conversation ID missing from response")
      }
      
      const newConversationId = data.conversationId
      setConversationId(newConversationId)
      setWatermark(null) // Reset watermark for new conversation
      
      logInfo(`New conversation created: ${newConversationId}`)
      return newConversationId
    } catch (error) {
      logError("Failed to create conversation", error)
      throw error
    }
  }, [logInfo, logError])

  // Get messages from the conversation
  const getMessages = useCallback(async (currentToken: string, convId: string, currentWatermark: string | null) => {
    try {
      let url = `${DIRECT_LINE_BASE}/conversations/${convId}/activities`
      if (currentWatermark) {
        url += `?watermark=${currentWatermark}`
      }
      
      logInfo(`Fetching messages${currentWatermark ? ' with watermark' : ''}`)
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${currentToken}` },
      })
      
      if (!res.ok) {
        const responseText = await res.text()
        throw new Error(`HTTP ${res.status}: ${responseText}`)
      }
      
      const data = await res.json()
      logInfo("Messages fetched successfully", {
        activitiesCount: data.activities?.length || 0,
        watermark: data.watermark
      })
      
      return { 
        activities: data.activities || [], 
        watermark: data.watermark 
      }
    } catch (error) {
      logError("Failed to get messages", error)
      return { activities: [], watermark: currentWatermark }
    }
  }, [logInfo, logError])

  // Send a message to the bot
  const sendMessageToBot = useCallback(async (text: string) => {
    const now = Date.now()
    if (now - lastMessageTime < 1000) return // Rate limiting
    setLastMessageTime(now)

    setIsLoading(true)
    const messageId = generateUniqueId()
    
    const newUserMessage = { 
      id: messageId, 
      text, 
      isUser: true,
      timestamp: now
    }
    
    setMessages(prev => [...prev, newUserMessage])
    setInput("")

    try {
      // Always get a fresh token and create a new conversation for each message
      // This avoids token/conversation mismatch issues
      logInfo("Getting fresh token for message")
      const freshToken = await getFreshToken(true) // Force new token
      
      logInfo("Creating a new conversation")
      const convId = await createNewConversation(freshToken)
      
      setIsBotTyping(true)
      logInfo("Sending message to bot", { text, conversationId: convId })

      // Send message
      const sendRes = await fetch(`${DIRECT_LINE_BASE}/conversations/${convId}/activities`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${freshToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "message",
          from: { id: userId },
          text: text,
        }),
      })

      if (!sendRes.ok) {
        const responseText = await sendRes.text()
        throw new Error(`HTTP ${sendRes.status} sending message: ${responseText}`)
      }

      const sendData = await sendRes.json()
      logInfo("Message sent successfully", sendData)

      // Poll for response
      let attempts = 0
      let currentWatermark = null // Start with no watermark for new conversation
      const printed = new Set()
      const normalizedUserText = text.trim().toLowerCase()
      
      logInfo("Waiting for bot response", { 
        maxAttempts: MAX_POLLING_ATTEMPTS,
        pollingInterval: POLLING_INTERVAL
      })
      
      while (attempts < MAX_POLLING_ATTEMPTS) {
        try {
          const { activities, watermark: newWatermark } = await getMessages(freshToken, convId, currentWatermark)
          
          if (newWatermark && newWatermark !== currentWatermark) {
            logInfo("New watermark received", { old: currentWatermark, new: newWatermark })
            setWatermark(newWatermark)
            currentWatermark = newWatermark
          }
          
          for (const activity of activities) {
            const activityId = activity.id
            
            // Log all activities for debugging
            logInfo("Activity received", {
              id: activity.id,
              type: activity.type,
              from: activity.from?.id,
              text: activity.text
            })
            
            // Only process new message activities from the bot
            const isBotMessage = (
              activity.from?.id !== userId && 
              activity.type === "message" && 
              !printed.has(activityId) &&
              activity.text?.trim().toLowerCase() !== normalizedUserText
            )
            
            if (isBotMessage && activity.text) {
              printed.add(activityId)
              logInfo("Bot response identified", { text: activity.text })
              updateBotProducts(activity.text)
              setMessages(prev => [
                ...prev,
                {
                  id: generateUniqueId(),
                  text: activity.text,
                  isUser: false,
                  isMarkdown: /(\*\*|!\[|\]\(|₹)/.test(activity.text),
                  timestamp: Date.now()
                }
              ])
              setIsBotTyping(false)
              logInfo("Bot response processed successfully")
              return // Successfully got bot response
            }
          }
        } catch (error) {
          logError(`Polling attempt ${attempts + 1} failed`, error)
        }

        attempts++
        logInfo(`Waiting for response - attempt ${attempts}/${MAX_POLLING_ATTEMPTS}`)
        await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL))
      }

      throw new Error("No response from bot after timeout")
    } catch (error) {
      logError("Error during message exchange", error)
      setMessages(prev => [
        ...prev,
        {
          id: generateUniqueId(),
          text: "Sorry, I'm having trouble responding. Please try again.",
          isUser: false,
          timestamp: Date.now()
        }
      ])
    } finally {
      setIsBotTyping(false)
      setIsLoading(false)
    }
  }, [lastMessageTime, getFreshToken, createNewConversation, userId, getMessages, generateUniqueId, logInfo, logError])

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || isLoading) return
    logInfo("Sending message", { text })
    await sendMessageToBot(text)
  }

  if (!isChatOpen) return null

  return (
    <div className="fixed top-[61px] right-0 bottom-0 border-l border-gray-200 z-30 flex flex-col bg-white w-full md:w-96 shadow-lg">
      <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h2 className="font-medium">Shopping Assistant</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetChat}
            className="text-xs"
          >
            Reset Chat
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsChatOpen(false)}
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-160px)] scrollbar-hide">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] p-3 rounded-lg ${
                message.isUser 
                  ? "bg-blue-500 text-white rounded-tr-none" 
                  : "bg-gray-200 text-gray-800 rounded-tl-none"
              }`}
            >
              {message.isMarkdown ? 
                <MarkdownMessage content={message.text} /> : 
                message.text}
            </div>
          </div>
        ))}
        {(isLoading || isBotTyping) && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 text-gray-800 rounded-tl-none">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse delay-300"></div>
                <span className="ml-2">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-200">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex items-center space-x-2"
        >
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}