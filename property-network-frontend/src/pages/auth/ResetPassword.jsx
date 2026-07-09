import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import Alert from '../../components/ui/Alert'
import EmptyState from '../../components/ui/EmptyState'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const role = searchParams.get('role')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await api.post(`/auth/reset-password/${role}`, { token, newPassword })
      setMessage(res.data.message)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  if (!token || !role) return (
    <EmptyState title="Invalid or missing reset link.">
      <Link to="/login" className="btn-link">Back to Login</Link>
    </EmptyState>
  )

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">Enter your new password</p>

        {error && <Alert type="error">{error}</Alert>}
        {message && <Alert type="success">{message}</Alert>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="reset-password">New Password</label>
            <input id="reset-password" type="password" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password" required className="input" />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="reset-confirm">Confirm Password</label>
            <input id="reset-confirm" type="password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password" required className="input" />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login" className="btn-link">← Back to Login</Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPassword
