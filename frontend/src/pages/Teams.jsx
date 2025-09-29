import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getTeams, getMyTeams, joinTeam, leaveTeam } from '../lib/api'

const Teams = () => {
  const { user } = useAuth()
  const [allTeams, setAllTeams] = useState([])
  const [myTeams, setMyTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const [allTeamsRes, myTeamsRes] = await Promise.all([
          getTeams(),
          getMyTeams()
        ])
        setAllTeams(allTeamsRes.data)
        setMyTeams(myTeamsRes.data)
      } catch (error) {
        console.error('Failed to fetch teams:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  const handleJoinTeam = async (teamId) => {
    setActionLoading(prev => ({ ...prev, [teamId]: true }))
    try {
      await joinTeam(teamId)
      // Refresh teams
      const [allTeamsRes, myTeamsRes] = await Promise.all([
        getTeams(),
        getMyTeams()
      ])
      setAllTeams(allTeamsRes.data)
      setMyTeams(myTeamsRes.data)
    } catch (error) {
      console.error('Failed to join team:', error)
      alert('Failed to join team. Please try again.')
    } finally {
      setActionLoading(prev => ({ ...prev, [teamId]: false }))
    }
  }

  const handleLeaveTeam = async (teamId) => {
    if (!confirm('Are you sure you want to leave this team?')) return
    
    setActionLoading(prev => ({ ...prev, [teamId]: true }))
    try {
      await leaveTeam(teamId)
      // Refresh teams
      const [allTeamsRes, myTeamsRes] = await Promise.all([
        getTeams(),
        getMyTeams()
      ])
      setAllTeams(allTeamsRes.data)
      setMyTeams(myTeamsRes.data)
    } catch (error) {
      console.error('Failed to leave team:', error)
      alert('Failed to leave team. Please try again.')
    } finally {
      setActionLoading(prev => ({ ...prev, [teamId]: false }))
    }
  }

  const isTeamMember = (teamId) => {
    return myTeams.some(team => team.id === teamId)
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-2">
            Join teams to collaborate on exciting rocketry projects and competitions.
          </p>
        </div>

        {/* My Teams Section */}
        {myTeams.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTeams.map(team => (
                <div key={team.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Member
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{team.description}</p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>{team.members?.length || 0} members</span>
                      <span>Created {new Date(team.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/teams/${team.id}`}
                        className="flex-1 bg-primary-600 text-white text-center py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleLeaveTeam(team.id)}
                        disabled={actionLoading[team.id]}
                        className="px-3 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {actionLoading[team.id] ? '...' : 'Leave'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Teams Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">All Teams</h2>
          {allTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allTeams.map(team => (
                <div key={team.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                      {isTeamMember(team.id) && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Member
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{team.description}</p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>{team.members?.length || 0} members</span>
                      <span>Created {new Date(team.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/teams/${team.id}`}
                        className="flex-1 bg-gray-100 text-gray-900 text-center py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        View Details
                      </Link>
                      {!isTeamMember(team.id) ? (
                        <button
                          onClick={() => handleJoinTeam(team.id)}
                          disabled={actionLoading[team.id]}
                          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                          {actionLoading[team.id] ? 'Joining...' : 'Join'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleLeaveTeam(team.id)}
                          disabled={actionLoading[team.id]}
                          className="px-3 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {actionLoading[team.id] ? '...' : 'Leave'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No teams available</h3>
              <p className="text-gray-500 mb-6">Teams will appear here once they're created by administrators.</p>
            </div>
          )}
        </div>

        {/* Team Benefits Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why Join a Team?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Work on Real Projects</h3>
              <p className="text-gray-600 text-sm">
                Contribute to actual rocket builds, competitions, and research initiatives.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
              <p className="text-gray-600 text-sm">
                Stay updated on project milestones, deadlines, and team achievements.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Collaborate & Learn</h3>
              <p className="text-gray-600 text-sm">
                Work with passionate students and learn from experienced team leaders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Teams