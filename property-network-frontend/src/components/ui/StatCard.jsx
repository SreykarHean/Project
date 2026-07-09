const StatCard = ({ label, value, color }) => (
  <div className="card stat-card">
    <p className="stat-value" style={color ? { color } : undefined}>{value}</p>
    <p className="stat-label">{label}</p>
  </div>
)

export default StatCard
