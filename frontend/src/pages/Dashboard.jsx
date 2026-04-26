import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from 'recharts'
import api from '../api/client.js'

const STATUS_LABEL = {
  TODO: 'To-do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'In Review',
  COMPLETE: 'Complete',
}
const STATUS_COLOR = {
  TODO: '#d6c2fb',
  IN_PROGRESS: '#a0c4ff',
  IN_REVIEW: '#ffd6a5',
  COMPLETE: '#c7e9b0',
}

function weekKey(iso) {
  const d = new Date(iso)
  const onejan = new Date(d.getFullYear(), 0, 1)
  const wk = Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7)
  return `W${wk}`
}

function progressBucket(p) {
  if (p === 0) return '0%'
  if (p < 25) return '1–24%'
  if (p < 50) return '25–49%'
  if (p < 75) return '50–74%'
  if (p < 100) return '75–99%'
  return '100%'
}

const BUCKET_ORDER = ['0%', '1–24%', '25–49%', '50–74%', '75–99%', '100%']

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/tasks').then(({ data }) => {
      setTasks(data)
      setLoading(false)
    })
  }, [])

  const stats = useMemo(() => {
    const total = tasks.length
    const complete = tasks.filter((t) => t.status === 'COMPLETE').length
    const pending = total - complete
    const avg = total ? Math.round(tasks.reduce((s, t) => s + (t.progress || 0), 0) / total) : 0
    return { total, complete, pending, avg }
  }, [tasks])

  const perCategory = useMemo(() => {
    const m = new Map()
    tasks.forEach((t) => {
      const key = t.category || 'Uncategorized'
      m.set(key, (m.get(key) || 0) + 1)
    })
    return Array.from(m, ([name, value]) => ({ name, value }))
  }, [tasks])

  const perStatus = useMemo(() =>
    Object.keys(STATUS_LABEL).map((k) => ({
      name: STATUS_LABEL[k],
      value: tasks.filter((t) => t.status === k).length,
      key: k,
    })), [tasks])

  const completedOverTime = useMemo(() => {
    const m = new Map()
    tasks
      .filter((t) => t.status === 'COMPLETE')
      .forEach((t) => {
        const w = weekKey(t.updatedAt)
        m.set(w, (m.get(w) || 0) + 1)
      })
    return Array.from(m, ([name, value]) => ({ name, value }))
  }, [tasks])

  const progressDist = useMemo(() => {
    const m = new Map(BUCKET_ORDER.map((k) => [k, 0]))
    tasks.forEach((t) => m.set(progressBucket(t.progress ?? 0), (m.get(progressBucket(t.progress ?? 0)) || 0) + 1))
    return BUCKET_ORDER.map((name) => ({ name, value: m.get(name) }))
  }, [tasks])

  if (loading) {
    return (
      <>
        <div className="main-header"><h1>Dashboard</h1></div>
        <div className="empty">Loading…</div>
      </>
    )
  }

  if (tasks.length === 0) {
    return (
      <>
        <div className="main-header">
          <div>
            <h1>Dashboard</h1>
            <div className="subtitle">A snapshot of your study progress.</div>
          </div>
        </div>
        <div className="empty-hero">
          <div className="empty-hero-icon">📊</div>
          <h3>No data yet</h3>
          <p>Add some tasks and come back to see your charts.</p>
          <Link to="/tasks" className="btn btn-primary">Go to tasks</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="main-header">
        <div>
          <h1>Dashboard</h1>
          <div className="subtitle">A snapshot of your study progress.</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total tasks</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value">{stats.complete}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{stats.pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. progress</div>
          <div className="stat-value">{stats.avg}%</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Tasks by status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={perStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--text-light)" fontSize={12} />
              <YAxis stroke="var(--text-light)" fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {perStatus.map((s) => (
                  <Cell key={s.key} fill={STATUS_COLOR[s.key]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>By category</h3>
          {perCategory.length === 0 ? (
            <div className="empty">No categories yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={perCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {perCategory.map((_, i) => (
                    <Cell key={i} fill={['#d6bfa9', '#a0c4ff', '#ffd6a5', '#c7e9b0', '#d6c2fb'][i % 5]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card">
          <h3>Progress distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={progressDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--text-light)" fontSize={12} />
              <YAxis stroke="var(--text-light)" fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="var(--accent)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Completed over time</h3>
          {completedOverTime.length === 0 ? (
            <div className="empty">Finish a task to see your streak here.</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={completedOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-light)" fontSize={12} />
                <YAxis stroke="var(--text-light)" fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  )
}
