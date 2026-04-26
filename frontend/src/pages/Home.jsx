import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Home() {
  const { user } = useAuth()
  return (
    <>
      <div className="main-header">
        <div>
          <h1>hello, {user?.name?.split(' ')[0] || 'friend'} ✿</h1>
          <div className="subtitle">A calm place to plan your study sessions.</div>
        </div>
      </div>

      <div className="stat-grid">
        <Link to="/tasks" className="stat-card" style={{ display: 'block' }}>
          <div className="stat-label">Plan</div>
          <div className="stat-value">Tasks</div>
          <div className="subtitle" style={{ marginTop: 8 }}>Kanban board for todos, progress, review, done.</div>
        </Link>
        <Link to="/dashboard" className="stat-card" style={{ display: 'block' }}>
          <div className="stat-label">Reflect</div>
          <div className="stat-value">Dashboard</div>
          <div className="subtitle" style={{ marginTop: 8 }}>Progress charts and category breakdown.</div>
        </Link>
      </div>
    </>
  )
}
