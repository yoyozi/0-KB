import { NextResponse } from 'next/server'
import { analyzeMarkdownFile } from '@/lib/fileProcessor'

export async function POST(request) {
  try {
    const { filename } = await request.json()
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      )
    }
    
    const analysis = analyzeMarkdownFile(filename)
    
    if (analysis.error) {
      return NextResponse.json(
        { error: analysis.error },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Error analyzing file:', error)
    return NextResponse.json(
      { error: 'Failed to analyze file' },
      { status: 500 }
    )
  }
}
