import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const Hero = () => {
  const [currentVideo, setCurrentVideo] = useState(0)
  const videos = [
    '/Videos/Launch%20cool.mp4',
    '/Videos/rocket%20launch.mp4',
    '/Videos/team%20drone.mp4'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length)
    }, 15000) // Change video every 15 seconds
    return () => clearInterval(interval)
  }, [videos.length])

  return (
    <section className="relative min-h-screen flex items-center bg-slate-950 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        {videos.map((video, index) => (
          <video
            key={video}
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentVideo ? 'opacity-30' : 'opacity-0'
            }`}
          />
        ))}
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-slate-950/60"></div>
      </div>

      {/* Animated grid background overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}></div>
      </div>
      
      {/* Dynamic gradient orbs */}
      <motion.div 
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px]"
        animate={{ 
          scale: [1.2, 1, 1.2],
          y: [0, -30, 0],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Video indicators */}
      <div className="absolute top-8 right-8 z-20 flex gap-2">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentVideo(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentVideo 
                ? 'bg-white w-8' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`View video ${index + 1}`}
          />
        ))}
      </div>


      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Content */}
          <div className="space-y-10">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                <motion.span 
                  className="block text-slate-400 text-lg font-normal mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  University of Guelph
                </motion.span>
                <motion.span 
                  className="block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Rocketry Club
                </motion.span>
              </h1>
              
              <motion.p 
                className="text-xl text-slate-400 max-w-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Building rockets, satellites, and flight computers. Students learning aerospace engineering by actually doing it.
              </motion.p>
            </motion.div>

            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.a 
                href="/join" 
                className="group px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all text-lg inline-flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Join the Team
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
              <motion.a 
                href="/projects" 
                className="px-8 py-4 border border-slate-600 text-white font-semibold rounded-xl hover:bg-white/5 transition-all text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Projects
              </motion.a>
            </motion.div>

            {/* Stats with stagger */}
            <motion.div 
              className="flex gap-12 pt-8 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {[
                { value: '50+', label: 'Active Members' },
                { value: '4', label: 'Departments' },
                { value: 'LC26', label: 'Next Launch' },
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + i * 0.1 }}
                >
                  <div className="text-3xl font-bold text-white font-mono">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Logo */}
          <motion.div 
            className="hidden lg:flex justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              {/* Outer rings */}
              <motion.div 
                className="absolute inset-0 border border-white/5 rounded-full"
                style={{ width: '140%', height: '140%', top: '-20%', left: '-20%' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-0 border border-dashed border-white/10 rounded-full"
                style={{ width: '180%', height: '180%', top: '-40%', left: '-40%' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Glowing dots on orbit */}
              <motion.div
                className="absolute w-3 h-3 bg-blue-400 rounded-full blur-[2px]"
                style={{ top: '10%', right: '5%' }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute w-2 h-2 bg-red-400 rounded-full blur-[1px]"
                style={{ bottom: '20%', left: '0%' }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Logo */}
              <motion.div 
                className="relative z-10"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src="/Images/rocketrylogo.png" 
                  alt="UofG Rocketry Club" 
                  className="w-80 h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent"></div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div 
            className="w-1.5 h-3 bg-white/40 rounded-full mt-2"
            animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero