const SponsorGrid = ({ sponsors }) => {
  const tierOrder = ['gold', 'silver', 'bronze']
  const tierTitles = {
    gold: 'Gold Sponsors',
    silver: 'Silver Sponsors', 
    bronze: 'Bronze Sponsors'
  }

  const sponsorsByTier = sponsors?.reduce((acc, sponsor) => {
    const tier = sponsor.tier || 'bronze'
    if (!acc[tier]) acc[tier] = []
    acc[tier].push(sponsor)
    return acc
  }, {}) || {}

  return (
    <div className="space-y-12">
      {tierOrder.map(tier => {
        const tierSponsors = sponsorsByTier[tier]
        if (!tierSponsors?.length) return null

        return (
          <div key={tier} className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">{tierTitles[tier]}</h3>
            <div className={`grid gap-8 ${
              tier === 'gold' ? 'grid-cols-1 md:grid-cols-2' :
              tier === 'silver' ? 'grid-cols-2 md:grid-cols-3' :
              'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'
            }`}>
              {tierSponsors.map(sponsor => (
                <div 
                  key={sponsor.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  {sponsor.logo_url ? (
                    <img 
                      src={sponsor.logo_url} 
                      alt={sponsor.name}
                      className="max-w-full h-16 mx-auto object-contain"
                    />
                  ) : (
                    <div className="h-16 flex items-center justify-center text-gray-400 font-semibold">
                      {sponsor.name}
                    </div>
                  )}
                  
                  {sponsor.website_url && (
                    <a 
                      href={sponsor.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-sm text-primary-600 hover:text-primary-800"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
      
      {(!sponsors || sponsors.length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-xl">No sponsors found</div>
          <p className="text-gray-500 mt-2">We're always looking for new partners!</p>
        </div>
      )}
    </div>
  )
}

export default SponsorGrid