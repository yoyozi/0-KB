import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Developer Knowledge Base</h1>
          <ThemeToggle />
        </div>
        <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
          Search and browse through your developer documentation and notes.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/articles" 
            className="block p-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="font-semibold">Browse All Articles</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">View all documentation</div>
          </Link>
          <Link 
            href="/search" 
            className="block p-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="font-semibold">Search Knowledge Base</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Find specific topics</div>
          </Link>
          <Link 
            href="/manage" 
            className="block p-4 border border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <div className="font-semibold text-blue-700 dark:text-blue-400">Manage Files</div>
            <div className="text-sm text-blue-600 dark:text-blue-500 mt-1">Upload, process, and organize articles (originals kept safe)</div>
          </Link>
        </div>
      </div>
    </main>
  )
}
