import Section from '../components/Section'
import TeamPhoto from '../components/TeamPhoto'

const Team = () => {
  // Current Executives & Team Leads (2025)
  const executives = [
    {
      id: 1,
      name: 'Darren',
      position: 'Club President',
      image_url: '/Images/darren-photo.jpg' // Add Darren's photo here
    },
    {
      id: 2,
      name: 'Celina',
      position: 'Vice President',
      image_url: '/Images/celina-photo.jpg' // Add Celina's photo here
    },
    {
      id: 3,
      name: 'Rahma',
      position: 'Advisor',
      image_url: '/Images/rahma-photo.jpg' // Add Rahma's photo here
    },
    {
      id: 4,
      name: 'Aban',
      position: 'Finance',
      image_url: '/Images/aban-photo.jpg' // Add Aban's photo here
    },
    {
      id: 5,
      name: 'Marko',
      position: 'Rocketry Team Lead',
      image_url: '/Images/marko-photo.jpg' // Add Marko's photo here
    },
    {
      id: 6,
      name: 'Nick',
      position: 'Software Team Lead',
      image_url: '/Images/IMG_6239.jpeg' // Nick's actual photo
    },
    {
      id: 7,
      name: 'Tylen',
      position: 'Avionics Team Lead',
      image_url: '/Images/tylen-photo.jpg' // Add Tylen's photo here
    },
    {
      id: 8,
      name: 'Yassin',
      position: 'Outreach Lead',
      image_url: '/Images/yassin-photo.jpg' // Add Yassin's photo here
    }
  ]

  return (
    <div className="pt-16">
      {/* Hero Section with Team Photo Area */}
      <Section 
        title="2025 University of Guelph Rocketry Club" 
        subtitle="Building and giving University of Guelph students fun rocketry experiences"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <TeamPhoto executives={executives} />
          </div>
          
          {/* Team Photo/Video Showcase Area */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-100 to-purple-200 rounded-2xl h-64 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <div className="text-5xl mb-4">📸</div>
                <div className="font-semibold text-lg">Team Photos</div>
                <div className="text-sm">Behind the scenes & launch day moments</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-100 to-red-200 rounded-xl h-32 flex items-center justify-center">
                <div className="text-center text-orange-700">
                  <div className="text-2xl mb-1">🎬</div>
                  <div className="text-xs font-medium">Launch Videos</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-blue-200 rounded-xl h-32 flex items-center justify-center">
                <div className="text-center text-green-700">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-xs font-medium">Achievement Gallery</div>
                </div>
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
        title="Department Structure" 
        subtitle="Organized teams working together on complex projects"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card p-6">
            <div className="w-12 h-12 bg-rocket-red rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">⚙️</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Propulsion Team</h3>
            <p className="text-gray-600">
              Design and test rocket motors, fuel systems, and propulsion technologies 
              for maximum performance and safety.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">📐</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Structures Team</h3>
            <p className="text-gray-600">
              Engineer airframes, recovery systems, and mechanical components 
              using advanced materials and manufacturing techniques.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-rocket-gold rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">💻</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Avionics Team</h3>
            <p className="text-gray-600">
              Develop flight computers, sensors, and telemetry systems 
              for navigation, data collection, and mission success.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">🔬</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Research & Development</h3>
            <p className="text-gray-600">
              Explore new technologies, conduct experiments, and push 
              the boundaries of what's possible in student rocketry.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Operations</h3>
            <p className="text-gray-600">
              Manage logistics, safety protocols, competition preparation, 
              and ensure smooth project execution.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">📢</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Outreach</h3>
            <p className="text-gray-600">
              Engage with the community, manage social media, and inspire 
              future engineers through educational programs.
            </p>
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
            <a href="https://discord.gg/rocketryguelph" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Join Discord Community
            </a>
            <a href="mailto:nick.buzali@gmail.com" className="btn-secondary">
              Contact Us
            </a>
          </div>
        </div>
      </Section>
      
      {/* Department Showcase */}
      <Section 
        title="Our Departments" 
        subtitle="Specialized teams working together to reach new heights"
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
      
      {/* Media Showcase Area */}
      <Section 
        title="Explore Our Journey" 
        subtitle="Pictures, videos, and moments from our rocketry adventures"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Large Featured Media Area */}
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-200 rounded-3xl h-80 flex items-center justify-center relative overflow-hidden">
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
            <div className="bg-gradient-to-br from-yellow-100 to-orange-200 rounded-2xl h-36 flex items-center justify-center">
              <div className="text-center text-orange-800">
                <div className="text-3xl mb-2">📷</div>
                <div className="font-semibold text-sm">Competition Gallery</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl h-36 flex items-center justify-center">
              <div className="text-center text-emerald-800">
                <div className="text-3xl mb-2">🛠️</div>
                <div className="font-semibold text-sm">Workshop Moments</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Social Media Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="https://discord.gg/unfT4UpR" target="_blank" rel="noopener noreferrer" 
             className="group bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">💬</div>
              <div>
                <div className="font-bold">Discord Community</div>
                <div className="text-sm opacity-90">Join our active discussions</div>
              </div>
            </div>
          </a>
          
          <a href="https://www.linkedin.com/company/uofg-rocketry-club/posts/" target="_blank" rel="noopener noreferrer"
             className="group bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">💼</div>
              <div>
                <div className="font-bold">LinkedIn Updates</div>
                <div className="text-sm opacity-90">Professional networking</div>
              </div>
            </div>
          </a>
          
          <a href="https://www.instagram.com/guelph_rockets" target="_blank" rel="noopener noreferrer"
             className="group bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl p-6 text-white hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">📸</div>
              <div>
                <div className="font-bold">Instagram Highlights</div>
                <div className="text-sm opacity-90">Behind the scenes content</div>
              </div>
            </div>
          </a>
        </div>
      </Section>
    </div>
  );
}

export default Team;