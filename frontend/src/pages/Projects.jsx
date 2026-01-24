const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Launch Canada 2026 Competition Rocket',
      description: 'Designing and building a high-performance competition rocket to compete at Launch Canada 2026. Our team is developing a complete launch vehicle with advanced avionics, recovery systems, and optimized aerodynamics to achieve maximum altitude while ensuring safe recovery.',
      status: 'In Development',
      category: 'Competition',
      technologies: ['Aerodynamics', 'Recovery Systems', 'Flight Computer', 'Telemetry', 'Composite Materials'],
      timeline: '2025-2026',
      target: 'Launch Canada 2026'
    },
    {
      id: 2,
      title: 'CubeSat Satellite Mission',
      description: 'A student-led initiative to design, build, and launch our own small-scale satellite (CubeSat) featuring a groundbreaking Proof-of-Concept for Machine Learning inference in space. Leveraging advanced hardware including ASICs and FPGAs, our payload will process real-time spectrometric and visual data onboard, demonstrating autonomous edge computing capabilities in the harsh environment of Low Earth Orbit.',
      status: 'In Development',
      category: 'Space Systems',
      technologies: ['ML Inference', 'ASIC/FPGA', 'Spectrometry', 'Computer Vision', 'Satellite Design', 'Edge Computing'],
      timeline: '2025-2028',
      target: 'CubeSat Competition 2028'
    },
    {
      id: 3,
      title: 'Hybrid Rocket Propulsion',
      description: 'Long-term research and development of an advanced hybrid rocket motor combining solid fuel with liquid oxidizer. This system offers improved safety and controllability for high-altitude flights, with the goal of developing flight-ready propulsion technology over the next 3-4 years.',
      status: 'Research Phase',
      category: 'Propulsion',
      technologies: ['Hybrid Propulsion', 'CAD Design', 'Fluid Dynamics', 'Control Systems', 'Test Stand Engineering'],
      timeline: '2025-2029',
      target: 'Flight-Ready System'
    }
  ]

  return (
    <div className="page-transition">
      {/* Header */}
      <section className="pt-24 pb-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Projects</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Active engineering projects across propulsion, satellite systems, and competition rocketry.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-8">
            {projects.map((project) => (
              <div key={project.id} className="border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        project.status === 'In Development' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {project.status}
                      </span>
                      <span className="text-sm text-slate-500">{project.category}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">{project.title}</h2>
                    <p className="text-slate-600 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="lg:text-right lg:min-w-48">
                    <div className="text-sm text-slate-500 mb-1">Timeline</div>
                    <div className="font-medium text-slate-900 mb-3">{project.timeline}</div>
                    <div className="text-sm text-slate-500 mb-1">Target</div>
                    <div className="font-medium text-blue-600">{project.target}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Focus Areas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Propulsion', desc: 'Hybrid motors, solid fuel, oxidizer systems' },
              { title: 'Avionics', desc: 'Flight computers, sensors, telemetry' },
              { title: 'Structures', desc: 'Airframes, recovery, composites' },
            ].map((area) => (
              <div key={area.title} className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">{area.title}</h3>
                <p className="text-sm text-slate-600">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Contribute to a Project</h2>
          <p className="text-slate-600 mb-6">
            All skill levels welcome. Join a team and start building.
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
    </div>
  )
}

export default Projects