import Hero from '../components/Hero'
import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'
import DiscordAccess from '../components/DiscordAccess'
import Loading from '../components/Loading'
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

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="page-transition">
      <Hero />
      
      {/* Vision & Mission Section with Tech Grid */}
      <div className="tech-grid-bg">
        <Section 
          title="University of Guelph Rocketry Club" 
          subtitle="Building and giving University of Guelph students fun rocketry experiences. We are working on entering Launch Canada for 2026 and developing a CubeSat project for land surveying research."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white glow-card">
                  <div className="text-3xl font-bold">4</div>
                  <div className="text-sm opacity-90">Departments</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-xl p-6 text-white glow-card">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm opacity-90">Active Members</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white glow-card">
                  <div className="text-3xl font-bold">2025</div>
                  <div className="text-sm opacity-90">Est. Year</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white glow-card">
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
      </div>

      {/* Current Project Highlight - Hybrid Rocket */}
      <Section 
        title="🚀 Current Focus: Hybrid Rocket Development" 
        subtitle="Our team is actively designing and building a hybrid rocket propulsion system"
        background="gray"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Hybrid Rockets?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span><strong>Safety:</strong> Can be shut down mid-flight if needed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span><strong>Efficiency:</strong> Combines benefits of solid and liquid systems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span><strong>Innovation:</strong> Cutting-edge aerospace technology</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span><strong>Learning:</strong> Hands-on experience with advanced propulsion</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-3xl">
                  🔧
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">In Development</h4>
                  <p className="text-gray-600">2025-2026 Project Timeline</p>
                </div>
              </div>
              <p className="text-gray-700">
                Our rocketry team is working on a hybrid rocket motor that uses a solid fuel grain 
                with a liquid or gaseous oxidizer. This project involves propulsion engineering, 
                structural design, safety systems, and extensive testing protocols.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">⚙️</div>
                <div className="font-semibold text-gray-900">Design Phase</div>
                <div className="text-sm text-gray-600">CAD & Simulations</div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">🧪</div>
                <div className="font-semibold text-gray-900">Testing</div>
                <div className="text-sm text-gray-600">Component Validation</div>
              </div>
            </div>
            
            <div className="text-center">
              <a href="https://discord.gg/hZjQxvue" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
                Join the Hybrid Rocket Team
              </a>
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

      {/* Announcements & Updates */}
      <Section 
        title="📢 Announcements & Updates" 
        subtitle="What's happening with the UofG Rocketry Club"
        background="gray"
      >
        <div className="space-y-8">
          {/* Kits Received */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 border-l-4 border-green-500">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">📦</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Avionics & Rocketry Kits Have Arrived!</h3>
                <p className="text-gray-700 mb-3">
                  Great news! Our Avionics and Rocketry departments have received their kits and electronics. 
                  Stay tuned for exciting builds and projects coming soon!
                </p>
                <a 
                  href="https://discord.gg/hZjQxvue" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-700 font-semibold hover:text-green-800"
                >
                  💬 Join our Discord to stay updated →
                </a>
              </div>
            </div>
          </div>

          {/* Software Team Update */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-100 rounded-2xl p-6 border-l-4 border-cyan-500">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">💻</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Software Team: Building Our Rocketry Suite</h3>
                <p className="text-gray-700 mb-3">
                  The Software team is continuing to integrate and build our comprehensive rocketry software suite. 
                  We're working closely alongside the Avionics and Rocketry teams to create the right solutions 
                  for flight computers, telemetry, simulations, and ground station software.
                </p>
                <a 
                  href="https://discord.gg/hZjQxvue" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-cyan-700 font-semibold hover:text-cyan-800"
                >
                  💬 Join Software on Discord →
                </a>
              </div>
            </div>
          </div>

          {/* CubeSat Conference */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border-l-4 border-blue-500">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">🛰️</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Canadian CubeSat Launch Conference 2026</h3>
                <p className="text-gray-700 mb-3">
                  <strong>March 7-8, 2026</strong> • John Molson School of Business, Concordia University, Montreal
                </p>
                <p className="text-gray-700 mb-4">
                  The conference will showcase the 9 teams selected for the CUBICS competition who are getting 
                  their satellites sent to orbit! There will be talks by industry insiders, Q&A sessions, 
                  fireside chats, and massive networking opportunities.
                </p>
                <div className="bg-white/50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Get Involved:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span><strong>Submit a Presentation:</strong> Share your work via slideshow or poster</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span><strong>Propose a Booth:</strong> Showcase what we've built or are planning for our CubeSat project</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://ccc.seds.ca/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary text-sm"
                  >
                    Conference Info
                  </a>
                  <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSe8OTi9xZueqUOuSKm1J8Ng3VArv-SYWSUGDzVmdQudUJLmEg/viewform" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm"
                  >
                    Submit Presentation
                  </a>
                  <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSde0VBRsltWAVnbfGDcYocL2p73DgWpIeD0w6GfcX2EoQZGuw/viewform" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm"
                  >
                    Propose a Booth
                  </a>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  💰 Ticket price: $75 (includes breakfast and light lunch for both days). 
                  Discounted rates may be available, and university reimbursement may be possible. 
                  Contact us if you're interested in attending!
                </p>
              </div>
            </div>
          </div>

          {/* Future Plans */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-100 rounded-2xl p-6 border-l-4 border-purple-500">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">🎯</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Our Roadmap</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">🚀</span>
                      <span className="font-bold text-gray-900">Launch Canada 2026</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      We're preparing to compete at Launch Canada 2026! Stay tuned for updates on our rocket development.
                    </p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">🛰️</span>
                      <span className="font-bold text-gray-900">CubeSat Competition 2028</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Our long-term goal is to compete in the CubeSat competition by 2028 with our land surveying satellite project.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center bg-gray-50 rounded-2xl p-6">
            <p className="text-gray-700 mb-4">
              Have questions or want to get involved? Reach out to us!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://discord.gg/hZjQxvue" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Join Discord
              </a>
              <a href="mailto:rocketry@uoguelph.ca" className="btn-secondary">
                Email Us
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* About Us Section - Our Journey & Mission */}
      <Section 
        title="About Us" 
        subtitle="Our mission, journey, and the memories we've created together"
        background="gray"
      >
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 Our Mission</h3>
              <p className="text-gray-600">
                We provide hands-on experience in rocket design, manufacturing, and testing 
                while competing at the highest levels of student rocketry. Through mentorship, 
                outreach, and collaboration, we prepare University of Guelph students for successful careers in 
                aerospace and engineering.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🚀 Our Vision</h3>
              <p className="text-gray-600">
                To be Canada's leading student rocketry organization, fostering innovation, 
                education, and excellence in aerospace engineering while inspiring the next 
                generation of space exploration pioneers at the University of Guelph.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Values</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">💡</span>
                </div>
                <div>
                  <div className="font-semibold">Innovation</div>
                  <div className="text-gray-600 text-sm">Pushing boundaries through creative engineering</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">🤝</span>
                </div>
                <div>
                  <div className="font-semibold">Collaboration</div>
                  <div className="text-gray-600 text-sm">Working together toward common goals</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">🎓</span>
                </div>
                <div>
                  <div className="font-semibold">Learning</div>
                  <div className="text-gray-600 text-sm">Continuous growth and skill development</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">⭐</span>
                </div>
                <div>
                  <div className="font-semibold">Excellence</div>
                  <div className="text-gray-600 text-sm">Striving for the highest standards</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Explore Our Journey - Media Showcase */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Explore Our Journey</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pictures, videos, and moments from our rocketry adventures
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Large Featured Media Area */}
            <div className="md:col-span-2">
              <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-200 rounded-3xl h-80 flex items-center justify-center relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                <div className="text-center text-gray-700 z-10">
                  <div className="text-6xl mb-4">🎥</div>
                  <div className="font-bold text-2xl mb-2">Featured Launch Video</div>
                  <div className="text-sm opacity-80">Watch our latest rocket reach for the stars</div>
                </div>
              </div>
            </div>
            
            {/* Side Media Grid */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-200 rounded-2xl h-36 flex items-center justify-center hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="text-center text-orange-800">
                  <div className="text-3xl mb-2">📷</div>
                  <div className="font-semibold text-sm">Competition Gallery</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl h-36 flex items-center justify-center hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="text-center text-emerald-800">
                  <div className="text-3xl mb-2">🛠️</div>
                  <div className="font-semibold text-sm">Workshop Moments</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Memories & Highlights */}
        <div className="mt-16 space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">📸 Team Memories & Highlights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Team Photos - Larger */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-200 rounded-2xl h-72 flex items-center justify-center hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="text-center text-gray-700">
                <div className="text-6xl mb-4">📸</div>
                <div className="font-bold text-xl mb-2">Team Photos</div>
                <div className="text-sm px-4">Behind the scenes & launch day moments</div>
              </div>
            </div>
            
            {/* Launch Videos - Larger */}
            <div className="bg-gradient-to-br from-orange-100 to-red-200 rounded-2xl h-72 flex items-center justify-center hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="text-center text-orange-700">
                <div className="text-6xl mb-4">🎬</div>
                <div className="font-bold text-xl mb-2">Launch Videos</div>
                <div className="text-sm px-4">Rocket launches & test flights</div>
              </div>
            </div>
            
            {/* Achievement Gallery - Larger */}
            <div className="bg-gradient-to-br from-green-100 to-blue-200 rounded-2xl h-72 flex items-center justify-center hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="text-center text-green-700">
                <div className="text-6xl mb-4">🏆</div>
                <div className="font-bold text-xl mb-2">Achievement Gallery</div>
                <div className="text-sm px-4">Competitions & milestones</div>
              </div>
            </div>
          </div>
        </div>
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
              <a href="https://discord.gg/hZjQxvue" target="_blank" rel="noopener noreferrer" 
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