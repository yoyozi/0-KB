import { NextResponse } from 'next/server'
import { listKnowledgeBaseFiles } from '@/lib/fileProcessor'

export async function GET() {
  try {
    const files = listKnowledgeBaseFiles()
    return NextResponse.json({ files })
  } catch (error) {
    console.error('Error listing files:', error)
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    )
  }
}
