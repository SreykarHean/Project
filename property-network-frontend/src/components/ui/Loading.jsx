const Loading = ({ label = 'Loading...' }) => (
  <div className="loading" role="status">
    <span className="spinner" aria-hidden="true" />
    {label}
  </div>
)

export default Loading
