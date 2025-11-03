import { NextResponse } from 'next/server'
import { searchArticles } from '@/lib/markdown'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query) {
      return NextResponse.json({ results: [] })
    }
    
    const results = searchArticles(query)
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search API error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: error.message || 'Search failed', results: [] },
      { status: 500 }
    )
  }
}
