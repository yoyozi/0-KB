'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import BackToTop from '@/components/BackToTop'

export default function ManagePage() {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [newFilename, setNewFilename] = useState('')
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/files')
      const data = await response.json()
      setFiles(data.files || [])
    } catch (error) {
      console.error('Error loading files:', error)
    }
  }

  const analyzeFile = async (filename) => {
    setLoading(true)
    setSelectedFile(filename)
    setAnalysis(null)
    
    try {
      const response = await fetch('/api/files/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
      })
      
      const data = await response.json()
      setAnalysis(data.analysis)
      setNewFilename(data.analysis.suggestedName || filename)
    } catch (error) {
      console.error('Error analyzing file:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.md')) {
      setUploadError('Please select a .md file')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        alert(`File uploaded successfully!\nOriginal saved to: ${data.originalPath}`)
        loadFiles()
        e.target.value = ''
      } else {
        setUploadError(data.error || 'Upload failed')
      }
    } catch (error) {
      setUploadError('Upload failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const processFile = async () => {
    if (!selectedFile) return
    
    setProcessing(true)
    try {
      const response = await fetch('/api/files/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          filename: selectedFile,
          newFilename: newFilename !== selectedFile ? newFilename : null
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`File processed successfully!\nSaved as: ${data.filename}`)
        setSelectedFile(null)
        setAnalysis(null)
        loadFiles()
      } else {
        alert('Error processing file: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error processing file:', error)
      alert('Error processing file: ' + error.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <main className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Home
          </Link>
          <ThemeToggle />
        </div>

        <h1 className="text-4xl font-bold mb-8">Manage Knowledge Base Files</h1>

        {/* Upload Section */}
        <div className="mb-8 p-6 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-blue-900/10">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900 dark:text-blue-100">Upload New File</h2>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
            Upload a markdown file. Your original will be saved safely in the <code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">/uploads</code> folder.
          </p>
          <input
            type="file"
            accept=".md"
            onChange={handleFileUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer disabled:opacity-50"
          />
          {uploading && <p className="mt-2 text-blue-600 dark:text-blue-400">Uploading...</p>}
          {uploadError && <p className="mt-2 text-red-600 dark:text-red-400">{uploadError}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File List */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Files in knowledgeBase/</h2>
            
            {files.length === 0 ? (
              <div className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-400">
                  No files found. Add markdown files to the <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">knowledgeBase/</code> folder.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map(file => (
                  <button
                    key={file.filename}
                    onClick={() => analyzeFile(file.filename)}
                    className={`w-full text-left p-4 border rounded-lg transition-colors ${
                      selectedFile === file.filename
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="font-semibold">{file.filename}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {(file.size / 1024).toFixed(1)} KB • Modified: {new Date(file.modified).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Analysis Panel */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">File Analysis</h2>
            
            {!selectedFile && (
              <div className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-400">
                  Select a file to analyze
                </p>
              </div>
            )}

            {loading && (
              <div className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400">Analyzing...</p>
              </div>
            )}

            {analysis && !loading && (
              <div className="space-y-4">
                {/* Stats */}
                <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <h3 className="font-semibold mb-3">Statistics</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Lines: {analysis.stats.lines}</div>
                    <div>Words: {analysis.stats.words}</div>
                    <div>Headings: {analysis.stats.headings}</div>
                    <div>Code Blocks: {analysis.stats.codeBlocks}</div>
                    <div>Links: {analysis.stats.links}</div>
                  </div>
                </div>

                {/* Suggested Name */}
                <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <h3 className="font-semibold mb-3">Suggested Filename</h3>
                  <input
                    type="text"
                    value={newFilename}
                    onChange={(e) => setNewFilename(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Issues */}
                {analysis.issues.length > 0 && (
                  <div className="p-4 border border-red-300 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <h3 className="font-semibold mb-3 text-red-800 dark:text-red-300">Issues Found</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-400">
                      {analysis.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <div className="p-4 border border-blue-300 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <h3 className="font-semibold mb-3 text-blue-800 dark:text-blue-300">Suggestions</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-400">
                      {analysis.suggestions.map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Detected Topics */}
                {analysis.detectedTopics && analysis.detectedTopics.length > 0 && (
                  <div className="p-4 border border-green-300 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <h3 className="font-semibold mb-3 text-green-800 dark:text-green-300">Detected Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.detectedTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Process Button */}
                <button
                  onClick={processFile}
                  disabled={processing}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {processing ? 'Processing...' : 'Process & Clean File'}
                </button>

                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  This will add/update frontmatter, clean formatting, and rename if needed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <BackToTop />
    </main>
  )
}
