import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px'
    }}>
      <h1 style={{ fontSize: '80px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>404</h1>
      <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '32px' }}>
        The page you're looking for doesn't exist.
      </p>
      <button onClick={() => navigate(-1)} className="btn btn-primary btn-lg">Go Back</button>
    </div>
  )
}

export default NotFound
