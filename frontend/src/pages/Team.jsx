import Section from '../components/Section'
import TeamPhoto from '../components/TeamPhoto'

const Team = () => {
  // Current Executives & Team Leads (2025)
  const executives = [
    {
      id: 1,
      name: 'Darren',
      position: 'Club President',
      bio: 'Leading the University of Guelph Rocketry Club with passion for aerospace engineering and innovation.'
    },
    {
      id: 2,
      name: 'Celina',
      position: 'Vice President',
      bio: 'Supporting club operations and driving strategic initiatives for our rocketry projects.'
    },
    {
      id: 3,
      name: 'Rahma',
      position: 'Advisor',
      bio: 'Providing guidance and mentorship to help the club achieve its goals and maintain excellence.'
    },
    {
      id: 4,
      name: 'Aban',
      position: 'Finance',
      bio: 'Managing club finances and ensuring sustainable funding for our ambitious projects.'
    },
    {
      id: 5,
      name: 'Marko',
      position: 'Rocketry Team Lead',
      bio: 'Leading the design and development of our competition rockets and propulsion systems.'
    },
    {
      id: 6,
      name: 'Nick',
      position: 'Software Team Lead',
      bio: 'Developing software systems for flight computers, data analysis, and mission control.'
    },
    {
      id: 7,
      name: 'Tylen',
      position: 'Avionics Team Lead',
      bio: 'Designing and implementing electronic systems for navigation and telemetry.'
    },
    {
      id: 8,
      name: 'Yassin',
      position: 'Outreach Lead',
      bio: 'Building connections with the aerospace community and promoting rocketry education.'
    }
  ]

  return (
    <div className="pt-16">
      <Section 
        title="Current Executives & Team Leads (2025)" 
        subtitle="The passionate students driving innovation in rocketry at the University of Guelph"
      >
        <TeamPhoto executives={executives} />
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
    </div>
  )
}

export default Team