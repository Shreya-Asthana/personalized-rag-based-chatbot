import { useState } from 'react'
import LandingPage from './components/LandingPage'
import IngestionLogs from './components/IngestionLogs'
import ChatInterface from './components/ChatInterface'

function App() {
    const [view, setView] = useState('landing') // 'landing', 'ingesting', 'chat'
    const [logs, setLogs] = useState([])
    const [driveUrl, setDriveUrl] = useState('')

    const startIngestion = async (url) => {
        setDriveUrl(url)
        setView('ingesting')
        setLogs([])

        try {
            const response = await fetch('http://127.0.0.1:8000/api/ingest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ drive_folder_url: url }),
            })

            const reader = response.body.getReader()
            const decoder = new TextDecoder()

            while (true) {
                const { value, done } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                const lines = chunk.split('\n').filter(line => line.trim() !== '')

                for (const line of lines) {
                    try {
                        const log = JSON.parse(line)
                        setLogs(prev => [...prev, log])
                    } catch (e) {
                        console.error("Error parsing log:", line)
                    }
                }
            }
            setView('chat')
        }

 catch (error) {
        console.error("Ingestion failed:", error)
        setLogs(prev => [...prev, { status: 'error', message: 'Connection failed.' }])
    }
}

return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
            {view === 'landing' && <LandingPage onStart={startIngestion} />}
            {view === 'ingesting' && <IngestionLogs logs={logs} />}
            {view === 'chat' && <ChatInterface />}
        </div>
    </div>
)
}

export default App
