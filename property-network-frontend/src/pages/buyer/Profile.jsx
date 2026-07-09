import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'

import { useState, useEffect, useRef } from 'react'
import api from '../../services/api'
import { formatDate } from '../../utils/helpers'
import Loading from '../../components/ui/Loading'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'

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

  if (loading) return <Loading />

  return (
    <div className="page page-lg">
      <h2 style={{ marginBottom: '24px' }}>My Profile</h2>

      {message && <Alert type="success">{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <div className="profile-grid">

        {/* Left: avatar card */}
        <div className="card card-flush">
          <div className="profile-hero">
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'relative', border: '4px solid #fff', borderRadius: '50%', boxShadow: '0 2px 10px rgba(0,0,0,0.18)' }}>
                <Avatar name={profile?.full_name} src={profile?.profile_photo} className="avatar-xl" />
                {photoUploading && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '12px', fontWeight: '600'
                  }}>...</div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={photoUploading}
                title="Change photo"
                aria-label="Change profile photo"
                style={{
                  position: 'absolute', bottom: '2px', right: '2px',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--primary)', border: '3px solid #fff', color: '#fff',
                  cursor: 'pointer', fontSize: '15px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}
              ><FontAwesomeIcon icon={faCamera} /></button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} style={{ display: 'none' }} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '19px', fontWeight: '700' }}>{profile?.full_name}</p>
              <p style={{ fontSize: '13px', opacity: 0.85, marginTop: '2px' }}>{profile?.email}</p>
            </div>

            {profile?.profile_photo && (
              <button onClick={handlePhotoDelete} disabled={photoUploading} className="btn btn-sm btn-pill" style={{
                background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '12px'
              }}>Remove photo</button>
            )}
          </div>

          <div style={{ padding: '18px 24px' }}>
            <p className="field-label" style={{ marginBottom: '6px' }}>Account Status</p>
            <Badge status={profile?.status} />

            <p className="field-label" style={{ marginTop: '16px' }}>Member Since</p>
            <p className="field-value">{profile?.createdAt ? formatDate(profile.createdAt) : '—'}</p>
          </div>
        </div>

        {/* Right: details card */}
        <div className="card card-pad-lg">
          {!editing ? (
            <>
              <div className="card-row" style={{ marginBottom: '28px' }}>
                <h3>Personal Information</h3>
                <button onClick={() => setEditing(true)} className="btn btn-primary btn-sm">Edit Profile</button>
              </div>
              <div className="grid-2" style={{ gap: '28px' }}>
                <div>
                  <p className="field-label">Full Name</p>
                  <p className="field-value">{profile?.full_name}</p>
                </div>
                <div>
                  <p className="field-label">Phone</p>
                  <p className="field-value">{profile?.phone || '—'}</p>
                </div>
                <div>
                  <p className="field-label">Email</p>
                  <p className="field-value">{profile?.email}</p>
                </div>
                <div>
                  <p className="field-label">Buyer ID</p>
                  <p className="field-value">#{profile?.buyer_id}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 style={{ marginBottom: '24px' }}>Edit Personal Information</h3>
              <div className="grid-2" style={{ marginBottom: '28px' }}>
                <div>
                  <label className="label" htmlFor="profile-name">Full Name</label>
                  <input id="profile-name" value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label" htmlFor="profile-phone">Phone</label>
                  <input id="profile-phone" value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })} className="input" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleSave} className="btn btn-primary">Save Changes</button>
                <button
                  onClick={() => { setEditing(false); setFormData({ full_name: profile.full_name, phone: profile.phone || '' }) }}
                  className="btn btn-secondary"
                >Cancel</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
