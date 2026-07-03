import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import authService from '../../services/authService'

const Login = () => {
  const [role, setRole] = useState('buyer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authService.login(role, { email, password })
      login(res.data.data.token)
      if (role === 'buyer') navigate('/buyer')
      else if (role === 'agent') navigate('/agent')
      else if (role === 'admin') navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px', border: '1px solid #e5e7eb',
    borderRadius: '8px', fontSize: '15px', marginBottom: '16px',
    background: '#f9fafb', outline: 'none'
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f3f4f6'
    }}>
      <div style={{
        background: '#fff', borderRadius: '12px', padding: '40px',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>
          Welcome Back
        </h2>
        <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '32px' }}>
          Sign in to your account
        </p>

        {error && (
          <div style={{
            background: '#fee2e2', color: '#991b1b', padding: '12px',
            borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>I am a</label>
          <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>
            <option value="buyer">Buyer</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>

          <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email" required style={inputStyle} />

          <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password" required style={inputStyle} />

          <div style={{ textAlign: 'right', marginBottom: '20px', marginTop: '-8px' }}>
            <Link to="/forgot-password" style={{ fontSize: '13px', color: '#1a56db' }}>Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', background: '#1a56db', color: '#fff',
            border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '16px', cursor: 'pointer'
          }}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#6b7280', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#1a56db', fontWeight: '600' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login