import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '80px', fontWeight: '800', color: '#1a56db', marginBottom: '8px' }}>404</h1>
      <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        The page you're looking for doesn't exist.
      </p>
      <button onClick={() => navigate(-1)} style={{
        padding: '12px 28px', background: '#1a56db', color: '#fff',
        border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '15px', cursor: 'pointer'
      }}>Go Back</button>
    </div>
  )
}

export default NotFound