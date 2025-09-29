const TeamPhoto = ({ executives }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {executives?.map(exec => (
        <div key={exec.id} className="text-center">
          <div className="mb-4">
            {exec.image_url ? (
              <img
                src={exec.image_url}
                alt={exec.name}
                className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {exec.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {exec.name}
          </h3>
          
          <p className="text-primary-600 font-medium mb-3">
            {exec.position}
          </p>
          
          {exec.bio && (
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              {exec.bio}
            </p>
          )}
          
          {exec.email && (
            <a 
              href={`mailto:${exec.email}`}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Contact →
            </a>
          )}
        </div>
      )) || (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-400 text-xl">No team members found</div>
          <p className="text-gray-500 mt-2">Check back soon to meet our team!</p>
        </div>
      )}
    </div>
  )
}

export default TeamPhoto