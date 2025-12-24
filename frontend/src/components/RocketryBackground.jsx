import { useEffect, useState } from 'react'

const RocketryBackground = () => {
  const [stars, setStars] = useState([])

  useEffect(() => {
    // Generate random stars
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 2
    }))
    setStars(newStars)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: 'white',
            borderRadius: '50%',
            animationDelay: `${star.delay}s`
          }}
        />
      ))}

      {/* Floating Rockets */}
      <div className="absolute top-20 left-10 text-4xl float-rocket opacity-20">
        🚀
      </div>
      <div className="absolute bottom-40 right-20 text-3xl float-rocket opacity-20" style={{ animationDelay: '1s' }}>
        🛸
      </div>
      <div className="absolute top-60 right-40 text-2xl float-rocket opacity-20" style={{ animationDelay: '2s' }}>
        🌟
      </div>

      {/* Orbital Satellites */}
      <div className="absolute top-1/2 left-1/2 w-4 h-4">
        <div className="orbit">
          <div className="text-2xl">🛰️</div>
        </div>
      </div>
    </div>
  )
}

export default RocketryBackground
