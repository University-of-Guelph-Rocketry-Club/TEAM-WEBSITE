const Section = ({ title, subtitle, children, className = "", background = "white" }) => {
  const bgClasses = {
    white: "bg-white",
    gray: "bg-gray-50",
    dark: "bg-gray-900 text-white"
  }

  return (
    <section className={`py-16 ${bgClasses[background]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="section-heading">{title}</h2>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

export default Section