const EmptyState = ({ icon, title, children }) => (
  <div className="empty-state">
    {icon && <div className="empty-icon">{icon}</div>}
    {title && <p className="empty-title">{title}</p>}
    {children}
  </div>
)

export default EmptyState
