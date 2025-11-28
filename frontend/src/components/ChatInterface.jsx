import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, FileText } from 'lucide-react'

export default function ChatInterface() {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I have finished processing your documents. Ask me anything about them.' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMsg = input
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setLoading(true)

        try {
            const res = await fetch('http://127.0.0.1:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            })
            const data = await res.json()

            setMessages(prev => [...prev, {
                role: 'ai',
                content: data.answer,
                sources: data.sources
            }])
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error." }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-900 text-white overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center gap-3 shadow-md">
                <div className="p-2 bg-blue-600/20 rounded-xl">
                    <Bot className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h2 className="font-semibold text-white text-lg">Document Assistant</h2>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Online
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 md:px-8">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-blue-600/20 text-blue-400' : 'bg-purple-600/20 text-purple-400'}`}>
                            {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                        </div>

                        <div className="space-y-2 max-w-[85%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%]">
                            <div className={`p-4 rounded-2xl shadow-md ${msg.role === 'ai'
                                    ? 'bg-gray-800 text-gray-100 rounded-tl-none'
                                    : 'bg-blue-600 text-white rounded-tr-none'
                                }`}>
                                <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.content}</p>
                            </div>

                            {msg.sources && msg.sources.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {msg.sources.map((source, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-400 hover:text-blue-400 hover:border-blue-500/50 transition-colors cursor-pointer">
                                            <FileText className="w-3 h-3" />
                                            <span className="truncate max-w-[150px]">{source.source}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="p-4 bg-gray-800 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-md">
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-gray-800 border-t border-gray-700 shadow-inner">
                <form onSubmit={handleSubmit} className="relative w-full max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your documents..."
                        className="w-full pl-4 pr-14 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all text-sm md:text-base"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    )
}
