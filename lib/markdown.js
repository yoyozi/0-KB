import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

const contentDirectory = path.join(process.cwd(), 'knowledgeBase')

/**
 * Get all markdown files from the root directory
 */
export function getAllMarkdownFiles() {
  const files = fs.readdirSync(contentDirectory)
  return files.filter(file => file.endsWith('.md'))
}

/**
 * Extract metadata from filename
 * Format: 00-Topic-Version.md -> { topic: 'Topic', version: 'Version' }
 */
export function parseFilename(filename) {
  const nameWithoutExt = filename.replace('.md', '')
  const parts = nameWithoutExt.split('-')
  
  // Remove numeric prefix if present
  const filteredParts = parts.filter(part => !/^\d+$/.test(part))
  
  return {
    slug: nameWithoutExt.toLowerCase().replace(/\s+/g, '-'),
    title: filteredParts.join(' ').replace(/([A-Z])/g, ' $1').trim(),
    filename: filename
  }
}

/**
 * Get all articles with metadata
 */
export function getAllArticles() {
  try {
    const files = getAllMarkdownFiles()
    
    const articles = files.map(filename => {
      try {
        const filePath = path.join(contentDirectory, filename)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const { data, content } = matter(fileContents)
        const { slug, title } = parseFilename(filename)
        
        // Extract first paragraph as excerpt
        const excerpt = content
          .split('\n')
          .find(line => line.trim().length > 0 && !line.startsWith('#'))
          ?.substring(0, 200) || ''
        
        return {
          slug,
          title: data.title || title,
          description: data.description || '',
          excerpt: data.excerpt || excerpt,
          date: data.date || fs.statSync(filePath).mtime,
          tags: data.tags || [],
          filename,
          ...data
        }
      } catch (error) {
        console.error(`Error processing file ${filename}:`, error)
        return null
      }
    }).filter(article => article !== null)
    
    // Sort by date, most recent first
    return articles.sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (error) {
    console.error('Error getting all articles:', error)
    return []
  }
}

/**
 * Get a single article by slug
 */
export function getArticleBySlug(slug) {
  const files = getAllMarkdownFiles()
  const filename = files.find(file => {
    const { slug: fileSlug } = parseFilename(file)
    return fileSlug === slug
  })
  
  if (!filename) {
    return null
  }
  
  const filePath = path.join(contentDirectory, filename)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  const { title } = parseFilename(filename)
  
  return {
    slug,
    title: data.title || title,
    content,
    date: data.date || fs.statSync(filePath).mtime,
    tags: data.tags || [],
    filename,
    ...data
  }
}

/**
 * Convert markdown to HTML
 */
export async function markdownToHtml(markdown) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown)
  
  return result.toString()
}

/**
 * Get all unique tags from articles
 */
export function getAllTags() {
  const articles = getAllArticles()
  const tagSet = new Set()
  
  articles.forEach(article => {
    if (article.tags && Array.isArray(article.tags)) {
      article.tags.forEach(tag => tagSet.add(tag))
    }
  })
  
  return Array.from(tagSet).sort()
}

/**
 * Search articles with scoring (simple but effective)
 */
export function searchArticles(query) {
  try {
    if (!query || query.trim() === '') {
      return []
    }
    
    const articles = getAllArticles()
    
    if (!articles || articles.length === 0) {
      console.log('No articles found')
      return []
    }
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1)
    
    if (searchTerms.length === 0) {
      return []
    }
    
    // Score each article
    const scoredArticles = articles.map(article => {
      let score = 0
      const title = (article.title || '').toLowerCase()
      const description = (article.description || '').toLowerCase()
      const excerpt = (article.excerpt || '').toLowerCase()
      const tags = Array.isArray(article.tags) ? article.tags.join(' ').toLowerCase() : ''
      
      searchTerms.forEach(term => {
        // Title matches are worth more
        if (title.includes(term)) score += 10
        // Description matches
        if (description.includes(term)) score += 5
        // Excerpt matches
        if (excerpt.includes(term)) score += 3
        // Tag matches
        if (tags.includes(term)) score += 7
      })
      
      return { article, score }
    })
    
    // Filter articles with score > 0 and sort by score
    return scoredArticles
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ article }) => article)
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}
