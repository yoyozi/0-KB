import { NextResponse } from 'next/server'
import { processAndSaveFile } from '@/lib/fileProcessor'

export async function POST(request) {
  try {
    const { filename, newFilename } = await request.json()
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      )
    }
    
    const result = processAndSaveFile(filename, newFilename)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error processing file:', error)
    return NextResponse.json(
      { error: 'Failed to process file', details: error.message },
      { status: 500 }
    )
  }
}
