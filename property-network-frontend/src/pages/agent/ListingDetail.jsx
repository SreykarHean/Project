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
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const [qaLoading, setQaLoading] = useState(true)
  const [answerDrafts, setAnswerDrafts] = useState({})
  const [answering, setAnswering] = useState({})
  const [reports, setReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(true)
  const [responseDrafts, setResponseDrafts] = useState({})
  const [responding, setResponding] = useState({})

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then(res => setListing(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))

    api.get(`/qa/listing/${id}`)
      .then(res => setQuestions(res.data.data))
      .catch(console.error)
      .finally(() => setQaLoading(false))

    api.get(`/reports/listing/${id}`)
      .then(res => setReports(res.data.data))
      .catch(console.error)
      .finally(() => setReportsLoading(false))
  }, [id])

  const handleAnswerChange = (questionId, value) => {
    setAnswerDrafts(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmitAnswer = async (e, questionId) => {
    e.preventDefault()
    const body = (answerDrafts[questionId] || '').trim()
    if (!body) return
    setAnswering(prev => ({ ...prev, [questionId]: true }))
    try {
      await api.post(`/qa/${questionId}/answers`, { body })
      setAnswerDrafts(prev => ({ ...prev, [questionId]: '' }))
      const res = await api.get(`/qa/listing/${id}`)
      setQuestions(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setAnswering(prev => ({ ...prev, [questionId]: false }))
    }
  }

  const handleDeleteAnswer = async (answerId) => {
    if (!confirm('Delete this answer?')) return
    try {
      await api.delete(`/qa/answers/${answerId}`)
      const res = await api.get(`/qa/listing/${id}`)
      setQuestions(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleResponseChange = (reportId, value) => {
    setResponseDrafts(prev => ({ ...prev, [reportId]: value }))
  }

  const handleSubmitResponse = async (e, reportId) => {
    e.preventDefault()
    const response = (responseDrafts[reportId] || '').trim()
    if (!response) return
    setResponding(prev => ({ ...prev, [reportId]: true }))
    try {
      await api.patch(`/reports/${reportId}/response`, { response })
      const res = await api.get(`/reports/listing/${id}`)
      setReports(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setResponding(prev => ({ ...prev, [reportId]: false }))
    }
  }

  if (loading) return <Loading />
  if (!listing) return <EmptyState title="Listing not found." />

  return (
    <div className="page page-md">
      <button onClick={() => navigate('/agent/listings')} className="back-link">← Back to Listings</button>

      <div className="card" style={{ padding: '24px' }}>
        <div className="card-row" style={{ alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ marginBottom: '6px' }}>{listing.title}</h2>
            <p style={{ color: 'var(--text-light)' }}>{listing.city} — {listing.address}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
              {formatPrice(listing.price)}
            </p>
            <Badge status={listing.status} style={{ marginTop: '6px' }} />
          </div>
        </div>

        <p style={{ color: 'var(--neutral-text)', marginBottom: '20px', lineHeight: '1.6' }}>
          {listing.description}
        </p>

        <Badge variant="neutral">{listing.property_type}</Badge>

        {listing.ListingDetails && listing.ListingDetails.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', margin: '20px 0' }}>
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

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={() => navigate(`/agent/listings/edit/${id}`)} className="btn btn-primary">
            Edit Listing
          </button>
        </div>
      </div>

      {/* Q&A */}
      <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Community Q&A</h3>

        {qaLoading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading questions...</p>
        ) : questions.length === 0 ? (
          <p style={{ color: 'var(--text-light)' }}>No questions yet for this listing.</p>
        ) : (
          questions.map(q => (
            <div key={q.question_id} className="card" style={{
              padding: '16px', marginBottom: '12px', borderRadius: 'var(--radius)'
            }}>
              <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                {q.is_anonymous ? 'Anonymous' : q.Buyer?.full_name}
              </p>
              <p style={{ marginBottom: '10px' }}>{q.body}</p>

              {q.QaAnswers && q.QaAnswers.length > 0 && (
                <div className="answer-thread" style={{ marginBottom: '12px' }}>
                  {q.QaAnswers.map(a => (
                    <div key={a.answer_id} style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', gap: '8px'
                    }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>
                          {a.Agent?.full_name} · {a.Agent?.agency_name}
                        </p>
                        <p style={{ fontSize: '14px' }}>{a.body}</p>
                      </div>
                      {a.agent_id === user?.id && (
                        <button onClick={() => handleDeleteAnswer(a.answer_id)}
                          className="btn-link" style={{ color: 'var(--danger-dark)', fontSize: '12.5px', flexShrink: 0 }}>
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={(e) => handleSubmitAnswer(e, q.question_id)} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input
                  value={answerDrafts[q.question_id] || ''}
                  onChange={e => handleAnswerChange(q.question_id, e.target.value)}
                  placeholder="Write a reply..."
                  aria-label="Reply to question"
                  className="input"
                  style={{ flex: 1 }}
                />
                <button type="submit"
                  disabled={!answerDrafts[q.question_id]?.trim() || answering[q.question_id]}
                  className="btn btn-primary">
                  {answering[q.question_id] ? 'Posting...' : 'Reply'}
                </button>
              </form>
            </div>
          ))
        )}
      </div>

      {/* Reports on this listing */}
      {reports.length > 0 && (
        <div className="card" style={{ padding: '24px', marginTop: '24px', borderColor: 'var(--danger-border)' }}>
          <h3 style={{ marginBottom: '4px', color: 'var(--danger-text)' }}>Reports on this listing</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '16px' }}>
            Buyer identities are withheld. You can respond below to give your side before admin reviews it.
          </p>

          {reportsLoading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading reports...</p>
          ) : (
            reports.map(r => (
              <div key={r.report_id} style={{
                border: '1px solid #fecaca', borderRadius: 'var(--radius)',
                padding: '16px', marginBottom: '12px', background: '#fef2f2'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p style={{ fontWeight: '600' }}>{r.report_type}</p>
                  <Badge status={r.status} />
                </div>
                <p style={{ fontSize: '14px', color: 'var(--neutral-text)', marginBottom: '12px' }}>{r.reason}</p>

                {r.agent_response ? (
                  <div className="answer-thread" style={{ marginTop: 0, paddingLeft: '12px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)', marginBottom: '2px' }}>
                      Your response
                    </p>
                    <p style={{ fontSize: '14px' }}>{r.agent_response}</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleSubmitResponse(e, r.report_id)} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      value={responseDrafts[r.report_id] || ''}
                      onChange={e => handleResponseChange(r.report_id, e.target.value)}
                      placeholder="Explain your side..."
                      aria-label="Respond to report"
                      className="input"
                      style={{ flex: 1 }}
                    />
                    <button type="submit"
                      disabled={!responseDrafts[r.report_id]?.trim() || responding[r.report_id]}
                      className="btn btn-primary">
                      {responding[r.report_id] ? 'Submitting...' : 'Respond'}
                    </button>
                  </form>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default ListingDetail
