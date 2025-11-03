import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const knowledgeBaseDir = path.join(process.cwd(), 'knowledgeBase')

/**
 * Analyze a markdown file and suggest improvements
 */
export function analyzeMarkdownFile(filename) {
  const filePath = path.join(knowledgeBaseDir, filename)
  
  if (!fs.existsSync(filePath)) {
    return { error: 'File not found' }
  }
  
  const content = fs.readFileSync(filePath, 'utf8')
  const { data: frontmatter, content: markdownContent } = matter(content)
  
  const analysis = {
    filename,
    currentName: filename,
    suggestedName: null,
    frontmatter,
    issues: [],
    suggestions: [],
    stats: {
      lines: content.split('\n').length,
      words: markdownContent.split(/\s+/).length,
      codeBlocks: (markdownContent.match(/```/g) || []).length / 2,
      headings: (markdownContent.match(/^#{1,6}\s/gm) || []).length,
      links: (markdownContent.match(/\[.*?\]\(.*?\)/g) || []).length,
    }
  }
  
  // Extract main topic from content
  const firstHeading = markdownContent.match(/^#\s+(.+)$/m)
  if (firstHeading) {
    const topic = firstHeading[1].trim()
    const cleanTopic = topic
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
    analysis.suggestedName = `${cleanTopic}.md`
  }
  
  // Check for frontmatter
  if (!frontmatter.title) {
    analysis.issues.push('Missing frontmatter title')
    analysis.suggestions.push('Add a title in frontmatter for better SEO')
  }
  
  if (!frontmatter.tags || frontmatter.tags.length === 0) {
    analysis.issues.push('No tags defined')
    analysis.suggestions.push('Add tags to improve searchability')
  }
  
  if (!frontmatter.description && !frontmatter.excerpt) {
    analysis.issues.push('No description or excerpt')
    analysis.suggestions.push('Add a description for search results')
  }
  
  // Check for common markdown issues
  const lines = content.split('\n')
  
  // Check for inconsistent heading levels
  const headings = lines.filter(line => line.match(/^#{1,6}\s/))
  if (headings.length > 0) {
    const levels = headings.map(h => h.match(/^(#{1,6})/)[1].length)
    const hasH1 = levels.includes(1)
    if (!hasH1) {
      analysis.issues.push('No H1 heading found')
      analysis.suggestions.push('Add a main H1 heading at the top')
    }
  }
  
  // Check for code blocks without language
  const codeBlocksWithoutLang = markdownContent.match(/```\n/g)
  if (codeBlocksWithoutLang && codeBlocksWithoutLang.length > 0) {
    analysis.issues.push(`${codeBlocksWithoutLang.length} code blocks without language specified`)
    analysis.suggestions.push('Add language identifiers to code blocks (e.g., ```javascript)')
  }
  
  // Check for broken links (basic check)
  const internalLinks = markdownContent.match(/\[.*?\]\((?!http).*?\)/g)
  if (internalLinks) {
    analysis.suggestions.push('Review internal links to ensure they point to correct files')
  }
  
  // Check for very long lines (readability)
  const longLines = lines.filter(line => line.length > 120 && !line.startsWith('```'))
  if (longLines.length > 5) {
    analysis.suggestions.push('Consider breaking long lines for better readability')
  }
  
  // Extract topics for better categorization
  const topics = extractTopics(markdownContent)
  if (topics.length > 0) {
    analysis.detectedTopics = topics
    analysis.suggestions.push(`Detected topics: ${topics.join(', ')}. Consider adding these as tags.`)
  }
  
  return analysis
}

/**
 * Extract potential topics from content
 */
function extractTopics(content) {
  const topics = new Set()
  
  // Common programming topics
  const topicPatterns = [
    /\b(javascript|js|typescript|ts|react|vue|angular|node|express|nextjs|next\.js)\b/gi,
    /\b(python|django|flask|fastapi)\b/gi,
    /\b(css|sass|scss|tailwind|bootstrap)\b/gi,
    /\b(html|html5|dom)\b/gi,
    /\b(mongodb|mysql|postgresql|sql|database)\b/gi,
    /\b(git|github|gitlab|version control)\b/gi,
    /\b(docker|kubernetes|k8s|devops)\b/gi,
    /\b(api|rest|graphql|websocket)\b/gi,
    /\b(testing|jest|mocha|cypress|playwright)\b/gi,
    /\b(webpack|vite|rollup|bundler)\b/gi,
  ]
  
  topicPatterns.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) {
      matches.forEach(match => topics.add(match.toLowerCase()))
    }
  })
  
  return Array.from(topics).slice(0, 5) // Limit to top 5
}

/**
 * Generate cleaned frontmatter for a file
 */
export function generateFrontmatter(filename, analysis) {
  const content = fs.readFileSync(path.join(knowledgeBaseDir, filename), 'utf8')
  const { data: existingFrontmatter, content: markdownContent } = matter(content)
  
  // Extract title from first H1 or filename
  let title = existingFrontmatter.title
  if (!title) {
    const firstHeading = markdownContent.match(/^#\s+(.+)$/m)
    title = firstHeading ? firstHeading[1].trim() : filename.replace('.md', '')
  }
  
  // Generate excerpt from first paragraph
  let excerpt = existingFrontmatter.excerpt || existingFrontmatter.description
  if (!excerpt) {
    const firstParagraph = markdownContent
      .split('\n')
      .find(line => line.trim().length > 0 && !line.startsWith('#'))
    excerpt = firstParagraph ? firstParagraph.substring(0, 200) : ''
  }
  
  // Combine existing tags with detected topics
  const tags = new Set([
    ...(existingFrontmatter.tags || []),
    ...(analysis.detectedTopics || [])
  ])
  
  return {
    title,
    description: excerpt,
    tags: Array.from(tags),
    date: existingFrontmatter.date || new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    ...existingFrontmatter // Keep any other existing frontmatter
  }
}

/**
 * Clean up markdown content
 */
export function cleanMarkdownContent(content) {
  let cleaned = content
  
  // Normalize line endings
  cleaned = cleaned.replace(/\r\n/g, '\n')
  
  // Remove excessive blank lines (more than 2 consecutive)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n')
  
  // Ensure single space after heading markers
  cleaned = cleaned.replace(/^(#{1,6})\s*/gm, '$1 ')
  
  // Ensure blank line before and after headings
  cleaned = cleaned.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2')
  cleaned = cleaned.replace(/(#{1,6}\s.+)\n([^\n])/g, '$1\n\n$2')
  
  // Ensure blank line before and after code blocks
  cleaned = cleaned.replace(/([^\n])\n```/g, '$1\n\n```')
  cleaned = cleaned.replace(/```\n([^\n])/g, '```\n\n$1')
  
  // Remove trailing whitespace
  cleaned = cleaned.split('\n').map(line => line.trimEnd()).join('\n')
  
  // Ensure file ends with single newline
  cleaned = cleaned.trim() + '\n'
  
  return cleaned
}

/**
 * Apply frontmatter and cleaned content to a file
 */
export function processAndSaveFile(filename, newFilename = null) {
  const filePath = path.join(knowledgeBaseDir, filename)
  const content = fs.readFileSync(filePath, 'utf8')
  const { content: markdownContent } = matter(content)
  
  // Analyze file
  const analysis = analyzeMarkdownFile(filename)
  
  // Generate new frontmatter
  const frontmatter = generateFrontmatter(filename, analysis)
  
  // Clean content
  const cleanedContent = cleanMarkdownContent(markdownContent)
  
  // Combine frontmatter and content
  const newContent = `---
${Object.entries(frontmatter)
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`
    }
    return `${key}: ${JSON.stringify(value)}`
  })
  .join('\n')}
---

${cleanedContent}`
  
  // Save to new filename if provided
  const targetFilename = newFilename || filename
  const targetPath = path.join(knowledgeBaseDir, targetFilename)
  
  fs.writeFileSync(targetPath, newContent, 'utf8')
  
  // Delete old file if renamed
  if (newFilename && newFilename !== filename) {
    fs.unlinkSync(filePath)
  }
  
  return {
    success: true,
    filename: targetFilename,
    analysis,
    frontmatter
  }
}

/**
 * List all files in knowledgeBase folder
 */
export function listKnowledgeBaseFiles() {
  if (!fs.existsSync(knowledgeBaseDir)) {
    return []
  }
  
  const files = fs.readdirSync(knowledgeBaseDir)
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const stats = fs.statSync(path.join(knowledgeBaseDir, file))
      return {
        filename: file,
        size: stats.size,
        modified: stats.mtime,
        created: stats.birthtime
      }
    })
}
