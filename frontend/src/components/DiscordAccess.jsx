import { useState, useEffect } from 'react'
import { getDiscordInvite } from '../lib/api'

const DiscordAccess = () => {
  const [inviteUrl, setInviteUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const response = await getDiscordInvite()
        setInviteUrl(response.data.invite_url)
      } catch (error) {
        console.error('Failed to fetch Discord invite:', error)
        // Fallback to a default invite link
        setInviteUrl('https://discord.gg/M9hY4n44F')
      } finally {
        setLoading(false)
      }
    }

    fetchInvite()
  }, [])

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-8 text-white text-center">
      <div className="mb-6">
        <div className="text-4xl mb-4">💬</div>
        <h3 className="text-2xl font-bold mb-2">Join Our Discord Community</h3>
        <p className="text-indigo-100">
          Connect with fellow rocket enthusiasts, get real-time updates, 
          and participate in discussions about our latest projects!
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold">Active Members</div>
              <div className="text-indigo-200">50+</div>
            </div>
            <div>
              <div className="font-semibold">Channels</div>
              <div className="text-indigo-200">15+</div>
            </div>
            <div>
              <div className="font-semibold">Projects</div>
              <div className="text-indigo-200">Discussion</div>
            </div>
            <div>
              <div className="font-semibold">Events</div>
              <div className="text-indigo-200">Notifications</div>
            </div>
          </div>
        </div>

        {loading ? (
          <button disabled className="bg-white bg-opacity-20 text-white font-bold py-3 px-8 rounded-lg">
            Loading...
          </button>
        ) : (
          <a
            href={inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-indigo-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors duration-300 transform hover:scale-105"
          >
            Join Discord Server →
          </a>
        )}

        <p className="text-indigo-200 text-sm">
          New to Discord? It's free! Create an account at{' '}
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="underline">
            discord.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default DiscordAccess