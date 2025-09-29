import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getMyTeams, getMyUpdates } from '../lib/api'

const Dashboard = () => {
  const { user } = useAuth()
  const [teams, setTeams] = useState([])
  const [recentUpdates, setRecentUpdates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [teamsRes, updatesRes] = await Promise.all([
          getMyTeams(),
          getMyUpdates()
        ])
        setTeams(teamsRes.data)
        setRecentUpdates(updatesRes.data.slice(0, 5)) // Show only recent 5 updates
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.full_name || user?.username}! 🚀
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your teams and projects.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
                <p className="text-gray-600">My Teams</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{recentUpdates.length}</p>
                <p className="text-gray-600">Recent Updates</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-rocket-gold bg-opacity-20 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {teams.reduce((acc, team) => acc + (team.projects?.length || 0), 0)}
                </p>
                <p className="text-gray-600">Active Projects</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Teams */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">My Teams</h2>
                <Link to="/teams" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                  View All →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {teams.length > 0 ? (
                <div className="space-y-4">
                  {teams.map(team => (
                    <Link
                      key={team.id}
                      to={`/teams/${team.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{team.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">{team.description}</p>
                          <p className="text-gray-500 text-xs mt-2">
                            {team.members?.length || 0} members
                          </p>
                        </div>
                        <span className="text-primary-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">👥</div>
                  <p className="text-gray-500 mb-4">You're not part of any teams yet.</p>
                  <Link to="/teams" className="btn-primary">
                    Browse Teams
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Recent Updates</h2>
                <Link to="/updates" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                  View All →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentUpdates.length > 0 ? (
                <div className="space-y-4">
                  {recentUpdates.map(update => (
                    <div key={update.id} className="border-l-4 border-primary-400 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{update.title}</h4>
                          <p className="text-gray-600 text-xs mt-1 line-clamp-2">{update.content}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded-full">
                              {update.update_type}
                            </span>
                            <span className="ml-2">
                              {new Date(update.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">📊</div>
                  <p className="text-gray-500">No recent updates from your teams.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/teams"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors"
            >
              <div className="p-2 bg-primary-100 rounded-lg mr-4">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Browse Teams</h3>
                <p className="text-gray-600 text-sm">Join existing teams or create new ones</p>
              </div>
            </Link>

            <Link
              to="/projects"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors"
            >
              <div className="p-2 bg-primary-100 rounded-lg mr-4">
                <span className="text-xl">🚀</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">View Projects</h3>
                <p className="text-gray-600 text-sm">Check out ongoing and completed projects</p>
              </div>
            </Link>

            <button
              onClick={() => {
                // This will be handled by the chatbot component
                window.dispatchEvent(new CustomEvent('openChatbot'))
              }}
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors"
            >
              <div className="p-2 bg-primary-100 rounded-lg mr-4">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Ask AI Assistant</h3>
                <p className="text-gray-600 text-sm">Get help with rocketry questions</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard