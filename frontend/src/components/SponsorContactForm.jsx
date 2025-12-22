import { useState } from 'react'

const SponsorContactForm = () => {
  return (
    <div className="space-y-6">
      {/* Coming Soon Notice */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-indigo-300 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">🚀</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Thank You for Your Interest!</h3>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          We truly appreciate your interest in sponsoring the University of Guelph Rocketry Club. 
          Our sponsorship form is currently under development and will be available soon.
        </p>
        
        <div className="bg-white rounded-lg p-6 mb-6 max-w-xl mx-auto">
          <p className="text-gray-800 font-medium mb-4">In the meantime, please reach out to us directly:</p>
          <div className="space-y-3">
            <a 
              href="https://www.linkedin.com/company/uofg-rocketry-club/posts/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl">💼</span>
              <span className="font-semibold text-blue-700">Connect on LinkedIn</span>
            </a>
            
            <a 
              href="https://www.instagram.com/guelph_rockets" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-3 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
            >
              <span className="text-2xl">📸</span>
              <span className="font-semibold text-pink-700">Message on Instagram</span>
            </a>
            
            <a 
              href="https://discord.gg/hZjQxvue" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <span className="text-2xl">💬</span>
              <span className="font-semibold text-indigo-700">Join Our Discord</span>
            </a>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 italic">
          Form coming soon! We're working hard to make it easy for you to partner with us.
        </p>
      </div>
    </div>
  )
}

export default SponsorContactForm