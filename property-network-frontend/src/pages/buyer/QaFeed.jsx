import { useState, useEffect } from 'react'
import api from '../../services/api'

const QaFeed = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/qa')
      .then(res => setQuestions(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>Community Q&A</h2>
      {questions.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No questions yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {questions.map(q => (
            <div key={q.question_id} style={{
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: '8px', padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '600' }}>
                  {q.is_anonymous ? 'Anonymous' : q.Buyer?.full_name}
                </span>
                {q.tag && (
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                    background: '#dbeafe', color: '#1e40af', fontWeight: '600'
                  }}>{q.tag}</span>
                )}
              </div>
              <p style={{ marginBottom: '12px' }}>{q.body}</p>

              {q.QaAnswers && q.QaAnswers.length > 0 && (
                <div style={{ borderLeft: '3px solid #1a56db', paddingLeft: '16px', marginTop: '12px' }}>
                  {q.QaAnswers.map(a => (
                    <div key={a.answer_id} style={{ marginBottom: '8px' }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a56db', marginBottom: '4px' }}>
                        {a.Agent?.full_name} · {a.Agent?.agency_name}
                      </p>
                      <p style={{ fontSize: '14px' }}>{a.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default QaFeed