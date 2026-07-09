import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faCircleCheck, faClock } from '@fortawesome/free-solid-svg-icons'

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
    return api.get('/agents/profile')
      .then(res => {
        setProfile(res.data.data)
        setFormData({
          full_name: res.data.data.full_name,
          phone: res.data.data.phone || '',
          agency_name: res.data.data.agency_name || ''
        })
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
      await api.put('/agents/profile', formData)
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
      const res = await api.post('/agents/profile/photo', form, {
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
      const res = await api.delete('/agents/profile/photo')
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
            <p className="field-label" style={{ marginBottom: '6px' }}>Verification Status</p>
            <Badge variant={profile?.is_verified ? 'success' : 'warning'}>
              <FontAwesomeIcon icon={profile?.is_verified ? faCircleCheck : faClock} style={{ marginRight: '5px' }} />
              {profile?.is_verified ? 'Verified' : 'Pending verification'}
            </Badge>

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
                  <p className="field-label">Agency Name</p>
                  <p className="field-value">{profile?.agency_name || '—'}</p>
                </div>
                <div>
                  <p className="field-label">Agent ID</p>
                  <p className="field-value">#{profile?.agent_id}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 style={{ marginBottom: '24px' }}>Edit Personal Information</h3>
              <div className="grid-2" style={{ marginBottom: '28px' }}>
                <div>
                  <label className="label" htmlFor="agent-name">Full Name</label>
                  <input id="agent-name" value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label" htmlFor="agent-phone">Phone</label>
                  <input id="agent-phone" value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label" htmlFor="agent-agency">Agency Name</label>
                  <input id="agent-agency" value={formData.agency_name}
                    onChange={e => setFormData({ ...formData, agency_name: e.target.value })} className="input" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleSave} className="btn btn-primary">Save Changes</button>
                <button
                  onClick={() => {
                    setEditing(false)
                    setFormData({ full_name: profile.full_name, phone: profile.phone || '', agency_name: profile.agency_name || '' })
                  }}
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
