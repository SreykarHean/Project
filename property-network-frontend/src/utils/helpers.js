export const formatPrice = (price) =>
  `$${Number(price).toLocaleString()}`

export const formatDate = (date) =>
  new Date(date).toLocaleDateString()

export const formatDateTime = (date) =>
  new Date(date).toLocaleString()

// Maps a domain status to a badge variant class (see .badge-* in index.css)
export const statusVariant = (status) => {
  const map = {
    available: 'success',
    confirmed: 'success',
    active: 'success',
    resolved: 'success',
    verified: 'success',
    pending: 'warning',
    unverified: 'warning',
    reviewed: 'info',
    cancelled: 'danger',
    suspended: 'danger',
    sold: 'neutral',
    archived: 'neutral',
  }
  return map[String(status).toLowerCase()] || 'neutral'
}

export const initialsOf = (name) =>
  (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
