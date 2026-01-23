const Join = () => {
  return (
    <div className="page-transition">
      {/* Header */}
      <section className="pt-24 pb-8 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Join Us</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Connect with the UofG Rocketry community. All skill levels welcome.
          </p>
        </div>
      </section>

      {/* Main CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Join our Discord
            </h2>
            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
              Discord is where we coordinate projects, share updates, and build community. It's the easiest way to get started.
            </p>
            <a 
              href="https://discord.gg/VRZE2923" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              Join Discord Server
            </a>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">What to Expect</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Hands-On Projects', desc: 'Work on real aerospace systems—propulsion, avionics, software, structures' },
              { title: 'Learn by Doing', desc: "No prior experience needed. You'll learn alongside experienced members" },
              { title: 'Competition Prep', desc: 'Help build rockets for Launch Canada and satellites for CubeSat competition' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Pick a Team</h2>
          <p className="text-slate-600 mb-8">Join the department that interests you most. You can switch or contribute to multiple.</p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Software', desc: 'Flight computers, ground stations, simulations, data visualization' },
              { name: 'Avionics', desc: 'Sensors, circuits, control systems, PCB design' },
              { name: 'Rocketry', desc: 'Propulsion, aerodynamics, structures, composites' },
              { name: 'Finance', desc: 'Sponsorship, budgeting, event coordination' },
            ].map((dept) => (
              <div key={dept.name} className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-2">{dept.name}</h3>
                <p className="text-sm text-slate-600">{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Questions?</h2>
          <p className="text-slate-600 mb-6">
            Reach out directly if you have any questions about joining.
          </p>
          <a 
            href="mailto:rocketry@uoguelph.ca"
            className="inline-block px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors"
          >
            rocketry@uoguelph.ca
          </a>
        </div>
      </section>
    </div>
  )
}

export default Join