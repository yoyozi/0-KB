import Link from 'next/link'
import { getAllArticles } from '@/lib/markdown'
import ThemeToggle from '@/components/ThemeToggle'
import BackToTop from '@/components/BackToTop'

export const metadata = {
  title: 'All Articles - Developer Knowledge Base',
  description: 'Browse all developer documentation and notes',
}

export default function ArticlesPage() {
  const articles = getAllArticles()
  
  return (
    <main className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Home
          </Link>
          <ThemeToggle />
        </div>
        
        <h1 className="text-4xl font-bold mb-8">All Articles</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map(article => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="block p-6 border border-gray-300 dark:border-gray-700 rounded-lg hover:shadow-lg dark:hover:shadow-gray-800 transition-shadow bg-white dark:bg-gray-800"
            >
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
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
        
        {articles.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">No articles found.</p>
        )}
      </div>
      
      <BackToTop />
    </main>
  )
}
