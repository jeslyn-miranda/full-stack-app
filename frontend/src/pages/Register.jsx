import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register(name, email, password)
      nav('/tasks', { replace: true })
    } catch (err) {
      const fields = err?.response?.data?.errors
      if (fields) setError(Object.values(fields).join('. '))
      else setError(err?.response?.data?.message || 'Could not register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>hello, friend ✿</h1>
        <div className="subtitle">Create your productivity space.</div>
        {error && <div className="error">{error}</div>}

        <div className="field">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        </div>

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </button>

        <div className="switch">
          Already have one? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  )
}
