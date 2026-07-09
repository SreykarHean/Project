import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import authService from '../../services/authService'
import Alert from '../../components/ui/Alert'

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

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="login-role">I am a</label>
            <select id="login-role" value={role} onChange={e => setRole(e.target.value)} className="input">
              <option value="buyer">Buyer</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="login-email">Email Address</label>
            <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email" required className="input" />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="login-password">Password</label>
            <input id="login-password" type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password" required className="input" />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Link to="/forgot-password" className="btn-link" style={{ fontSize: '13px' }}>Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="btn-link">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
