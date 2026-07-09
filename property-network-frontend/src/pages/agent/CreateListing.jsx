import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { PROPERTY_TYPES } from '../../utils/constants'
import Alert from '../../components/ui/Alert'

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

  return (
    <div className="page page-sm">
      <h2 style={{ marginBottom: '24px' }}>Create New Listing</h2>
      {error && <Alert type="error">{error}</Alert>}
      <div className="card" style={{ padding: '24px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="listing-title">Title</label>
            <input id="listing-title" name="title" value={formData.title} onChange={handleChange} required className="input" />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="listing-description">Description</label>
            <textarea id="listing-description" name="description" value={formData.description}
              onChange={handleChange} rows={3} className="input" />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="listing-price">Price (USD)</label>
            <input id="listing-price" name="price" type="number" value={formData.price}
              onChange={handleChange} required className="input" />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="listing-city">City</label>
            <input id="listing-city" name="city" value={formData.city} onChange={handleChange} required className="input" />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="listing-address">Address</label>
            <input id="listing-address" name="address" value={formData.address} onChange={handleChange} className="input" />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="listing-type">Property Type</label>
            <select id="listing-type" name="property_type" value={formData.property_type} onChange={handleChange} className="input">
              {PROPERTY_TYPES.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
            <button type="button" onClick={() => navigate('/agent/listings')} className="btn btn-secondary btn-lg" style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateListing
