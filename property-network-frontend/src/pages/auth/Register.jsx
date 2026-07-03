import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import authService from '../../services/authService'

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

  const inputStyle = {
    width: '100%', padding: '12px', border: '1px solid #e5e7eb',
    borderRadius: '8px', fontSize: '15px', marginBottom: '16px',
    background: '#f9fafb'
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f3f4f6'
    }}>
      <div style={{
        background: '#fff', borderRadius: '12px', padding: '40px',
        width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>
          Create Account
        </h2>
        <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '32px' }}>
          Join Property Network today
        </p>

        {error && (
          <div style={{
            background: '#fee2e2', color: '#991b1b', padding: '12px',
            borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
            I am a
          </label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
            <option value="buyer">Buyer</option>
            <option value="agent">Agent</option>
          </select>

          {[
            { label: 'Full Name', name: 'full_name', type: 'text', placeholder: 'Your full name' },
            { label: 'Email Address', name: 'email', type: 'email', placeholder: 'Your email' },
            { label: 'Phone', name: 'phone', type: 'text', placeholder: 'Your phone number' },
            { label: 'Password', name: 'password', type: 'password', placeholder: 'Create a password' },
          ].map(field => (
            <div key={field.name}>
              <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
                {field.label}
              </label>
              <input type={field.type} name={field.name} value={formData[field.name]}
                onChange={handleChange} placeholder={field.placeholder}
                required={field.name !== 'phone'} style={inputStyle} />
            </div>
          ))}

          {role === 'agent' && (
            <>
              <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
                Agency Name
              </label>
              <input type="text" name="agency_name" value={formData.agency_name}
                onChange={handleChange} placeholder="Your agency name" style={inputStyle} />
            </>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', background: '#1a56db', color: '#fff',
            border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '16px',
            marginTop: '8px'
          }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#6b7280', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1a56db', fontWeight: '600' }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default Register