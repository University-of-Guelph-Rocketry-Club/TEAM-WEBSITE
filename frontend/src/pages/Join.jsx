import Section from '../components/Section'
import DiscordAccess from '../components/DiscordAccess'

const Join = () => {
  return (
    <div className="pt-16">
      <Section 
        title="Connect With Our Community" 
        subtitle="Join our network of rocketry and aerospace enthusiasts"
      >
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">🚀 University of Guelph Rocketry Club</h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              We're focused on networking with fellow rocketry enthusiasts, sharing knowledge, 
              and building connections in the aerospace community. Join our Discord community 
              to connect with like-minded individuals and stay updated on our collaborative activities.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <DiscordAccess />
          </div>
        </div>
      </Section>

      <Section 
        title="What We Do" 
        subtitle="Networking and collaboration in the rocketry community"
        background="gray"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🤝</span>
            </div>
            <h4 className="font-semibold text-lg mb-3">Networking</h4>
            <p className="text-gray-600">
              Connect with rocketry enthusiasts, aerospace professionals, and other university clubs across Canada.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-rocket-red rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🚀</span>
            </div>
            <h4 className="font-semibold text-lg mb-3">Collaborative Launches</h4>
            <p className="text-gray-600">
              Participate in launch events with other rocketry clubs like Cambridge Rocketry Club.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-rocket-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">📚</span>
            </div>
            <h4 className="font-semibold text-lg mb-3">Knowledge Sharing</h4>
            <p className="text-gray-600">
              Share experiences, learn from other teams, and contribute to the broader aerospace community.
            </p>
          </div>
        </div>
      </Section>

      <Section 
        title="Get Involved" 
        subtitle="Multiple ways to connect and participate"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-600 font-bold">💬</span>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Join Discord</h4>
                <p className="text-gray-600">
                  Connect with our community, participate in discussions, and stay updated on events.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-600 font-bold">📧</span>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Contact Us</h4>
                <p className="text-gray-600">
                  Reach out directly to learn more about our activities and how to get involved.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-600 font-bold">🌐</span>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Network</h4>
                <p className="text-gray-600">
                  Connect with other rocketry enthusiasts and aerospace professionals through our community.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-50 to-rocket-red-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Connect?</h3>
            <p className="text-gray-600 mb-6">
              Whether you're interested in rocketry, aerospace engineering, or just want to network 
              with passionate individuals, we'd love to have you in our community.
            </p>
            <div className="space-y-3">
              <a 
                href="https://discord.gg/rocketryguelph" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary w-full text-center block"
              >
                Join Discord Community
              </a>
              <a 
                href="mailto:nick.buzali@gmail.com" 
                className="btn-secondary w-full text-center block"
              >
                Contact Our Team
              </a>
            </div>
          </div>
        </div>
      </Section>

      <Section 
        title="Current Focus" 
        subtitle="What we're working on in 2025"
        background="gray"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg">
              <h4 className="font-semibold text-lg mb-2">Cambridge Launches</h4>
              <p className="text-gray-600 text-sm">
                Collaborative launches with Cambridge Rocketry Club for knowledge sharing and networking.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h4 className="font-semibold text-lg mb-2">Community Building</h4>
              <p className="text-gray-600 text-sm">
                Building connections within the Canadian rocketry and aerospace community.
              </p>
            </div>
          </div>
          
          <p className="text-gray-600">
            Our current executives and team leads are focused on creating meaningful connections 
            and collaborative opportunities within the rocketry community. Join us to be part 
            of this growing network!
          </p>
        </div>
      </Section>
    </div>
  )
}

export default Join