import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'

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

  const inputStyle = {
    width: '100%', padding: '12px', border: '1px solid #e5e7eb',
    borderRadius: '8px', fontSize: '15px', marginBottom: '16px', background: '#f9fafb'
  }

  if (!token || !role) return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      <p>Invalid or missing reset link.</p>
      <Link to="/login" style={{ color: '#1a56db' }}>Back to Login</Link>
    </div>
  )

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
          Reset Password
        </h2>
        <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '32px' }}>
          Enter your new password
        </p>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        {message && <div style={{ background: '#d1fae5', color: '#065f46', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password" required style={inputStyle} />

          <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password" required style={inputStyle} />

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', background: '#1a56db', color: '#fff',
            border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '16px'
          }}>{loading ? 'Resetting...' : 'Reset Password'}</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          <Link to="/login" style={{ color: '#1a56db', fontWeight: '600' }}>← Back to Login</Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPassword