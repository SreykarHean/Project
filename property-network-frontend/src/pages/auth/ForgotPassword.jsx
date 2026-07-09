import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Alert from '../../components/ui/Alert'

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

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtitle">Enter your email to receive a reset link</p>

        {error && <Alert type="error">{error}</Alert>}
        {message && <Alert type="success">{message}</Alert>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="forgot-role">Role</label>
            <select id="forgot-role" value={role} onChange={(e) => setRole(e.target.value)} className="input">
              <option value="buyer">Buyer</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="forgot-email">Email Address</label>
            <input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" required className="input" />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login" className="btn-link">← Back to Login</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
