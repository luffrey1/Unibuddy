import Header from './Header'
import ChatWindow from './ChatWindow'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-2">
        <ChatWindow />
      </main>
    </div>
  )
} 