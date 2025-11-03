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
      
      {/* Vision & Mission Section */}
      <Section 
        title="University of Guelph Rocketry Club" 
        subtitle="Building and giving University of Guelph students fun rocketry experiences. We are working on entering Launch Canada for 2026 and developing a CubeSat project for land surveying research."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold">4</div>
                <div className="text-sm opacity-90">Departments</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm opacity-90">Active Members</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold">2025</div>
                <div className="text-sm opacity-90">Est. Year</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold">∞</div>
                <div className="text-sm opacity-90">Possibilities</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Our Departments</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">💻</span>
                  </div>
                  <span className="font-medium">Software</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">⚡</span>
                  </div>
                  <span className="font-medium">Avionics</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600">🚀</span>
                  </div>
                  <span className="font-medium">Rocketry</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600">💰</span>
                  </div>
                  <span className="font-medium">Finance</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Media Showcase Area */}
          <div className="space-y-6">
            {/* Your actual rocket launch video! - Large Portrait View */}
            <video 
              controls 
              className="w-full h-96 md:h-[500px] lg:h-[600px] rounded-2xl object-cover"
              
            >
              <source src="/Videos/rocket launch.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl h-20 flex items-center justify-center">
                <div className="text-center text-blue-600">
                  <div className="text-xl">📸</div>
                  <div className="text-xs">Gallery</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl h-20 flex items-center justify-center">
                <div className="text-center text-purple-600">
                  <div className="text-xl">🛰️</div>
                  <div className="text-xs">CubeSat</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl h-20 flex items-center justify-center">
                <div className="text-center text-orange-600">
                  <div className="text-xl">🏆</div>
                  <div className="text-xs">Awards</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section 
        title="Featured Projects" 
        subtitle="CubeSat development, rocket launches, and educational programs for UofG students"
        background="gray"
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
        subtitle="Connect with passionate UofG students and build the future of aerospace"
        background="gray"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discord Community */}
          <div className="lg:col-span-2">
            <DiscordAccess />
          </div>
          
          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Connect With Us</h3>
            <div className="space-y-4">
              <a href="https://discord.gg/unfT4UpR" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white text-xl">
                  💬
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Discord</div>
                  <div className="text-sm text-gray-600">Join our community</div>
                </div>
              </a>
              
              <a href="https://www.linkedin.com/company/uofg-rocketry-club/posts/" target="_blank" rel="noopener noreferrer"
                 className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
                  💼
                </div>
                <div>
                  <div className="font-semibold text-gray-900">LinkedIn</div>
                  <div className="text-sm text-gray-600">Professional updates</div>
                </div>
              </a>
              
              <a href="https://www.instagram.com/guelph_rockets" target="_blank" rel="noopener noreferrer"
                 className="flex items-center space-x-3 p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors">
                <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-white text-xl">
                  📸
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Instagram</div>
                  <div className="text-sm text-gray-600">Photos & videos</div>
                </div>
              </a>
            </div>
            
            <div className="pt-4">
              <a href="/join" className="btn-primary w-full text-center block">
                Join the Club 🚀
              </a>
            </div>
          </div>
        </div>
        
        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-3xl mb-3">🛰️</div>
            <h4 className="font-semibold text-gray-900 mb-2">CubeSat Project</h4>
            <p className="text-sm text-gray-600">Building satellites that survey land for real-world applications</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-3xl mb-3">🚀</div>
            <h4 className="font-semibold text-gray-900 mb-2">Rocket Launches</h4>
            <p className="text-sm text-gray-600">Hands-on experience with rocket design and competition launches</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-3xl mb-3">📚</div>
            <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
            <p className="text-sm text-gray-600">Learning programs specifically designed for UofG students</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-3xl mb-3">🤝</div>
            <h4 className="font-semibold text-gray-900 mb-2">Community</h4>
            <p className="text-sm text-gray-600">Building lasting connections with fellow rocketry enthusiasts</p>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default Home