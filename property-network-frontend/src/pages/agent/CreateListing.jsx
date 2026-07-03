import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const CreateListing = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '', description: '', price: '',
    city: '', address: '', property_type: 'condo', status: 'available'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/listings', formData)
      navigate('/agent/listings')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    border: '1px solid #e5e7eb', borderRadius: '6px',
    fontSize: '15px', marginBottom: '16px'
  }

  return (
    <div style={{ padding: '32px', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>Create New Listing</h2>
      {error && <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px' }}>
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '13px', color: '#6b7280' }}>Title</label>
          <input name="title" value={formData.title} onChange={handleChange} required style={inputStyle} />

          <label style={{ fontSize: '13px', color: '#6b7280' }}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange}
            rows={3} style={{ ...inputStyle, resize: 'vertical' }} />

          <label style={{ fontSize: '13px', color: '#6b7280' }}>Price (USD)</label>
          <input name="price" type="number" value={formData.price} onChange={handleChange} required style={inputStyle} />

          <label style={{ fontSize: '13px', color: '#6b7280' }}>City</label>
          <input name="city" value={formData.city} onChange={handleChange} required style={inputStyle} />

          <label style={{ fontSize: '13px', color: '#6b7280' }}>Address</label>
          <input name="address" value={formData.address} onChange={handleChange} style={inputStyle} />

          <label style={{ fontSize: '13px', color: '#6b7280' }}>Property Type</label>
          <select name="property_type" value={formData.property_type} onChange={handleChange} style={inputStyle}>
            <option value="condo">Condo</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="apartment">Apartment</option>
            <option value="flat">Flat</option>
          </select>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: '12px', background: '#1a56db', color: '#fff',
              border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '15px'
            }}>{loading ? 'Creating...' : 'Create Listing'}</button>
            <button type="button" onClick={() => navigate('/agent/listings')} style={{
              flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151',
              border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '15px'
            }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateListing