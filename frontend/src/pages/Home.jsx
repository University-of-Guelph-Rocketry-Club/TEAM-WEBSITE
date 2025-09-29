import Hero from '../components/Hero'
import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'
import DiscordAccess from '../components/DiscordAccess'
import { useState, useEffect } from 'react'
import { getProjects, getNews } from '../lib/api'

const Home = () => {
  const [projects, setProjects] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, newsRes] = await Promise.all([
          getProjects(),
          getNews()
        ])
        setProjects(projectsRes.data.slice(0, 3)) // Show only 3 featured projects
        setNews(newsRes.data.slice(0, 3)) // Show only 3 latest news
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <Hero />
      
      <Section 
        title="Featured Projects" 
        subtitle="Discover our latest rocketry innovations and engineering achievements"
      >
        {loading ? (
          <div className="text-center">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <a href="/projects" className="btn-primary">
            View All Projects
          </a>
        </div>
      </Section>

      <Section 
        title="Latest News" 
        subtitle="Stay updated with our competitions, achievements, and club activities"
        background="gray"
      >
        {loading ? (
          <div className="text-center">Loading news...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map(article => (
              <div key={article.id} className="card">
                {article.image_url && (
                  <div className="aspect-video bg-gray-200">
                    <img 
                      src={article.image_url} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{article.title}</h3>
                  <p className="text-gray-600 line-clamp-3">
                    {article.content.substring(0, 150)}...
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    {new Date(article.published_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section 
        title="Join Our Community" 
        subtitle="Connect with passionate students and be part of the future of aerospace"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <DiscordAccess />
          
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Launch Your Future? 🚀
              </h3>
              <p className="text-gray-600 mb-6">
                Whether you're an engineering student, aerospace enthusiast, or just curious about rocketry, 
                there's a place for you in our club. Join us for hands-on projects, competitions, 
                and networking opportunities.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700">Hands-on rocket building experience</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700">National and international competitions</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700">Networking with industry professionals</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">✓</span>
                </div>
                <span className="text-gray-700">Leadership and project management skills</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/join" className="btn-primary text-center">
                Apply to Join
              </a>
              <a href="/team" className="btn-secondary text-center">
                Meet the Team
              </a>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default Home