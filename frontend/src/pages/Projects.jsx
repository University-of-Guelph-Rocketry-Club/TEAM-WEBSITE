import { useState } from 'react'
import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'

const Projects = () => {
  const [filter, setFilter] = useState('all')

  // Current projects focusing on general networking and launch activities
  const projects = [
    {
      id: 1,
      title: 'Cambridge Rocketry Club Launch #1',
      description: 'Collaborative launch event with Cambridge Rocketry Club, focusing on networking and sharing knowledge between rocketry enthusiasts from different universities.',
      status: 'completed',
      category: 'Networking',
      image_url: '', // Will add pictures later
      technologies: ['Launch Operations', 'Inter-University Collaboration', 'Safety Protocols'],
      start_date: '2024-10-01',
      completion_date: '2024-10-15'
    },
    {
      id: 2,
      title: 'Cambridge Rocketry Club Launch #2',
      description: 'Second collaborative launch with Cambridge Rocketry Club, continuing our partnership and expanding our network within the Canadian rocketry community.',
      status: 'completed',
      category: 'Networking',
      image_url: '', // Will add pictures later
      technologies: ['Launch Operations', 'Team Building', 'Knowledge Exchange'],
      start_date: '2024-11-01',
      completion_date: '2024-11-15'
    },
    {
      id: 3,
      title: 'Aerospace Networking Initiative',
      description: 'General networking activities with individuals and organizations interested in rocketry and aerospace engineering across Canada.',
      status: 'active',
      category: 'Outreach',
      image_url: '',
      technologies: ['Community Building', 'Professional Networking', 'Educational Outreach'],
      start_date: '2024-09-01'
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

  return (
    <div className="pt-16">
      <Section 
        title="Our Projects" 
        subtitle="Collaborative launches and networking initiatives in the rocketry community"
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
              <a href="https://discord.gg/rocketryguelph" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Join Our Community
              </a>
              <a href="mailto:nick.buzali@gmail.com" className="btn-secondary">
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