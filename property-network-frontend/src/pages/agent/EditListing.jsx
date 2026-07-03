import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

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

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    border: '1px solid #e5e7eb', borderRadius: '6px',
    fontSize: '15px', marginBottom: '16px'
  }

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>

  return (
    <div style={{ padding: '32px', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>Edit Listing</h2>
      {error && <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>}

      {/* Listing details form */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
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

          <label style={{ fontSize: '13px', color: '#6b7280' }}>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="archived">Archived</option>
          </select>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" style={{
              flex: 1, padding: '12px', background: '#1a56db', color: '#fff',
              border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '15px'
            }}>Save Changes</button>
            <button type="button" onClick={() => navigate('/agent/listings')} style={{
              flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151',
              border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '15px'
            }}>Cancel</button>
          </div>
        </form>
      </div>

      {/* Photo upload section */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Listing Photos</h3>

        {/* Existing photos */}
        {photos.length > 0 ? (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {photos.map((photo, i) => (
              <img
                key={photo.photo_id || i}
                src={photo.photo_path}
                alt={`Photo ${i + 1}`}
                style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>No photos yet.</p>
        )}

        {/* Preview of selected file */}
        {preview && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>Preview:</p>
            <img src={preview} alt="Preview" style={{
              width: '200px', height: '140px', objectFit: 'cover',
              borderRadius: '6px', border: '2px solid #1a56db'
            }} />
          </div>
        )}

        {/* File picker + upload button */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ fontSize: '14px' }}
          />
          <button
            onClick={handleUploadPhoto}
            disabled={!selectedFile || uploading}
            style={{
              padding: '10px 20px', background: selectedFile ? '#1a56db' : '#9ca3af',
              color: '#fff', border: 'none', borderRadius: '6px',
              fontWeight: '600', fontSize: '14px', cursor: selectedFile ? 'pointer' : 'not-allowed'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </div>

        {uploadMsg && (
          <p style={{
            marginTop: '12px', fontSize: '14px',
            color: uploadMsg.includes('success') ? '#065f46' : '#991b1b'
          }}>{uploadMsg}</p>
        )}
      </div>
    </div>
  )
}

export default EditListing