export const formatPrice = (price) =>
  `$${Number(price).toLocaleString()}`

export const formatDate = (date) =>
  new Date(date).toLocaleDateString()

export const formatDateTime = (date) =>
  new Date(date).toLocaleString()

export const statusColor = (status) => {
  const map = {
    available: { bg: '#d1fae5', text: '#065f46' },
    confirmed:  { bg: '#d1fae5', text: '#065f46' },
    active:     { bg: '#d1fae5', text: '#065f46' },
    resolved:   { bg: '#d1fae5', text: '#065f46' },
    pending:    { bg: '#fef3c7', text: '#92400e' },
    reviewed:   { bg: '#dbeafe', text: '#1e40af' },
    cancelled:  { bg: '#fee2e2', text: '#991b1b' },
    suspended:  { bg: '#fee2e2', text: '#991b1b' },
    sold:       { bg: '#f3f4f6', text: '#374151' },
  }
  return map[status] || { bg: '#f3f4f6', text: '#374151' }
}