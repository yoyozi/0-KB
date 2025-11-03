'use client'

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.name.endsWith('.md')) {
      setFile(selectedFile)
      setError(null)
      setResult(null)
    } else {
      setError('Please select a .md file')
      setFile(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        setFile(null)
        document.getElementById('fileInput').value = ''
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (err) {
      setError('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen p-8 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Home
          </Link>
          <ThemeToggle />
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Upload Markdown File
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Your original file stays safe. A processed copy is created.
        </p>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 mb-6">
          <input
            id="fileInput"
            type="file"
            accept=".md"
            onChange={handleFileChange}
            className="block w-full text-gray-900 dark:text-gray-100"
          />
        </div>

        {file && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="font-semibold">Selected: {file.name}</p>
            <p className="text-sm">Size: {(file.size / 1024).toFixed(2)} KB</p>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {uploading ? 'Uploading...' : 'Upload & Process'}
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-semibold">Success!</p>
            <p className="text-green-700 dark:text-green-300">Saved as: {result.filename}</p>
          </div>
        )}
      </div>
    </main>
  )
}
