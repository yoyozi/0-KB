import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllArticles, getArticleBySlug, markdownToHtml } from '@/lib/markdown'
import ThemeToggle from '@/components/ThemeToggle'
import BackToTop from '@/components/BackToTop'

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map(article => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  
  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }
  
  return {
    title: `${article.title} - Developer Knowledge Base`,
    description: article.excerpt || article.title,
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  
  if (!article) {
    notFound()
  }
  
  const contentHtml = await markdownToHtml(article.content)
  
  return (
    <main className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <article className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/articles" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Articles
          </Link>
          <ThemeToggle />
        </div>
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <time className="text-gray-500 dark:text-gray-400 text-sm">
            Last updated: {new Date(article.date).toLocaleDateString()}
          </time>
        </header>
        
        <div 
          className="markdown-content prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
      
      <BackToTop />
    </main>
  )
}
