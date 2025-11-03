import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.name.endsWith('.md')) {
      return NextResponse.json(
        { error: 'Only .md files are allowed' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Save original file to uploads folder (SAFE COPY)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const timestamp = Date.now()
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const originalPath = path.join(uploadsDir, `${timestamp}_${safeFilename}`)
    
    await writeFile(originalPath, buffer)

    // Also copy to knowledgeBase for processing
    const knowledgeBasePath = path.join(process.cwd(), 'knowledgeBase', safeFilename)
    await writeFile(knowledgeBasePath, buffer)

    return NextResponse.json({
      success: true,
      filename: safeFilename,
      originalPath: originalPath,
      knowledgeBasePath: knowledgeBasePath,
      size: file.size,
      message: 'File uploaded successfully. Original saved in /uploads folder, copy in knowledgeBase ready for processing.'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed: ' + error.message },
      { status: 500 }
    )
  }
}
