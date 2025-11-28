import { useEffect, useRef } from 'react'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function IngestionLogs({ logs }) {
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [logs])

    return (
        <div className="min-h-screen w-screen md:px-6 lg:px-8 flex justify-center bg-gray-950 text-white">
            <div className="w-full max-w-3xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-semibold">Ingesting Documents</h2>
                    <p className="text-gray-400 text-sm md:text-base">Processing your files… please wait</p>
                </div>

                {/* Terminal Panel */}
                <div className="bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl h-[65vh] md:h-[70vh] flex flex-col backdrop-blur-xl overflow-hidden">

                    {/* Top Bar */}
                    <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                        <span className="text-sm font-mono text-gray-400">Terminal Output</span>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                        </div>
                    </div>

                    {/* Logs */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm custom-scrollbar">
                        {logs.length === 0 && (
                            <div className="flex items-center gap-2 text-gray-500 animate-pulse">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Initializing connection…</span>
                            </div>
                        )}

                        {logs.map((log, i) => (
                            <div key={i} className="flex items-start gap-3 animate-fade-in">
                                <span className="mt-1 shrink-0">
                                    {log.status === 'info' && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />}
                                    {log.status === 'progress' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                                    {log.status === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                                    {log.status === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-400" />}
                                    {log.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                                    {log.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                </span>

                                <span
                                    className={`leading-relaxed break-words ${
                                        log.status === 'error'
                                            ? 'text-red-400'
                                            : log.status === 'success'
                                            ? 'text-green-400'
                                            : log.status === 'warning'
                                            ? 'text-yellow-400'
                                            : log.status === 'completed'
                                            ? 'text-green-500 font-semibold'
                                            : 'text-gray-300'
                                    }`}
                                >
                                    {log.message}
                                </span>
                            </div>
                        ))}

                        <div ref={bottomRef} />
                    </div>
                </div>
            </div>
        </div>
    )
}