const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/Images/rocketrylogo.jpg" 
                alt="UofG Rocketry" 
                className="w-10 h-10 rounded object-cover"
              />
              <span className="font-semibold text-lg">UofG Rocketry Club</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Designing and building aerospace systems at the University of Guelph. 
              Competing at Launch Canada 2026.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-medium text-sm text-slate-300 uppercase tracking-wider mb-4">Navigate</h3>
            <ul className="space-y-3">
              <li><a href="/projects" className="text-slate-400 hover:text-white text-sm transition-colors">Projects</a></li>
              <li><a href="/team" className="text-slate-400 hover:text-white text-sm transition-colors">Team</a></li>
              <li><a href="/sponsors" className="text-slate-400 hover:text-white text-sm transition-colors">Sponsors</a></li>
              <li><a href="/join" className="text-slate-400 hover:text-white text-sm transition-colors">Join</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-medium text-sm text-slate-300 uppercase tracking-wider mb-4">Connect</h3>
            <ul className="space-y-3">
              <li><a href="https://discord.gg/VRZE2923" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-sm transition-colors">Discord</a></li>
              <li><a href="https://www.instagram.com/guelph_rockets" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-sm transition-colors">Instagram</a></li>
              <li><a href="https://www.linkedin.com/company/uofg-rocketry-club/posts/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-sm transition-colors">LinkedIn</a></li>
              <li><a href="mailto:rocketry@uoguelph.ca" className="text-slate-400 hover:text-white text-sm transition-colors">rocketry@uoguelph.ca</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            © 2025 University of Guelph Rocketry Club
          </p>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <a href="/privacy" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacy Policy</a>
            <span className="text-slate-700">•</span>
            <p className="text-slate-500 text-sm">
              Guelph, Ontario, Canada
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer