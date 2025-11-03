'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import BackToTop from '@/components/BackToTop'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      performSearch(q)
    }
  }, [])
  
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    performSearch(query)
    // Update URL without reload
    window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`)
  }
  
  return (
    <main className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Home
          </Link>
          <ThemeToggle />
        </div>
        
        <h1 className="text-4xl font-bold mb-8">Search Knowledge Base</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for articles, topics, code examples..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
        
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Searching...</p>
          </div>
        )}
        
        {!loading && query && results.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Try different keywords or browse all articles
            </p>
          </div>
        )}
        
        {!loading && results.length > 0 && (
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            
            <div className="space-y-4">
              {results.map(article => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="block p-6 border border-gray-300 dark:border-gray-700 rounded-lg hover:shadow-lg dark:hover:shadow-gray-800 transition-shadow bg-white dark:bg-gray-800"
                >
                  <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {article.excerpt}
                  </p>
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <BackToTop />
    </main>
  )
}
