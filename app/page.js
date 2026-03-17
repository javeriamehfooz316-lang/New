'use client'
import { useState } from 'react'

function getUserSafeMessage(message) {
  const normalized = (message || '').toLowerCase()

  if (
    normalized.includes('ssl') ||
    normalized.includes('tls') ||
    normalized.includes('certificate') ||
    normalized.includes('handshake')
  ) {
    return 'Database connection failed. Check deployment environment variables and MongoDB Atlas access settings.'
  }

  return message || 'Failed to save data.'
}

export default function Home() {
  const [collectionName, setCollectionName] = useState('')
  const [collectionImg, setCollectionImg] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  
  const senddata = async () => {
    const payload = {
      collectionName: collectionName.trim(),
      collectionImg: collectionImg.trim(),
      description: description.trim(),
    }

    if (!payload.collectionName || !payload.collectionImg || !payload.description) {
      setStatus('Please fill all fields before submitting.')
      return
    }

    setIsSubmitting(true)
    setStatus('')

    try {
      const res = await fetch('/api/senddata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setStatus(getUserSafeMessage(data.error))
        return
      }

      setCollectionImg('')
      setCollectionName('')
      setDescription('')
      setStatus('Saved successfully.')
    } catch {
      setStatus('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
      <div className="inputs flex flex-col gap-4 mt-6">
        <input
          type="text"
          placeholder="Enter Collection Name"
          className="border p-1 outline-none px-4 w-full rounded"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Collection IMG"
          className="border p-1 outline-none px-4 w-full rounded"
          value={collectionImg}
          onChange={(e) => setCollectionImg(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Description"
          className="border p-1 outline-none px-4 w-full rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          onClick={senddata}
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300 disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      {status && <p className="mt-4 text-sm">{status}</p>}
      <p className="mt-4 text-lg">This is the home page.</p>
    </div>

  );
}
