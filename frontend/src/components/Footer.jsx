const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-rocket-red rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🚀</span>
              </div>
              <span className="font-bold text-xl">UofG Rocketry Club</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Building the future of aerospace engineering through hands-on rocketry projects, 
              competitions, and educational outreach at the University of Guelph.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/projects" className="text-gray-300 hover:text-white transition-colors">Projects</a></li>
              <li><a href="/team" className="text-gray-300 hover:text-white transition-colors">Meet the Team</a></li>
              <li><a href="/sponsors" className="text-gray-300 hover:text-white transition-colors">Sponsors</a></li>
              <li><a href="/join" className="text-gray-300 hover:text-white transition-colors">Join Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Discord</a></li>
              <li><a href="mailto:info@rocketryguelph.ca" className="text-gray-300 hover:text-white transition-colors">Email</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 University of Guelph Rocketry Club. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            University of Guelph, Ontario, Canada
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer