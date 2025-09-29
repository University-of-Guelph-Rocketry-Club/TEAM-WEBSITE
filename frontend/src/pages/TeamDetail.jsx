import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  getTeam, 
  getTeamMembers, 
  getTeamUpdates, 
  createProjectUpdate, 
  joinTeam, 
  leaveTeam 
} from '../lib/api'

const TeamDetail = () => {
  const { teamId } = useParams()
  const { user } = useAuth()
  const [team, setTeam] = useState(null)
  const [members, setMembers] = useState([])
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [updateForm, setUpdateForm] = useState({
    title: '',
    content: '',
    update_type: 'progress',
    progress_change: 0,
    project_id: ''
  })

  useEffect(() => {
    fetchTeamData()
  }, [teamId])

  const fetchTeamData = async () => {
    try {
      const [teamRes, membersRes, updatesRes] = await Promise.all([
        getTeam(teamId),
        getTeamMembers(teamId),
        getTeamUpdates(teamId)
      ])
      
      setTeam(teamRes.data)
      setMembers(membersRes.data)
      setUpdates(updatesRes.data)
    } catch (error) {
      console.error('Failed to fetch team data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinTeam = async () => {
    setActionLoading(true)
    try {
      await joinTeam(teamId)
      await fetchTeamData() // Refresh data
    } catch (error) {
      console.error('Failed to join team:', error)
      alert('Failed to join team. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleLeaveTeam = async () => {
    if (!confirm('Are you sure you want to leave this team?')) return
    
    setActionLoading(true)
    try {
      await leaveTeam(teamId)
      await fetchTeamData() // Refresh data
    } catch (error) {
      console.error('Failed to leave team:', error)
      alert('Failed to leave team. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSubmitUpdate = async (e) => {
    e.preventDefault()
    try {
      await createProjectUpdate({
        ...updateForm,
        project_id: parseInt(updateForm.project_id)
      })
      
      setShowUpdateForm(false)
      setUpdateForm({
        title: '',
        content: '',
        update_type: 'progress',
        progress_change: 0,
        project_id: ''
      })
      
      await fetchTeamData() // Refresh updates
    } catch (error) {
      console.error('Failed to create update:', error)
      alert('Failed to create update. Please try again.')
    }
  }

  const isTeamMember = () => {
    return members.some(member => member.id === user?.id)
  }

  const getUpdateTypeColor = (type) => {
    const colors = {
      progress: 'bg-blue-100 text-blue-800',
      milestone: 'bg-green-100 text-green-800',
      issue: 'bg-red-100 text-red-800',
      announcement: 'bg-purple-100 text-purple-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Not Found</h2>
          <Link to="/teams" className="btn-primary">
            Back to Teams
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <Link to="/teams" className="text-gray-500 hover:text-gray-700 mr-4">
                  ← Back to Teams
                </Link>
                {isTeamMember() && (
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    Member
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{team.name}</h1>
              <p className="text-gray-600 mb-4">{team.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>👥 {members.length} members</span>
                <span>📅 Created {new Date(team.created_at).toLocaleDateString()}</span>
                {team.projects && <span>🚀 {team.projects.length} projects</span>}
              </div>
            </div>

            <div className="flex gap-2">
              {!isTeamMember() ? (
                <button
                  onClick={handleJoinTeam}
                  disabled={actionLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {actionLoading ? 'Joining...' : 'Join Team'}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowUpdateForm(true)}
                    className="btn-primary"
                  >
                    Post Update
                  </button>
                  <button
                    onClick={handleLeaveTeam}
                    disabled={actionLoading}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
                  >
                    {actionLoading ? 'Leaving...' : 'Leave Team'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Updates */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Updates</h2>
              </div>
              <div className="p-6">
                {updates.length > 0 ? (
                  <div className="space-y-6">
                    {updates.map(update => (
                      <div key={update.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-600 font-bold text-sm">
                                {update.author.full_name?.charAt(0) || update.author.username?.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{update.title}</h3>
                              <p className="text-sm text-gray-500">
                                by {update.author.full_name || update.author.username} • 
                                {new Date(update.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUpdateTypeColor(update.update_type)}`}>
                            {update.update_type}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 whitespace-pre-wrap">{update.content}</p>
                        
                        {update.progress_change !== 0 && (
                          <div className="mt-3 text-sm text-gray-600">
                            Progress change: <span className="font-medium">
                              {update.progress_change > 0 ? '+' : ''}{update.progress_change}%
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">📊</div>
                    <p className="text-gray-500">No updates yet. Be the first to share progress!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Members */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-bold text-sm">
                          {member.full_name?.charAt(0) || member.username?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {member.full_name || member.username}
                        </p>
                        <p className="text-sm text-gray-500">
                          {member.program && `${member.program} • `}{member.year}
                        </p>
                      </div>
                      {member.id === team.team_lead_id && (
                        <span className="text-xs bg-rocket-gold bg-opacity-20 text-rocket-gold px-2 py-1 rounded-full">
                          Lead
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Projects */}
            {team.projects && team.projects.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Active Projects</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {team.projects.map(project => (
                      <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <h3 className="font-medium text-gray-900">{project.title}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-500">{project.status}</span>
                          <span className="text-sm text-gray-500">{project.progress_percentage}%</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Update Form Modal */}
        {showUpdateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Post Team Update</h2>
                
                <form onSubmit={handleSubmitUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={updateForm.title}
                      onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Type *
                    </label>
                    <select
                      value={updateForm.update_type}
                      onChange={(e) => setUpdateForm({ ...updateForm, update_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="progress">Progress Update</option>
                      <option value="milestone">Milestone Achieved</option>
                      <option value="issue">Issue/Blocker</option>
                      <option value="announcement">Announcement</option>
                    </select>
                  </div>

                  {team.projects && team.projects.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Related Project
                      </label>
                      <select
                        value={updateForm.project_id}
                        onChange={(e) => setUpdateForm({ ...updateForm, project_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select a project (optional)</option>
                        {team.projects.map(project => (
                          <option key={project.id} value={project.id}>
                            {project.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Progress Change (%)
                    </label>
                    <input
                      type="number"
                      min="-100"
                      max="100"
                      value={updateForm.progress_change}
                      onChange={(e) => setUpdateForm({ ...updateForm, progress_change: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={updateForm.content}
                      onChange={(e) => setUpdateForm({ ...updateForm, content: e.target.value })}
                      placeholder="Describe the update, progress made, issues encountered, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    ></textarea>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 btn-primary"
                    >
                      Post Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUpdateForm(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamDetail