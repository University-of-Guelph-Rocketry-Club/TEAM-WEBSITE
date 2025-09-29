const ProjectCard = ({ project }) => {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    planned: "bg-yellow-100 text-yellow-800"
  }

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      {project.image_url && (
        <div className="aspect-video bg-gray-200 overflow-hidden">
          <img 
            src={project.image_url} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
            {project.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status] || statusColors.planned}`}>
            {project.status}
          </span>
        </div>
        
        <p className="text-gray-600 line-clamp-3 mb-4">
          {project.description}
        </p>
        
        <button className="btn-primary w-full">
          Learn More
        </button>
      </div>
    </div>
  )
}

export default ProjectCard