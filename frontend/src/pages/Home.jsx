import Hero from '../components/Hero'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="page-transition">
      <Hero />
      
      {/* Departments Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Engineering Teams</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Four specialized departments working together to design, build, and launch aerospace systems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Software', desc: 'Flight computers, telemetry, ground stations', icon: '{ }', color: 'blue' },
              { name: 'Avionics', desc: 'Electronics, sensors, control systems', icon: '⚡', color: 'green' },
              { name: 'Rocketry', desc: 'Propulsion, structures, aerodynamics', icon: '△', color: 'red' },
              { name: 'Finance', desc: 'Sponsorship, budgeting, operations', icon: '$', color: 'amber' },
            ].map((dept) => (
              <div key={dept.name} className="group p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
                <div className={`w-12 h-12 rounded-lg bg-${dept.color}-100 text-${dept.color}-600 flex items-center justify-center text-xl font-mono mb-4`}>
                  {dept.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{dept.name}</h3>
                <p className="text-sm text-slate-600">{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Projects */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Active Projects</h2>
              <p className="text-slate-600">What we're building right now</p>
            </div>
            <Link to="/projects" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View all →
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Hybrid Rocket */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  In Development
                </span>
                <span className="text-sm text-slate-500">2025-2026</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Hybrid Rocket Propulsion</h3>
              <p className="text-slate-600 mb-6">
                Designing a hybrid rocket motor combining solid fuel with liquid oxidizer for improved safety and controllability. Target: Launch Canada 2026.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Propulsion', 'CAD', 'Fluid Dynamics', 'Testing'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CubeSat */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  Research Phase
                </span>
                <span className="text-sm text-slate-500">Target: 2028</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">CubeSat Development</h3>
              <p className="text-slate-600 mb-6">
                Building a miniature satellite for land surveying and remote sensing applications. Long-term goal for CubeSat competition.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Satellite Design', 'Remote Sensing', 'Comms', 'Orbital Mechanics'].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Launch Video Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">See Us In Action</h2>
          </div>
          <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden">
            <video 
              controls 
              className="w-full h-full object-cover"
            >
              <source src="/Videos/rocket launch.mp4" type="video/mp4" />
              Your browser does not support video.
            </video>
          </div>
        </div>
      </section>

      {/* Announcements - Cleaner */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Latest Updates</h2>
            <p className="text-slate-400">News and announcements from the team</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Conference */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="text-blue-400 text-sm font-mono mb-3">MAR 7-8, 2026</div>
              <h3 className="text-lg font-semibold mb-2">CubeSat Conference</h3>
              <p className="text-slate-400 text-sm mb-4">
                Canadian CubeSat Launch Conference at Concordia University, Montreal. CUBICS teams showcasing satellites going to orbit.
              </p>
              <a 
                href="https://ccc.seds.ca/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 text-sm hover:text-blue-300"
              >
                Learn more →
              </a>
            </div>

            {/* Kits Arrived */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="text-green-400 text-sm font-mono mb-3">NEW</div>
              <h3 className="text-lg font-semibold mb-2">Hardware Received</h3>
              <p className="text-slate-400 text-sm mb-4">
                Avionics and Rocketry departments have received their kits and electronics. Builds starting soon.
              </p>
              <a 
                href="https://discord.gg/VRZE2923" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 text-sm hover:text-blue-300"
              >
                Join Discord →
              </a>
            </div>

            {/* Software Update */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="text-purple-400 text-sm font-mono mb-3">ONGOING</div>
              <h3 className="text-lg font-semibold mb-2">Software Suite</h3>
              <p className="text-slate-400 text-sm mb-4">
                Building comprehensive rocketry software: flight computers, telemetry, simulations, and ground station.
              </p>
              <a 
                href="https://discord.gg/VRZE2923" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 text-sm hover:text-blue-300"
              >
                Contribute →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Roadmap</h2>
            <p className="text-slate-600">Our path to competition and beyond</p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="flex-1 max-w-xs">
              <div className="text-4xl font-bold text-blue-600 mb-2">2026</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Launch Canada</h3>
              <p className="text-slate-600 text-sm">First competition entry with hybrid rocket system</p>
            </div>
            <div className="hidden md:block w-px bg-slate-200"></div>
            <div className="flex-1 max-w-xs">
              <div className="text-4xl font-bold text-slate-400 mb-2">2028</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">CubeSat Competition</h3>
              <p className="text-slate-600 text-sm">Land surveying satellite in orbit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to build something?</h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Join 50+ UofG students designing and building aerospace systems. No experience required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://discord.gg/VRZE2923" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Join Discord
            </a>
            <a 
              href="mailto:rocketry@uoguelph.ca"
              className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              Email Us
            </a>
          </div>
          
          {/* Social links */}
          <div className="flex justify-center gap-6 mt-8">
            <a href="https://www.instagram.com/guelph_rockets" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-700">Instagram</a>
            <a href="https://www.linkedin.com/company/uofg-rocketry-club/posts/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-700">LinkedIn</a>
            <a href="https://discord.gg/VRZE2923" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-700">Discord</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
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