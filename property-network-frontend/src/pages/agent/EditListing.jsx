import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import { PROPERTY_TYPES, LISTING_STATUSES } from '../../utils/constants'
import Loading from '../../components/ui/Loading'
import Alert from '../../components/ui/Alert'

const EditListing = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '', description: '', price: '',
    city: '', address: '', property_type: 'condo', status: 'available'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // --- Photo upload states ---
  const [photos, setPhotos] = useState([])         // existing photos from DB
  const [selectedFile, setSelectedFile] = useState(null)  // new file to upload
  const [preview, setPreview] = useState(null)     // preview of selected file
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then(res => {
        const l = res.data.data
        setFormData({
          title: l.title, description: l.description || '',
          price: l.price, city: l.city, address: l.address || '',
          property_type: l.property_type, status: l.status
        })
        setPhotos(l.ListingPhotos || [])  // load existing photos
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/listings/${id}`, formData)
      navigate('/agent/listings')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing')
    }
  }

  // When user picks a file, show a preview
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setUploadMsg('')
  }

  // Upload the selected photo to backend
  const handleUploadPhoto = async () => {
    if (!selectedFile) return
    setUploading(true)
    setUploadMsg('')
    try {
      const data = new FormData()
      data.append('photo', selectedFile)
      const res = await api.post(`/listings/${id}/photos`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      // Add new photo to the list
      setPhotos(prev => [...prev, res.data.data])
      setSelectedFile(null)
      setPreview(null)
      setUploadMsg('Photo uploaded successfully!')
    } catch (err) {
      setUploadMsg(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="page page-sm">
      <h2 style={{ marginBottom: '24px' }}>Edit Listing</h2>
      {error && <Alert type="error">{error}</Alert>}

      {/* Listing details form */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="edit-title">Title</label>
            <input id="edit-title" name="title" value={formData.title} onChange={handleChange} required className="input" />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="edit-description">Description</label>
            <textarea id="edit-description" name="description" value={formData.description}
              onChange={handleChange} rows={3} className="input" />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="edit-price">Price (USD)</label>
            <input id="edit-price" name="price" type="number" value={formData.price}
              onChange={handleChange} required className="input" />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="edit-city">City</label>
            <input id="edit-city" name="city" value={formData.city} onChange={handleChange} required className="input" />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="edit-address">Address</label>
            <input id="edit-address" name="address" value={formData.address} onChange={handleChange} className="input" />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="edit-type">Property Type</label>
            <select id="edit-type" name="property_type" value={formData.property_type} onChange={handleChange} className="input">
              {PROPERTY_TYPES.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="edit-status">Status</label>
            <select id="edit-status" name="status" value={formData.status} onChange={handleChange} className="input">
              {LISTING_STATUSES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }}>Save Changes</button>
            <button type="button" onClick={() => navigate('/agent/listings')} className="btn btn-secondary btn-lg" style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Photo upload section */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Listing Photos</h3>

        {/* Existing photos */}
        {photos.length > 0 ? (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {photos.map((photo, i) => (
              <img
                key={photo.photo_id || i}
                src={photo.photo_path}
                alt={`Photo ${i + 1}`}
                style={{
                  width: '150px', height: '100px', objectFit: 'cover',
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'
                }}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>No photos yet.</p>
        )}

        {/* Preview of selected file */}
        {preview && (
          <div style={{ marginBottom: '16px' }}>
            <p className="label" style={{ marginBottom: '8px' }}>Preview:</p>
            <img src={preview} alt="Preview" style={{
              width: '200px', height: '140px', objectFit: 'cover',
              borderRadius: 'var(--radius-sm)', border: '2px solid var(--primary)'
            }} />
          </div>
        )}

        {/* File picker + upload button */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            aria-label="Choose a photo to upload"
            style={{ fontSize: '14px' }}
          />
          <button onClick={handleUploadPhoto} disabled={!selectedFile || uploading} className="btn btn-primary">
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </div>

        {uploadMsg && (
          <p style={{
            marginTop: '12px', fontSize: '14px',
            color: uploadMsg.includes('success') ? 'var(--success-text)' : 'var(--danger-text)'
          }}>{uploadMsg}</p>
        )}
      </div>
    </div>
  )
}

export default EditListing
