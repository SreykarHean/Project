import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import authService from '../../services/authService'
import Alert from '../../components/ui/Alert'

const Register = () => {
  const [role, setRole] = useState('buyer')
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', password: '', agency_name: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authService.register(role, formData)
      login(res.data.data.token)
      if (role === 'buyer') navigate('/buyer')
      else if (role === 'agent') navigate('/agent')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join Property Network today</p>

        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="register-role">I am a</label>
            <select id="register-role" value={role} onChange={(e) => setRole(e.target.value)} className="input">
              <option value="buyer">Buyer</option>
              <option value="agent">Agent</option>
            </select>
          </div>

          {[
            { label: 'Full Name', name: 'full_name', type: 'text', placeholder: 'Your full name' },
            { label: 'Email Address', name: 'email', type: 'email', placeholder: 'Your email' },
            { label: 'Phone', name: 'phone', type: 'text', placeholder: 'Your phone number' },
            { label: 'Password', name: 'password', type: 'password', placeholder: 'Create a password' },
          ].map(field => (
            <div className="form-group" key={field.name}>
              <label className="label" htmlFor={`register-${field.name}`}>{field.label}</label>
              <input id={`register-${field.name}`} type={field.type} name={field.name}
                value={formData[field.name]} onChange={handleChange}
                placeholder={field.placeholder} required={field.name !== 'phone'} className="input" />
            </div>
          ))}

          {role === 'agent' && (
            <div className="form-group">
              <label className="label" htmlFor="register-agency_name">Agency Name</label>
              <input id="register-agency_name" type="text" name="agency_name" value={formData.agency_name}
                onChange={handleChange} placeholder="Your agency name" className="input" />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block" style={{ marginTop: '8px' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="btn-link">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
