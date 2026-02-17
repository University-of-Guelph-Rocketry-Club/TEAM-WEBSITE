import TeamPhoto from '../components/TeamPhoto'

const Team = () => {
  const executives = [
    { id: 1, name: 'Darren', position: 'Club President', image_url: '/Images/darren.jpg' },
    { id: 2, name: 'Marko', position: 'VP Operations', image_url: '/Images/rocketrylogo.png' },
    { id: 3, name: 'Rachel', position: 'VP Regulatory', image_url: '/Images/Rachel.jpg' },
    { id: 4, name: 'Julian', position: 'Finance', image_url: '/Images/Julian.png' },
    { id: 5, name: 'Juliet', position: 'Rocketry Team Lead', image_url: '/Images/rocketrylogo.png' },
    { id: 6, name: 'Nick', position: 'Software Team Lead', image_url: '/Images/IMG_6239.jpeg' },
    { id: 7, name: 'Aban', position: 'Avionics Team Lead', image_url: '/Images/aban.png' },
    { id: 8, name: 'Yassin', position: 'Outreach Lead', image_url: '/Images/rocketrylogo.png' }
  ]

  return (
    <div className="page-transition">
      {/* Header */}
      <section className="pt-24 pb-8 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Team</h1>
          <p className="text-lg text-slate-600">
            2025 Executive Team & Department Leads
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <TeamPhoto executives={executives} />
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Departments</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Software', lead: 'Nick', desc: 'Flight computers, telemetry, ground stations' },
              { name: 'Avionics', lead: 'Aban', desc: 'Electronics, sensors, control systems' },
              { name: 'Rocketry', lead: 'Juliet', desc: 'Propulsion, structures, aerodynamics' },
              { name: 'Finance', lead: 'Julian', desc: 'Budgeting, sponsorship, operations' },
            ].map((dept) => (
              <div key={dept.name} className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-1">{dept.name}</h3>
                <p className="text-sm text-blue-600 mb-3">Lead: {dept.lead}</p>
                <p className="text-sm text-slate-600">{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Join the Team</h2>
          <p className="text-slate-600 mb-6">
            We're always looking for new members. All skill levels welcome.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://discord.gg/VRZE2923" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              Join Discord
            </a>
            <a 
              href="mailto:rocketry@uoguelph.ca"
              className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Team Video Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Team in Action</h2>
            <p className="text-slate-600">Behind the scenes with the crew</p>
          </div>
          <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
            <video 
              controls 
              className="w-full h-full object-cover"
            >
              <source src="/Videos/team%20drone.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Team