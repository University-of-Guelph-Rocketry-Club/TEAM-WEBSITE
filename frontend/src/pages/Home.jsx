import Hero from '../components/Hero'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

// Scroll-triggered section wrapper
const ScrollReveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger children animation
const StaggerContainer = ({ children, className = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
        hidden: {}
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const StaggerItem = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
    }}
    className={className}
  >
    {children}
  </motion.div>
)

const Home = () => {
  return (
    <div className="page-transition overflow-hidden">
      <Hero />
      
      {/* Launch Canada 2026 - Big Announcement */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-orange-600 to-red-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center text-white mb-12">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 rounded-full mb-6 backdrop-blur-sm"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-bold tracking-wider">ACTIVE BUILD</span>
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">Launch Canada 2026</h2>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                We're currently building our competition rocket for Launch Canada this summer. First major launch as a club.
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">10,000ft</div>
                <div className="text-white/80">Target Altitude</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">5 months</div>
                <div className="text-white/80">Until Launch Day</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">30+ students</div>
                <div className="text-white/80">On the team</div>
              </div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3}>
            <div className="text-center mt-10">
              <Link 
                to="/projects" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-white/90 transition-colors"
              >
                <span>See the build</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
      
      {/* Active Projects - Featured */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
              <div>
                <span className="text-sm text-slate-500 mb-3 block">What else we're working on</span>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Other Projects</h2>
              </div>
              <Link 
                to="/projects" 
                className="group inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <span className="text-sm font-medium">See all →</span>
              </Link>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid lg:grid-cols-2 gap-8">
            {/* CubeSat - Primary Card */}
            <StaggerItem>
              <motion.div 
                className="group relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 h-full overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-sm font-medium">In Development</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">CubeSat Satellite</h3>
                  <p className="text-slate-300 mb-8 leading-relaxed">
                    Building our own satellite with ML inference running on custom hardware. We're designing ASICs and FPGAs to process visual and spectrometric data in orbit—basically edge computing in space.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {['ML Inference', 'ASIC/FPGA', 'Spectrometry', 'Edge Computing'].map((tag) => (
                      <span key={tag} className="px-3 py-1.5 bg-white/10 text-slate-300 text-xs font-mono rounded-full backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <span className="text-slate-400 text-sm">Target: Orbit 2028</span>
                    <div className="text-4xl font-bold text-white/20 font-mono">SAT</div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>

            {/* Hybrid Rocket - Secondary Card */}
            <StaggerItem>
              <motion.div 
                className="group relative bg-slate-50 border-2 border-slate-200 rounded-3xl p-10 h-full overflow-hidden hover:border-slate-300 transition-colors"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-blue-600 text-sm font-medium">Research Phase</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Hybrid Rocket Motor</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Students designing and building a forward hybrid engine from scratch. Gaseous Nitrous Oxide oxidizer with Aluminized HTPB fuel grain. R&D project targeting Launch Canada 2027.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {['N₂O Oxidizer', 'Aluminized HTPB', 'Forward Hybrid', 'Test Stand'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-slate-200 text-slate-600 text-xs font-mono rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <span className="text-slate-400 text-sm">Target: Launch Canada 2027</span>
                  <div className="text-4xl font-bold text-slate-200 font-mono">HYB</div>
                </div>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Latest Updates - Big & Bold */}
      <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-4">Recent Updates</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">What's been happening in the workshop</p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured Update - Conference */}
            <StaggerItem className="md:col-span-2 lg:col-span-1 lg:row-span-2">
              <motion.div 
                className="h-full bg-gradient-to-b from-blue-600 to-blue-700 rounded-3xl p-8 relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-xs font-mono bg-white/20 px-3 py-1 rounded-full">UPCOMING</span>
                  </div>
                  <div className="text-7xl font-bold opacity-20 mb-4">07</div>
                  <div className="text-sm text-blue-200 font-mono mb-2">MARCH 2026</div>
                  <h3 className="text-2xl font-bold mb-4">CubeSat Conference</h3>
                  <p className="text-blue-100 mb-8 flex-grow">
                    Canadian CubeSat Conference at Concordia in March. Teams from across Canada presenting their satellite designs. We're going.
                  </p>
                  <a 
                    href="https://ccc.seds.ca/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white font-medium group/link"
                  >
                    <span>Register now</span>
                    <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            </StaggerItem>

            {/* Hardware Update */}
            <StaggerItem>
              <motion.div 
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-green-400">JUST IN</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Hardware Arrived</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Got our avionics kits and electronics shipment last week. Starting assembly soon.
                </p>
              </motion.div>
            </StaggerItem>

            {/* Software Update */}
            <StaggerItem>
              <motion.div 
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-xs font-mono text-purple-400">ONGOING</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Code in Progress</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Flight computer firmware, telemetry dashboard, trajectory sims, ground station UI. Might open source it when it's ready.
                </p>
              </motion.div>
            </StaggerItem>

            {/* Lab Fund Bid */}
            <StaggerItem>
              <motion.div 
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-orange-400 rounded-full" />
                  <span className="text-xs font-mono text-orange-400">UPCOMING</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Applying for Lab Space</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Writing a proposal for our own workshop with test stands and assembly area. Fingers crossed.
                </p>
              </motion.div>
            </StaggerItem>

            {/* Discord CTA */}
            <StaggerItem>
              <motion.a 
                href="https://discord.gg/VRZE2923"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-slate-800 border border-slate-700 rounded-3xl p-8 hover:border-slate-600 transition-colors group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Get Updates Live</h3>
                    <p className="text-slate-400 text-sm">Join 50+ members on Discord</p>
                  </div>
                  <svg className="w-8 h-8 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </motion.a>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Video Section - Full Width */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">See It Fly</h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
              <video 
                controls 
                className="w-full h-full object-cover"
              >
                <source src="/Videos/rocket%20launch.mp4" type="video/mp4" />
              </video>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Teams - Minimal */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Four Teams</h2>
              <p className="text-xl text-slate-500">Choose where you want to contribute</p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Software', desc: 'Code flight computers and ground station software', color: 'from-blue-500 to-blue-600' },
              { name: 'Avionics', desc: 'Design circuits and sensor systems', color: 'from-emerald-500 to-emerald-600' },
              { name: 'Rocketry', desc: 'Build motors, airframes, and recovery', color: 'from-red-500 to-red-600' },
              { name: 'Finance', desc: 'Handle sponsorships and budget', color: 'from-amber-500 to-amber-600' },
            ].map((dept) => (
              <StaggerItem key={dept.name}>
                <motion.div 
                  className="group relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer overflow-hidden"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${dept.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{dept.name}</h3>
                  <p className="text-slate-500 text-sm">{dept.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal delay={0.4}>
            <div className="text-center mt-12">
              <Link to="/team" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group">
                <span className="font-medium">Meet the full team</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA - Big & Bold */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Want to join?</h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              No experience required. We'll teach you what you need to know. Just show up ready to learn and build.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a 
                href="https://discord.gg/VRZE2923" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Join Discord
              </motion.a>
              <motion.a 
                href="mailto:rocketry@uoguelph.ca"
                className="px-8 py-4 border border-slate-600 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Email Us
              </motion.a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

export default Home