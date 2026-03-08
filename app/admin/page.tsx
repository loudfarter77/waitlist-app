import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'

type WaitlistEntry = {
  id: string
  name: string
  email: string
  created_at: string
}

export default async function AdminPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <p>Error loading waitlist.</p>
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Waitlist Dashboard
        </h1>
        <p className="text-gray-500 mb-6">{data.length} signups total</p>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Signed up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((entry: WaitlistEntry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{entry.name}</td>
                  <td className="px-6 py-4 text-gray-500">{entry.email}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.length === 0 && (
            <p className="text-center text-gray-400 py-12">No signups yet.</p>
          )}
        </div>
      </div>
    </main>
  )
}