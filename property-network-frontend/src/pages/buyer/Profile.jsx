import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faCircleCheck, faClock } from '@fortawesome/free-solid-svg-icons'

import { useState, useEffect, useRef } from 'react'
import api from '../../services/api'
import { formatDate } from '../../utils/helpers'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [photoUploading, setPhotoUploading] = useState(false)
  const fileInputRef = useRef(null)

  const loadProfile = () => {
    return api.get('/buyers/profile')
      .then(res => {
        setProfile(res.data.data)
        setFormData({ full_name: res.data.data.full_name, phone: res.data.data.phone || '' })
      })
      .catch(console.error)
  }

  useEffect(() => {
    loadProfile().finally(() => setLoading(false))
  }, [])

  const flash = (msg, isError = false) => {
    if (isError) { setError(msg); setTimeout(() => setError(''), 3000) }
    else { setMessage(msg); setTimeout(() => setMessage(''), 3000) }
  }

  const handleSave = async () => {
    try {
      await api.put('/buyers/profile', formData)
      setProfile({ ...profile, ...formData })
      setEditing(false)
      flash('Profile updated successfully!')
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to update profile', true)
    }
  }

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      flash('Please select an image file', true)
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      flash('Image must be smaller than 5MB', true)
      return
    }

    const form = new FormData()
    form.append('photo', file)

    setPhotoUploading(true)
    try {
      const res = await api.post('/buyers/profile/photo', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setProfile(res.data.data)
      flash('Profile photo updated!')
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to upload photo', true)
    } finally {
      setPhotoUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handlePhotoDelete = async () => {
    if (!window.confirm('Remove your profile photo?')) return
    setPhotoUploading(true)
    try {
      const res = await api.delete('/buyers/profile/photo')
      setProfile(res.data.data)
      flash('Profile photo removed')
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to remove photo', true)
    } finally {
      setPhotoUploading(false)
    }
  }

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>

  const initials = (profile?.full_name || '?')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const fieldLabel = { color: '#9ca3af', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '4px' }
  const fieldValue = { fontWeight: '600', fontSize: '15px', color: '#111827' }

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>My Profile</h2>

      {message && (
        <div style={{
          background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46',
          padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
        }}>{message}</div>
      )}
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b',
          padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
        }}>{error}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Left: avatar card */}
        <div style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px',
          overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a56db 0%, #1e40af 100%)',
            padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '120px', height: '120px', borderRadius: '50%',
                border: '4px solid #fff', overflow: 'hidden',
                background: '#eff6ff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
                boxShadow: '0 2px 10px rgba(0,0,0,0.18)'
              }}>
                {profile?.profile_photo ? (
                  <img src={profile.profile_photo} alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '38px', fontWeight: '700', color: '#1a56db' }}>{initials}</span>
                )}
                {photoUploading && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600'
                  }}>...</div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={photoUploading}
                title="Change photo"
                style={{
                  position: 'absolute', bottom: '2px', right: '2px',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#1a56db', border: '3px solid #fff', color: '#fff',
                  cursor: 'pointer', fontSize: '16px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}
              ><FontAwesomeIcon icon={faCamera} /></button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} style={{ display: 'none' }} />
            </div>

            <div style={{ textAlign: 'center', color: '#fff' }}>
              <p style={{ fontSize: '19px', fontWeight: '700' }}>{profile?.full_name}</p>
              <p style={{ fontSize: '13.5px', opacity: 0.85, marginTop: '2px' }}>{profile?.email}</p>
            </div>

            {profile?.profile_photo && (
              <button onClick={handlePhotoDelete} disabled={photoUploading} style={{
                background: 'rgba(255,255,255,0.15)', border: 'none',
                color: '#fff', fontSize: '12px', padding: '5px 12px', borderRadius: '20px', cursor: 'pointer'
              }}>Remove photo</button>
            )}
          </div>

          <div style={{ padding: '18px 24px' }}>
            <p style={{ ...fieldLabel, marginBottom: '6px' }}>Account Status</p>
            <span style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
              background: profile?.status === 'active' ? '#d1fae5' : '#fee2e2',
              color: profile?.status === 'active' ? '#065f46' : '#991b1b'
            }}>{profile?.status}</span>

            <p style={{ ...fieldLabel, marginTop: '16px', marginBottom: '4px' }}>Member Since</p>
            <p style={fieldValue}>{profile?.createdAt ? formatDate(profile.createdAt) : '—'}</p>
          </div>
        </div>

        {/* Right: details card */}
        <div style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px',
          padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          {!editing ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <h3>Personal Information</h3>
                <button onClick={() => setEditing(true)} style={{
                  padding: '9px 18px', background: '#1a56db', color: '#fff',
                  border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px'
                }}>Edit Profile</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px' }}>
                <div>
                  <p style={fieldLabel}>Full Name</p>
                  <p style={fieldValue}>{profile?.full_name}</p>
                </div>
                <div>
                  <p style={fieldLabel}>Phone</p>
                  <p style={fieldValue}>{profile?.phone || '—'}</p>
                </div>
                <div>
                  <p style={fieldLabel}>Email</p>
                  <p style={fieldValue}>{profile?.email}</p>
                </div>
                <div>
                  <p style={fieldLabel}>Buyer ID</p>
                  <p style={fieldValue}>#{profile?.buyer_id}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 style={{ marginBottom: '24px' }}>Edit Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '28px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Full Name</label>
                  <input value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '15px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Phone</label>
                  <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '15px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleSave} style={{
                  padding: '10px 22px', background: '#1a56db', color: '#fff',
                  border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer'
                }}>Save Changes</button>
                <button onClick={() => { setEditing(false); setFormData({ full_name: profile.full_name, phone: profile.phone || '' }) }} style={{
                  padding: '10px 22px', background: '#f3f4f6', color: '#374151',
                  border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer'
                }}>Cancel</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
