const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-rocket-red min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              WELCOME TO THE U OF G
              <span className="block text-rocket-gold">ROCKETRY CLUB</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Join the University of Guelph Rocketry Club and be part of cutting-edge aerospace innovation, 
              competitions, and hands-on engineering excellence.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="/join" 
              className="bg-rocket-gold hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
            >
              Join Our Mission
            </a>
            <a 
              href="/projects" 
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300"
            >
              View Projects
            </a>
          </div>
        </div>
        
        {/* Floating Rocket Animation */}
        <div className="absolute top-10 right-10 md:top-20 md:right-20 animate-bounce">
          <div className="text-6xl transform rotate-45">🚀</div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-white">50+</div>
            <div className="text-gray-200">Active Members</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-white">2 New</div>
            <div className="text-gray-200">Projects In The Works</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-white">1</div>
            <div className="text-gray-200">Competitions Entered For 2026</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero