import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const ForgotPassword = () => {
  const [role, setRole] = useState('buyer')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const res = await api.post(`/auth/forgot-password/${role}`, { email })
      setMessage(res.data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px', border: '1px solid #e5e7eb',
    borderRadius: '8px', fontSize: '15px', marginBottom: '16px', background: '#f9fafb'
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
          Forgot Password
        </h2>
        <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '32px' }}>
          Enter your email to receive a reset link
        </p>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        {message && <div style={{ background: '#d1fae5', color: '#065f46', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
            <option value="buyer">Buyer</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>

          <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email" required style={inputStyle} />

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', background: '#1a56db', color: '#fff',
            border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '16px'
          }}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          <Link to="/login" style={{ color: '#1a56db', fontWeight: '600' }}>← Back to Login</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword