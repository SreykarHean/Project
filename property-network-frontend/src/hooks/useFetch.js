import { useState, useEffect } from 'react'
import api from '../services/api'

const useFetch = (url) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) return
    setLoading(true)
    api.get(url)
      .then(res => setData(res.data.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [url])

  return { data, loading, error }
}

export default useFetch