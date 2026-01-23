import SponsorContactForm from '../components/SponsorContactForm'

const Sponsors = () => {
  return (
    <div className="page-transition">
      {/* Header */}
      <section className="pt-24 pb-8 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Sponsors</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Partner with UofG Rocketry to support aerospace innovation and connect with engineering talent.
          </p>
        </div>
      </section>

      {/* Why Sponsor */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Why Sponsor?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Brand Visibility', desc: 'Logo on rockets, gear, and all competition materials' },
              { title: 'Talent Access', desc: 'Connect with skilled engineering students for recruitment' },
              { title: 'Innovation Support', desc: 'Contribute to aerospace R&D and educational advancement' },
              { title: 'Community Impact', desc: 'Support STEM education at University of Guelph' },
            ].map((item) => (
              <div key={item.title} className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Sponsorship Tiers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Gold */}
            <div className="bg-white rounded-xl p-8 border-2 border-amber-400">
              <div className="text-amber-500 font-semibold text-sm mb-2">GOLD</div>
              <div className="text-3xl font-bold text-slate-900 mb-4">$5,000+</div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>• Logo on rocket & team gear</li>
                <li>• Prominent website placement</li>
                <li>• Social media recognition</li>
                <li>• Recruitment event access</li>
                <li>• Custom collaboration opportunities</li>
              </ul>
            </div>

            {/* Silver */}
            <div className="bg-white rounded-xl p-8 border border-slate-200">
              <div className="text-slate-500 font-semibold text-sm mb-2">SILVER</div>
              <div className="text-3xl font-bold text-slate-900 mb-4">$2,500+</div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>• Logo on team materials</li>
                <li>• Website sponsor listing</li>
                <li>• Social media mentions</li>
                <li>• Competition updates</li>
                <li>• Networking event invitations</li>
              </ul>
            </div>

            {/* Bronze */}
            <div className="bg-white rounded-xl p-8 border border-slate-200">
              <div className="text-orange-500 font-semibold text-sm mb-2">BRONZE</div>
              <div className="text-3xl font-bold text-slate-900 mb-4">$1,000+</div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>• Website sponsor listing</li>
                <li>• Social media recognition</li>
                <li>• Project updates</li>
                <li>• Team appreciation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">Become a Sponsor</h2>
          <p className="text-slate-600 mb-8 text-center">
            Contact us at{' '}
            <a href="mailto:rocketry@uoguelph.ca" className="text-blue-600 hover:underline">
              rocketry@uoguelph.ca
            </a>
            {' '}or use the form below.
          </p>
          <SponsorContactForm />
        </div>
      </section>
    </div>
  )
}

export default Sponsors