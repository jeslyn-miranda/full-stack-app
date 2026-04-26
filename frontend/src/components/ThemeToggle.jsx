import { useTheme } from '../theme/ThemeContext.jsx'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="btn btn-ghost"
      aria-label="Toggle theme"
      style={{ width: '100%', justifyContent: 'center' }}
    >
      {theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
    </button>
  )
}
