import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'

const ListingDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [questions, setQuestions] = useState([])
  const [newQuestion, setNewQuestion] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingNote, setBookingNote] = useState('')
  const [bookingMsg, setBookingMsg] = useState('')

  useEffect(() => {
    Promise.all([
      api.get(`/listings/${id}`),
      api.get(`/qa/listing/${id}`)
    ]).then(([listingRes, qaRes]) => {
      setListing(listingRes.data.data)
      setQuestions(qaRes.data.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    try {
      await api.post(`/buyers/saved/${id}`)
      setSaved(true)
    } catch (err) {
      console.error(err)
    }
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    try {
      await api.post('/appointments', {
        appointment_date: bookingDate,
        note: bookingNote,
        listing_id: parseInt(id)
      })
      setBookingMsg('Appointment booked successfully!')
      setBookingDate('')
      setBookingNote('')
    } catch (err) {
      setBookingMsg('Failed to book appointment.')
    }
  }

  const handlePostQuestion = async (e) => {
    e.preventDefault()
    try {
      await api.post('/qa', {
        body: newQuestion,
        listing_id: parseInt(id),
        is_anonymous: isAnonymous
      })
      setNewQuestion('')
      const res = await api.get(`/qa/listing/${id}`)
      setQuestions(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>
  if (!listing) return <p style={{ padding: '40px' }}>Listing not found.</p>

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={() => navigate('/buyer')} style={{
        background: 'none', border: 'none', color: '#1a56db',
        fontWeight: '600', fontSize: '14px', marginBottom: '24px',
        padding: 0, cursor: 'pointer'
      }}>← Back to Listings</button>

      {/* Listing Info */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h2 style={{ marginBottom: '6px' }}>{listing.title}</h2>
            <p style={{ color: '#6b7280' }}> {listing.city} — {listing.address}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '26px', fontWeight: '800', color: '#1a56db' }}>
              ${Number(listing.price).toLocaleString()}
            </p>
            <span style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
              fontSize: '13px', fontWeight: '600', marginTop: '6px',
              background: listing.status === 'available' ? '#d1fae5' : '#fef3c7',
              color: listing.status === 'available' ? '#065f46' : '#92400e'
            }}>{listing.status}</span>
          </div>
        </div>

        <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '16px' }}>{listing.description}</p>

        <span style={{
          padding: '6px 14px', background: '#f3f4f6',
          borderRadius: '6px', fontSize: '14px', fontWeight: '600'
        }}>{listing.property_type}</span>

        {/* Agent Info */}
        {listing.Agent && (
          <div style={{
            marginTop: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
          }}>
            <div>
              <p style={{ fontWeight: '700', marginBottom: '4px' }}>Agent: {listing.Agent.full_name}</p>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>{listing.Agent.agency_name} · {listing.Agent.phone}</p>
            </div>
            <button
              onClick={() => navigate(`/buyer/messages/${listing.agent_id}`, {
                state: { agentName: listing.Agent.full_name, agencyName: listing.Agent.agency_name }
              })}
              style={{
                padding: '9px 18px', background: '#1a56db', color: '#fff',
                border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px'
              }}
            >Message Agent</button>
          </div>
        )}

        {/* Details */}
        {listing.ListingDetails && listing.ListingDetails.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ marginBottom: '12px' }}>Property Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {listing.ListingDetails.map(d => (
                <div key={d.detail_id} style={{
                  background: '#f9fafb', padding: '12px',
                  borderRadius: '6px', textAlign: 'center'
                }}>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>{d.feature_name}</p>
                  <p style={{ fontWeight: '700', fontSize: '16px' }}>{d.feature_value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save button */}
        <button onClick={handleSave} disabled={saved} style={{
          marginTop: '20px', padding: '10px 24px',
          background: saved ? '#d1fae5' : '#1a56db', color: saved ? '#065f46' : '#fff',
          border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer'
        }}>{saved ? '✓ Saved' : 'Save Listing'}</button>
      </div>

      {/* Book Appointment */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Book an Appointment</h3>
        {bookingMsg && (
          <p style={{ color: bookingMsg.includes('success') ? '#065f46' : '#991b1b', marginBottom: '12px' }}>
            {bookingMsg}
          </p>
        )}
        <form onSubmit={handleBooking}>
          <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Date</label>
          <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)}
            required style={{
              width: '100%', padding: '10px', border: '1px solid #e5e7eb',
              borderRadius: '6px', fontSize: '15px', marginBottom: '12px'
            }} />
          <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Note (optional)</label>
          <textarea value={bookingNote} onChange={e => setBookingNote(e.target.value)}
            rows={2} placeholder="Any special requests..."
            style={{
              width: '100%', padding: '10px', border: '1px solid #e5e7eb',
              borderRadius: '6px', fontSize: '15px', marginBottom: '12px', resize: 'vertical'
            }} />
          <button type="submit" style={{
            padding: '10px 24px', background: '#1a56db', color: '#fff',
            border: 'none', borderRadius: '6px', fontWeight: '600'
          }}>Book Appointment</button>
        </form>
      </div>

      {/* Q&A */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Community Q&A</h3>
        <form onSubmit={handlePostQuestion} style={{ marginBottom: '24px' }}>
          <textarea value={newQuestion} onChange={e => setNewQuestion(e.target.value)}
            placeholder="Ask a question about this listing..."
            rows={3} required style={{
              width: '100%', padding: '10px', border: '1px solid #e5e7eb',
              borderRadius: '6px', fontSize: '15px', marginBottom: '8px', resize: 'vertical'
            }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', color: '#6b7280' }}>
              <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)}
                style={{ marginRight: '6px' }} />
              Ask anonymously
            </label>
            <button type="submit" style={{
              padding: '8px 20px', background: '#1a56db', color: '#fff',
              border: 'none', borderRadius: '6px', fontWeight: '600'
            }}>Post Question</button>
          </div>
        </form>

        {questions.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No questions yet. Be the first to ask!</p>
        ) : (
          questions.map(q => (
            <div key={q.question_id} style={{
              border: '1px solid #e5e7eb', borderRadius: '8px',
              padding: '16px', marginBottom: '12px'
            }}>
              <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                {q.is_anonymous ? 'Anonymous' : q.Buyer?.full_name}
              </p>
              <p style={{ marginBottom: '10px' }}>{q.body}</p>
              {q.tag && (
                <span style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                  background: '#dbeafe', color: '#1e40af', fontWeight: '600'
                }}>{q.tag}</span>
              )}
              {q.QaAnswers && q.QaAnswers.length > 0 && (
                <div style={{ borderLeft: '3px solid #1a56db', paddingLeft: '16px', marginTop: '12px' }}>
                  {q.QaAnswers.map(a => (
                    <div key={a.answer_id}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a56db' }}>
                        {a.Agent?.full_name} · {a.Agent?.agency_name}
                      </p>
                      <p style={{ fontSize: '14px' }}>{a.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ListingDetail