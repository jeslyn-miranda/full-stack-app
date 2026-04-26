import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import ThemeToggle from './ThemeToggle.jsx'

const links = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/tasks', label: 'Tasks', icon: '✅' },
  { to: '/notes', label: 'Notes', icon: '📓' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">✿ study.</div>

      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.to === '/'}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span>{l.icon}</span>
          <span>{l.label}</span>
        </NavLink>
      ))}

      <div className="sidebar-footer">
        <ThemeToggle />
        <div style={{ fontSize: 12, color: 'var(--text-light)', padding: '0 8px' }}>
          {user?.name}
        </div>
        <button className="btn btn-ghost" onClick={logout} style={{ width: '100%', justifyContent: 'center' }}>
          Log out
        </button>
      </div>
    </aside>
  )
}
