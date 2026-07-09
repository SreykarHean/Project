import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { formatPrice } from '../../utils/helpers'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'

const ListingDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [listing, setListing] = useState(null)
  const [questions, setQuestions] = useState([])
  const [newQuestion, setNewQuestion] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingNote, setBookingNote] = useState('')
  const [bookingMsg, setBookingMsg] = useState('')
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportType, setReportType] = useState('Fake listing')
  const [reportReason, setReportReason] = useState('')
  const [reportMsg, setReportMsg] = useState('')
  const [reportSubmitted, setReportSubmitted] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewMsg, setReviewMsg] = useState('')

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

  useEffect(() => {
    if (!listing?.agent_id) return
    api.get(`/reviews/agent/${listing.agent_id}`)
      .then(res => setReviews(res.data.data))
      .catch(console.error)
      .finally(() => setReviewsLoading(false))
  }, [listing?.agent_id])

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
    } catch {
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

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Delete this question? Any answers to it will be removed too.')) return
    try {
      await api.delete(`/qa/${questionId}`)
      setQuestions(prev => prev.filter(q => q.question_id !== questionId))
    } catch (err) {
      console.error(err)
    }
  }

  const handleReportSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/reports', {
        report_type: reportType,
        reason: reportReason,
        listing_id: parseInt(id)
      })
      setReportMsg('Report submitted. Our team will review it.')
      setReportSubmitted(true)
      setReportReason('')
    } catch {
      setReportMsg('Failed to submit report. Please try again.')
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!listing?.agent_id || !reviewComment.trim()) return
    setReviewSubmitting(true)
    setReviewMsg('')
    try {
      await api.post('/reviews', {
        agent_id: listing.agent_id,
        rating: reviewRating,
        comment: reviewComment.trim()
      })
      setReviewComment('')
      setReviewRating(5)
      const res = await api.get(`/reviews/agent/${listing.agent_id}`)
      setReviews(res.data.data)
      setReviewMsg('Review posted. Thanks for the feedback!')
    } catch (err) {
      setReviewMsg('Failed to post review. Please try again.')
    } finally {
      setReviewSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Delete your review?')) return
    try {
      await api.delete(`/reviews/${reviewId}`)
      setReviews(prev => prev.filter(r => r.review_id !== reviewId))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <Loading />
  if (!listing) return <EmptyState title="Listing not found." />

  return (
    <div className="page page-md">
      <button onClick={() => navigate('/buyer')} className="back-link">← Back to Listings</button>

      {/* Listing Info */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div className="card-row" style={{ alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h2 style={{ marginBottom: '6px' }}>{listing.title}</h2>
            <p style={{ color: 'var(--text-light)' }}>{listing.city} — {listing.address}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '26px', fontWeight: '800', color: 'var(--primary)' }}>
              {formatPrice(listing.price)}
            </p>
            <Badge status={listing.status} style={{ marginTop: '6px' }} />
          </div>
        </div>

        <p style={{ color: 'var(--neutral-text)', lineHeight: '1.6', marginBottom: '16px' }}>
          {listing.description}
        </p>

        <Badge variant="neutral">{listing.property_type}</Badge>

        {/* Agent Info */}
        {listing.Agent && (
          <div className="card-row" style={{
            marginTop: '20px', padding: '16px',
            background: 'var(--bg)', borderRadius: 'var(--radius)'
          }}>
            <div>
              <p style={{ fontWeight: '700', marginBottom: '4px' }}>Agent: {listing.Agent.full_name}</p>
              <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                {listing.Agent.agency_name} · {listing.Agent.phone}
              </p>
            </div>
            <button
              onClick={() => navigate(`/buyer/messages/${listing.agent_id}`, {
                state: { agentName: listing.Agent.full_name, agencyName: listing.Agent.agency_name }
              })}
              className="btn btn-primary btn-sm"
            >Message Agent</button>
          </div>
        )}

        {/* Details */}
        {listing.ListingDetails && listing.ListingDetails.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ marginBottom: '12px' }}>Property Details</h4>
            <div className="grid-details">
              {listing.ListingDetails.map(d => (
                <div key={d.detail_id} style={{
                  background: 'var(--bg)', padding: '12px',
                  borderRadius: 'var(--radius-sm)', textAlign: 'center'
                }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>{d.feature_name}</p>
                  <p style={{ fontWeight: '700', fontSize: '16px' }}>{d.feature_value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={handleSave}
            disabled={saved}
            className={saved ? 'btn btn-success-soft' : 'btn btn-primary'}
          >{saved ? '✓ Saved' : 'Save Listing'}</button>

          {!reportSubmitted && (
            <button onClick={() => setShowReportForm(v => !v)} className="btn btn-outline-danger">
              ⚑ Report Listing
            </button>
          )}
        </div>

        {showReportForm && !reportSubmitted && (
          <form onSubmit={handleReportSubmit} style={{
            marginTop: '16px', padding: '16px', background: '#fef2f2',
            border: '1px solid var(--danger-border)', borderRadius: 'var(--radius)'
          }}>
            <div className="form-group">
              <label className="label" htmlFor="report-type">Reason type</label>
              <select id="report-type" value={reportType} onChange={e => setReportType(e.target.value)} className="input">
                <option>Fake listing</option>
                <option>Misleading information</option>
                <option>Inappropriate content</option>
                <option>Scam / fraud attempt</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label" htmlFor="report-reason">Details</label>
              <textarea id="report-reason" value={reportReason} onChange={e => setReportReason(e.target.value)}
                placeholder="Describe the issue..." rows={3} required className="input" />
            </div>
            <button type="submit" className="btn btn-danger">Submit Report</button>
          </form>
        )}

        {reportMsg && (
          <p style={{
            marginTop: '12px', fontSize: '14px',
            color: reportSubmitted ? 'var(--success-text)' : 'var(--danger-text)'
          }}>{reportMsg}</p>
        )}
      </div>

      {/* Book Appointment */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Book an Appointment</h3>
        {bookingMsg && (
          <p style={{
            color: bookingMsg.includes('success') ? 'var(--success-text)' : 'var(--danger-text)',
            marginBottom: '12px'
          }}>{bookingMsg}</p>
        )}
        <form onSubmit={handleBooking}>
          <div className="form-group">
            <label className="label" htmlFor="booking-date">Date</label>
            <input id="booking-date" type="date" value={bookingDate}
              onChange={e => setBookingDate(e.target.value)} required className="input" />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="booking-note">Note (optional)</label>
            <textarea id="booking-note" value={bookingNote} onChange={e => setBookingNote(e.target.value)}
              rows={2} placeholder="Any special requests..." className="input" />
          </div>
          <button type="submit" className="btn btn-primary">Book Appointment</button>
        </form>
      </div>

      {/* Q&A */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Community Q&A</h3>
        <form onSubmit={handlePostQuestion} style={{ marginBottom: '24px' }}>
          <textarea value={newQuestion} onChange={e => setNewQuestion(e.target.value)}
            placeholder="Ask a question about this listing..."
            aria-label="Your question"
            rows={3} required className="input" style={{ marginBottom: '8px' }} />
          <div className="card-row">
            <label className="checkbox-label">
              <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} />
              Ask anonymously
            </label>
            <button type="submit" className="btn btn-primary btn-sm">Post Question</button>
          </div>
        </form>

        {questions.length === 0 ? (
          <p style={{ color: 'var(--text-light)' }}>No questions yet. Be the first to ask!</p>
        ) : (
          questions.map(q => (
            <div key={q.question_id} className="card" style={{
              padding: '16px', marginBottom: '12px', borderRadius: 'var(--radius)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                  {q.is_anonymous ? 'Anonymous' : q.Buyer?.full_name}
                </p>
                {q.buyer_id === user?.id && (
                  <button onClick={() => handleDeleteQuestion(q.question_id)}
                    className="btn-link" style={{ color: 'var(--danger-dark)', fontSize: '13px' }}>
                    Delete
                  </button>
                )}
              </div>
              <p style={{ marginBottom: '10px' }}>{q.body}</p>
              {q.tag && <Badge variant="info">{q.tag}</Badge>}
              {q.QaAnswers && q.QaAnswers.length > 0 && (
                <div className="answer-thread">
                  {q.QaAnswers.map(a => (
                    <div key={a.answer_id}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>
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

      {/* Agent Reviews */}
      {listing.Agent && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '24px', marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3>Reviews for {listing.Agent.full_name}</h3>
            {reviews.length > 0 && (
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>
                ★ {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} ({reviews.length})
              </span>
            )}
          </div>

          <form onSubmit={handleSubmitReview} style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setReviewRating(star)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  fontSize: '22px', color: star <= reviewRating ? '#f59e0b' : '#e5e7eb'
                }}>★</button>
              ))}
            </div>
            <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
              placeholder="Share your experience working with this agent..."
              rows={3} required style={{
                width: '100%', padding: '10px', border: '1px solid #e5e7eb',
                borderRadius: '6px', fontSize: '15px', marginBottom: '10px', resize: 'vertical'
              }} />
            <button type="submit" disabled={!reviewComment.trim() || reviewSubmitting} style={{
              padding: '9px 20px',
              background: reviewComment.trim() ? '#106AA3' : '#c7d2fe', color: '#fff',
              border: 'none', borderRadius: '6px', fontWeight: '600',
              cursor: reviewComment.trim() ? 'pointer' : 'default'
            }}>{reviewSubmitting ? 'Posting...' : 'Post Review'}</button>
            {reviewMsg && (
              <p style={{ marginTop: '10px', fontSize: '14px', color: reviewMsg.includes('Failed') ? '#991b1b' : '#065f46' }}>
                {reviewMsg}
              </p>
            )}
          </form>

          {reviewsLoading ? (
            <p style={{ color: '#9ca3af' }}>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No reviews yet. Be the first to review this agent!</p>
          ) : (
            reviews.map(r => (
              <div key={r.review_id} style={{
                borderTop: '1px solid #f3f4f6', paddingTop: '12px', marginTop: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: '600', marginBottom: '2px' }}>{r.Buyer?.full_name}</p>
                    <p style={{ color: '#f59e0b', fontSize: '14px', marginBottom: '4px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                  </div>
                  {r.buyer_id === user?.id && (
                    <button onClick={() => handleDeleteReview(r.review_id)} style={{
                      background: 'none', border: 'none', color: '#b91c1c',
                      fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: 0
                    }}>Delete</button>
                  )}
                </div>
                <p style={{ fontSize: '14px', color: '#374151' }}>{r.comment}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default ListingDetail
