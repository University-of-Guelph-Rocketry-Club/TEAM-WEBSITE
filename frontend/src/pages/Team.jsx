import { useState, useEffect } from 'react'
import Section from '../components/Section'
import TeamPhoto from '../components/TeamPhoto'
import Loading from '../components/Loading'

const Team = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  // Current Executives & Team Leads (2025)
  const executives = [
    {
      id: 1,
      name: 'Darren',
      position: 'Club President',
      image_url: '/Images/darren.jpg'
    },
    {
      id: 2,
      name: 'Marko',
      position: 'VP Operations',
      image_url: '/Images/rocketrylogo.png'
    },
    {
      id: 3,
      name: 'Rachel',
      position: 'VP Regulatory',
      image_url: '/Images/Rachel.jpg'
    },
    {
      id: 4,
      name: 'Julian',
      position: 'Finance',
      image_url: '/Images/Julian.png'
    },
    {
      id: 5,
      name: 'Juliet',
      position: 'Rocketry Team Lead',
      image_url: '/Images/rocketrylogo.png'
    },
    {
      id: 6,
      name: 'Nick',
      position: 'Software Team Lead',
      image_url: '/Images/IMG_6239.jpeg'
    },
    {
      id: 7,
      name: 'Aban',
      position: 'Avionics Team Lead',
      image_url: '/Images/aban.png'
    },
    {
      id: 8,
      name: 'Yassin',
      position: 'Outreach Lead',
      image_url: '/Images/rocketrylogo.png'
    }
  ]

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="pt-16 page-transition">
      {/* Hero Section with Team Photo Area */}
      <Section 
        title="2025 University of Guelph Rocketry Club" 
        subtitle="Building and giving University of Guelph students fun rocketry experiences"
      >
        {/* Executive Team Grid */}
        <TeamPhoto executives={executives} />
        
        {/* Media Gallery Section - Full Width Below Team */}
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
        title="Our Mission" 
        subtitle="What drives us to reach for the stars"
        background="gray"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 Vision</h3>
              <p className="text-gray-600">
                To be Canada's leading student rocketry organization, fostering innovation, 
                education, and excellence in aerospace engineering while inspiring the next 
                generation of space exploration pioneers.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🚀 Mission</h3>
              <p className="text-gray-600">
                We provide hands-on experience in rocket design, manufacturing, and testing 
                while competing at the highest levels of student rocketry. Through mentorship, 
                outreach, and collaboration, we prepare students for successful careers in 
                aerospace and engineering.
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
      </Section>

      <Section 
        title="Connect With Us" 
        subtitle="Join our community and network with fellow rocketry enthusiasts"
      >
        <div className="text-center space-y-6">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with us through Discord to join our community of rocketry and aerospace enthusiasts. 
            We focus on networking with others interested in rocketry and aerospace engineering.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://discord.gg/VRZE2923" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Join Discord Community
            </a>
            <a href="mailto:rocketry@uoguelph.ca" className="btn-secondary">
              Contact Us
            </a>
          </div>
        </div>
      </Section>
      
      {/* Department Showcase */}
      <Section 
        title="Our Departments" 
        subtitle="Specialized teams working together to reach new heights"
        background="gray"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-4 group">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-20 h-20 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">💻</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Software</h3>
              <p className="text-gray-600 text-sm">Flight computers & simulations</p>
            </div>
          </div>
          
          <div className="text-center space-y-4 group">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 w-20 h-20 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">⚡</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Avionics</h3>
              <p className="text-gray-600 text-sm">Electronics & control systems</p>
            </div>
          </div>
          
          <div className="text-center space-y-4 group">
            <div className="bg-gradient-to-br from-green-500 to-teal-600 w-20 h-20 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">🚀</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Rocketry</h3>
              <p className="text-gray-600 text-sm">Engine design & propulsion</p>
            </div>
          </div>
          
          <div className="text-center space-y-4 group">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-20 h-20 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">💰</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Finance</h3>
              <p className="text-gray-600 text-sm">Funding & resource management</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default Team;