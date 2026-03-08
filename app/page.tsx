'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    const { error } = await supabase
      .from('waitlist')
      .insert([{ name, email }])

    if (error) {
      if (error.code === '23505') {
        setMessage('That email is already on the waitlist!')
      } else {
        setMessage('Something went wrong. Please try again.')
      }
      setStatus('error')
    } else {
      setMessage('You\'re on the list! We\'ll be in touch.')
      setStatus('success')
      setName('')
      setEmail('')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Join the Waitlist</h1>
        <p className="text-gray-500 mb-6">Be the first to know when we launch.</p>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit}
            disabled={status === 'loading' || !name || !email}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
          </button>
        </div>

        {message && (
          <p className={`mt-4 text-sm ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    </main>
  )
}