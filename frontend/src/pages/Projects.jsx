import { useState, useEffect } from 'react'
import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'
import Loading from '../components/Loading'

const Projects = () => {
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  // Current projects focusing on general networking and launch activities
  const projects = [
    {
      id: 1,
      title: 'Hybrid Rocket Development',
      description: 'Designing and building an advanced hybrid rocket propulsion system. This project combines liquid oxidizer with solid fuel to create a safer, more controllable rocket engine for high-altitude flights.',
      status: 'active',
      category: 'Propulsion',
      image_url: '',
      technologies: ['Hybrid Propulsion', 'CAD Design', 'Fluid Dynamics', 'Control Systems'],
      start_date: '2024-09-01',
      target_launch: 'Launch Canada 2026'
    },
    {
      id: 2,
      title: 'CubeSat Development',
      description: 'Building a CubeSat satellite for land surveying and remote sensing applications. This miniature satellite will demonstrate our capability in space systems engineering and data collection.',
      status: 'active',
      category: 'Space Systems',
      image_url: '',
      technologies: ['Satellite Design', 'Remote Sensing', 'Communication Systems', 'Orbital Mechanics'],
      start_date: '2024-10-01'
    },
    {
      id: 3,
      title: 'Competition Rocket Build',
      description: 'Designing and constructing a high-performance competition rocket for Launch Canada 2026. Focused on achieving maximum altitude while maintaining stability and safe recovery.',
      status: 'active',
      category: 'Competition',
      image_url: '',
      technologies: ['Aerodynamics', 'Recovery Systems', 'Telemetry', 'Composite Materials'],
      start_date: '2024-11-01',
      competition: 'Launch Canada 2026'
    }
  ]

  const filteredProjects = projects.filter(project => 
    filter === 'all' || project.status === filter
  )

  const filterCounts = {
    all: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    planned: projects.filter(p => p.status === 'planned').length,
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="pt-16 page-transition">
      <Section 
        title="Our Projects" 
        subtitle="Advanced rocketry systems, satellite development, and competition preparations"
      >
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.entries({
            all: 'All Projects',
            active: 'Active',
            completed: 'Completed',
            planned: 'Planned'
          }).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {label} ({filterCounts[key]})
            </button>
          ))}
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl">No projects found</div>
            <p className="text-gray-500 mt-2">
              {filter === 'all' 
                ? 'Check back soon for our latest projects!' 
                : `No ${filter} projects at the moment.`}
            </p>
          </div>
        )}
      </Section>

      <Section 
        title="Focus Areas" 
        subtitle="What we're working on in the rocketry community"
        background="gray"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card p-6">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">🤝</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Networking</h3>
            <p className="text-gray-600">
              Building connections with rocketry enthusiasts, aerospace professionals, 
              and other university clubs across Canada.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-rocket-red rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Launch Operations</h3>
            <p className="text-gray-600">
              Participating in collaborative launches with other rocketry clubs 
              to share knowledge and best practices.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-rocket-gold rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Knowledge Exchange</h3>
            <p className="text-gray-600">
              Sharing experiences, learning from other teams, and contributing 
              to the broader rocketry community.
            </p>
          </div>
        </div>
      </Section>

      <Section 
        title="Future Initiatives" 
        subtitle="What's coming next"
      >
        <div className="text-center space-y-6">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're continuing to expand our network within the Canadian rocketry community 
            and plan more collaborative events with other university clubs and aerospace organizations.
          </p>
          
          <div className="bg-gradient-to-r from-primary-50 to-rocket-red-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Involved</h3>
            <p className="text-gray-600 mb-6">
              Interested in joining our networking initiatives or collaborating on future projects? 
              Connect with us through Discord or reach out directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://discord.gg/hZjQxvue" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Join Our Community
              </a>
              <a href="mailto:rocketry@uoguelph.ca" className="btn-secondary">
                Contact Our Team
              </a>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default Projects