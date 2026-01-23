const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-slate-950 overflow-hidden">
      {/* Technical grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Subtle glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-mono">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                LAUNCH CANADA 2026
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                University of Guelph
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400">
                  Rocketry Club
                </span>
              </h1>
              
              <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                Designing hybrid propulsion systems, developing CubeSat payloads, and competing at the national level in aerospace engineering.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a 
                href="/join" 
                className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
              >
                Join the Team
              </a>
              <a 
                href="/projects" 
                className="px-6 py-3 border border-slate-600 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                View Projects
              </a>
            </div>

            {/* Quick stats - minimal */}
            <div className="flex gap-8 pt-4 border-t border-slate-800">
              <div>
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-slate-500">Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">4</div>
                <div className="text-sm text-slate-500">Departments</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">2026</div>
                <div className="text-sm text-slate-500">Competition</div>
              </div>
            </div>
          </div>

          {/* Right: Logo + Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Logo with glow */}
              <div className="relative z-10">
                <img 
                  src="/Images/rocketrylogo.png" 
                  alt="UofG Rocketry Club" 
                  className="w-72 h-72 lg:w-80 lg:h-80 object-contain"
                />
              </div>
              {/* Decorative ring */}
              <div className="absolute inset-0 border border-slate-700 rounded-full scale-125 animate-[spin_30s_linear_infinite]"></div>
              <div className="absolute inset-0 border border-dashed border-slate-800 rounded-full scale-150"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  )
}

export default Hero