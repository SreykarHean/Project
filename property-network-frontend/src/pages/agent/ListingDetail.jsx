import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

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

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>
  if (!listing) return <p style={{ padding: '40px' }}>Listing not found.</p>

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={() => navigate('/agent/listings')} style={{
        background: 'none', border: 'none', color: '#1a56db',
        fontWeight: '600', fontSize: '14px', marginBottom: '24px', padding: 0
      }}>← Back to Listings</button>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ marginBottom: '6px' }}>{listing.title}</h2>
            <p style={{ color: '#6b7280' }}>{listing.city} — {listing.address}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#1a56db' }}>
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

        <p style={{ color: '#374151', marginBottom: '20px', lineHeight: '1.6' }}>{listing.description}</p>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <span style={{
            padding: '6px 14px', background: '#f3f4f6',
            borderRadius: '6px', fontSize: '14px', fontWeight: '600'
          }}>{listing.property_type}</span>
        </div>

        {listing.ListingDetails && listing.ListingDetails.length > 0 && (
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginBottom: '20px' }}>
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

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={() => navigate(`/agent/listings/edit/${id}`)} style={{
            padding: '10px 24px', background: '#1a56db', color: '#fff',
            border: 'none', borderRadius: '6px', fontWeight: '600'
          }}>Edit Listing</button>
        </div>
      </div>

      {/* Q&A */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '24px', marginTop: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Community Q&A</h3>

        {qaLoading ? (
          <p style={{ color: '#9ca3af' }}>Loading questions...</p>
        ) : questions.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No questions yet for this listing.</p>
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

              {q.QaAnswers && q.QaAnswers.length > 0 && (
                <div style={{ borderLeft: '3px solid #1a56db', paddingLeft: '16px', marginTop: '12px', marginBottom: '12px' }}>
                  {q.QaAnswers.map(a => (
                    <div key={a.answer_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a56db' }}>
                          {a.Agent?.full_name} · {a.Agent?.agency_name}
                        </p>
                        <p style={{ fontSize: '14px' }}>{a.body}</p>
                      </div>
                      {a.agent_id === user?.id && (
                        <button onClick={() => handleDeleteAnswer(a.answer_id)} style={{
                          background: 'none', border: 'none', color: '#b91c1c',
                          fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', padding: 0, flexShrink: 0
                        }}>Delete</button>
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
                  style={{
                    flex: 1, padding: '9px 12px', border: '1px solid #e5e7eb',
                    borderRadius: '6px', fontSize: '14px', outline: 'none'
                  }}
                />
                <button type="submit" disabled={!answerDrafts[q.question_id]?.trim() || answering[q.question_id]} style={{
                  padding: '9px 18px',
                  background: answerDrafts[q.question_id]?.trim() ? '#1a56db' : '#c7d2fe',
                  color: '#fff', border: 'none', borderRadius: '6px',
                  fontWeight: '600', cursor: answerDrafts[q.question_id]?.trim() ? 'pointer' : 'default'
                }}>{answering[q.question_id] ? 'Posting...' : 'Reply'}</button>
              </form>
            </div>
          ))
        )}
      </div>

      {/* Reports on this listing */}
      {reports.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #fca5a5', borderRadius: '10px', padding: '24px', marginTop: '24px' }}>
          <h3 style={{ marginBottom: '4px', color: '#991b1b' }}>Reports on this listing</h3>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
            Buyer identities are withheld. You can respond below to give your side before admin reviews it.
          </p>

          {reportsLoading ? (
            <p style={{ color: '#9ca3af' }}>Loading reports...</p>
          ) : (
            reports.map(r => (
              <div key={r.report_id} style={{
                border: '1px solid #fecaca', borderRadius: '8px',
                padding: '16px', marginBottom: '12px', background: '#fef2f2'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p style={{ fontWeight: '600' }}>{r.report_type}</p>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                    background: r.status === 'resolved' ? '#d1fae5' : r.status === 'reviewed' ? '#dbeafe' : '#fef3c7',
                    color: r.status === 'resolved' ? '#065f46' : r.status === 'reviewed' ? '#1e40af' : '#92400e'
                  }}>{r.status}</span>
                </div>
                <p style={{ fontSize: '14px', color: '#374151', marginBottom: '12px' }}>{r.reason}</p>

                {r.agent_response ? (
                  <div style={{ borderLeft: '3px solid #1a56db', paddingLeft: '12px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#1a56db', marginBottom: '2px' }}>Your response</p>
                    <p style={{ fontSize: '14px' }}>{r.agent_response}</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleSubmitResponse(e, r.report_id)} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      value={responseDrafts[r.report_id] || ''}
                      onChange={e => handleResponseChange(r.report_id, e.target.value)}
                      placeholder="Explain your side..."
                      style={{
                        flex: 1, padding: '9px 12px', border: '1px solid #e5e7eb',
                        borderRadius: '6px', fontSize: '14px', outline: 'none'
                      }}
                    />
                    <button type="submit" disabled={!responseDrafts[r.report_id]?.trim() || responding[r.report_id]} style={{
                      padding: '9px 18px',
                      background: responseDrafts[r.report_id]?.trim() ? '#1a56db' : '#c7d2fe',
                      color: '#fff', border: 'none', borderRadius: '6px',
                      fontWeight: '600', cursor: responseDrafts[r.report_id]?.trim() ? 'pointer' : 'default'
                    }}>{responding[r.report_id] ? 'Submitting...' : 'Respond'}</button>
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