import { useState, useEffect } from 'react'
import Section from '../components/Section'
import SponsorGrid from '../components/SponsorGrid'
import SponsorContactForm from '../components/SponsorContactForm'
import Loading from '../components/Loading'
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

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="pt-16 page-transition">
      <Section 
        title="Our Sponsors" 
        subtitle="Partner with us to shape the future of University of Guelph engineering"
      >
        <div className="space-y-16">
          <SponsorGrid sponsors={sponsors} />
        </div>
      </Section>

      <Section 
        title="Why Sponsor Us?" 
        subtitle="Join us in advancing student innovation and aerospace education"
        background="gray"
      >
        <div className="grid grid-cols-1 gap-12">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-600 font-bold text-xl">🎯</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Brand Exposure</h3>
                <p className="text-gray-600">
                  Reach talented engineering students and field professionals through 
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
                  Support our teams research and development in aerospace technologies 
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
          <p className="text-center text-gray-600 mb-8">
            Reach out to us directly at{' '}
            <a 
              href="mailto:rocketry@uoguelph.ca" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              rocketry@uoguelph.ca
            </a>
            {' '}or fill out the form below.
          </p>
          <SponsorContactForm />
        </div>
      </Section>
    </div>
  )
}

export default Sponsors