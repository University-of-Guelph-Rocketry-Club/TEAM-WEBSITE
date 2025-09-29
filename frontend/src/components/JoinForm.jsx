import { useState } from 'react'
import { submitJoinRequest } from '../lib/api'

const JoinForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    year: '',
    program: '',
    why_join: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await submitJoinRequest(formData)
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        year: '',
        program: '',
        why_join: ''
      })
    } catch (err) {
      setError('Failed to submit application. Please try again.')
      console.error('Error submitting join request:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="text-green-600 text-2xl font-semibold mb-4">
          Welcome to the Team! 🚀
        </div>
        <p className="text-green-700 mb-4">
          We've received your application and are excited to have you join us! 
          You'll hear back from us within 3-5 business days with next steps.
        </p>
        <p className="text-green-600 text-sm">
          In the meantime, don't forget to join our Discord community!
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 btn-primary"
        >
          Submit Another Application
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
            Year of Study *
          </label>
          <select
            id="year"
            name="year"
            required
            value={formData.year}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Graduate">Graduate Student</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
            Program of Study *
          </label>
          <input
            type="text"
            id="program"
            name="program"
            required
            value={formData.program}
            onChange={handleChange}
            placeholder="e.g., Engineering, Physics, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="why_join" className="block text-sm font-medium text-gray-700 mb-2">
          Why do you want to join the UofG Rocketry Club? *
        </label>
        <textarea
          id="why_join"
          name="why_join"
          rows={5}
          required
          value={formData.why_join}
          onChange={handleChange}
          placeholder="Tell us about your interest in rocketry, any relevant experience, and what you hope to gain from joining our club..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        ></textarea>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
      </button>

      <p className="text-gray-500 text-sm text-center">
        * Required fields. We'll review your application and get back to you soon!
      </p>
    </form>
  )
}

export default JoinForm