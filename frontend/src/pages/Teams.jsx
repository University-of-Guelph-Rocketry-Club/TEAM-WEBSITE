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
                <div key={team.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden">
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

        {/* Team Information & Meeting Details Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Team Information & Meetings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Software Team */}
            <div className="bg-white rounded-xl border border-gray-200 border-t-4 border-t-primary-600 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Software Team</h3>
                <p className="text-sm text-gray-500 mt-1">Flight computers & simulations</p>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Meeting Info</h4>
                  <p className="text-sm text-gray-600">Weekly meetings · Time TBD</p>
                  <p className="text-sm text-gray-600">Discord & Lab</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Next Tasks</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Flight computer development</li>
                    <li>Simulation software updates</li>
                    <li>Data logging system</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Team Lead</h4>
                  <p className="text-sm text-gray-600">Nick — Software Lead</p>
                </div>
              </div>
            </div>

            {/* Avionics Team */}
            <div className="bg-white rounded-xl border border-gray-200 border-t-4 border-t-primary-600 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Avionics Team</h3>
                <p className="text-sm text-gray-500 mt-1">Electronics & control systems</p>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Meeting Info</h4>
                  <p className="text-sm text-gray-600">Weekly meetings · Time TBD</p>
                  <p className="text-sm text-gray-600">Discord & Lab</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Next Tasks</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>PCB design & testing</li>
                    <li>Sensor integration</li>
                    <li>Telemetry system setup</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Team Lead</h4>
                  <p className="text-sm text-gray-600">Aban — Avionics Lead</p>
                </div>
              </div>
            </div>

            {/* Rocketry Team */}
            <div className="bg-white rounded-xl border border-gray-200 border-t-4 border-t-primary-600 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Rocketry Team</h3>
                <p className="text-sm text-gray-500 mt-1">Engine design & propulsion</p>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Meeting Info</h4>
                  <p className="text-sm text-gray-600">Weekly meetings · Time TBD</p>
                  <p className="text-sm text-gray-600">Discord & Lab</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Next Tasks</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Hybrid motor design</li>
                    <li>Launch Canada prep</li>
                    <li>Recovery system tests</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Teams Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">All Teams</h2>
          {allTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allTeams.map(team => (
                <div key={team.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden">
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
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No teams available</h3>
              <p className="text-gray-500 mb-6">Teams will appear here once they're created by administrators.</p>
            </div>
          )}
        </div>

        {/* Team Benefits Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why Join a Team?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center group">
              <div className="w-12 h-12 bg-primary-50 border border-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors group-hover:bg-primary-100">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Work on Real Projects</h3>
              <p className="text-gray-600 text-sm">
                Contribute to actual rocket builds, competitions, and research initiatives.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-12 h-12 bg-primary-50 border border-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors group-hover:bg-primary-100">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
              <p className="text-gray-600 text-sm">
                Stay updated on project milestones, deadlines, and team achievements.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-12 h-12 bg-primary-50 border border-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors group-hover:bg-primary-100">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
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