const Alert = ({ type = 'error', onClose, children }) => (
  <div className={`alert alert-${type}`}>
    <span>{children}</span>
    {onClose && (
      <button className="alert-close" onClick={onClose} aria-label="Dismiss">×</button>
    )}
  </div>
)

export default Alert
