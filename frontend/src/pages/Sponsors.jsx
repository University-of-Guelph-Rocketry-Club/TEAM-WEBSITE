import { useState, useEffect } from 'react'
import Section from '../components/Section'
import SponsorGrid from '../components/SponsorGrid'
import SponsorContactForm from '../components/SponsorContactForm'
import { getSponsors } from '../lib/api'

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await getSponsors()
        setSponsors(response.data)
      } catch (error) {
        console.error('Failed to fetch sponsors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSponsors()
  }, [])

  return (
    <div className="pt-16">
      <Section 
        title="Our Sponsors" 
        subtitle="Partner with us to shape the future of aerospace engineering"
      >
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading sponsors...</p>
          </div>
        ) : (
          <SponsorGrid sponsors={sponsors} />
        )}
      </Section>

      <Section 
        title="Why Sponsor Us?" 
        subtitle="Join us in advancing student innovation and aerospace education"
        background="gray"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-600 font-bold text-xl">🎯</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Brand Exposure</h3>
                <p className="text-gray-600">
                  Reach talented engineering students and aerospace professionals through 
                  competitions, events, and social media presence.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-600 font-bold text-xl">🤝</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Talent Pipeline</h3>
                <p className="text-gray-600">
                  Connect with top engineering talent and identify potential future employees 
                  who have hands-on project experience.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-600 font-bold text-xl">🚀</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Innovation Support</h3>
                <p className="text-gray-600">
                  Support cutting-edge research and development in aerospace technologies 
                  while contributing to educational advancement.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-600 font-bold text-xl">📈</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Community Impact</h3>
                <p className="text-gray-600">
                  Make a meaningful difference in STEM education and inspire the next 
                  generation of aerospace engineers and innovators.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sponsorship Impact</h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">50+</div>
                <div className="text-gray-600">Students Supported</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">15+</div>
                <div className="text-gray-600">Competitions Entered</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">10k+</div>
                <div className="text-gray-600">Social Media Reach</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">500+</div>
                <div className="text-gray-600">Community Members Reached</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section 
        title="Sponsorship Tiers" 
        subtitle="Choose the level of partnership that works for your organization"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Gold Tier */}
          <div className="card p-8 border-t-4 border-rocket-gold">
            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-rocket-gold mb-2">Gold Sponsor</div>
              <div className="text-4xl font-bold text-gray-900 mb-2">$5,000+</div>
              <div className="text-gray-600">Premium Partnership</div>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Logo on rocket and team gear</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Prominent website placement</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Social media recognition</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Annual report acknowledgment</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Recruitment event access</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Custom collaboration opportunities</span>
              </li>
            </ul>
          </div>

          {/* Silver Tier */}
          <div className="card p-8 border-t-4 border-gray-400">
            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-gray-600 mb-2">Silver Sponsor</div>
              <div className="text-4xl font-bold text-gray-900 mb-2">$2,500+</div>
              <div className="text-gray-600">Standard Partnership</div>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Logo on team materials</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Website sponsor page listing</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Social media mentions</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Competition updates</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Networking event invitations</span>
              </li>
            </ul>
          </div>

          {/* Bronze Tier */}
          <div className="card p-8 border-t-4 border-orange-400">
            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-orange-600 mb-2">Bronze Sponsor</div>
              <div className="text-4xl font-bold text-gray-900 mb-2">$1,000+</div>
              <div className="text-gray-600">Supporting Partnership</div>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Website sponsor listing</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Social media recognition</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Project updates</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">Team appreciation</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section 
        title="Become a Sponsor" 
        subtitle="Partner with us to support the next generation of aerospace engineers"
      >
        <div className="max-w-2xl mx-auto">
          <SponsorContactForm />
        </div>
      </Section>
    </div>
  )
}

export default Sponsors