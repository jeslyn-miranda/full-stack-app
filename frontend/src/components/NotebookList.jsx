import { useState } from 'react'

export default function NotebookList({ notebooks, activeId, onSelect, onCreate, onDelete }) {
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('📘')

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    await onCreate({ name: name.trim(), icon })
    setName('')
    setIcon('📘')
    setCreating(false)
  }

  return (
    <div className="notebook-list">
      <div className="notebook-list-header">
        <span className="notebook-list-title">Notebooks</span>
        <button
          className="notebook-new-btn"
          onClick={() => setCreating((v) => !v)}
          aria-label="New notebook"
        >
          {creating ? '×' : '+'}
        </button>
      </div>

      {creating && (
        <form className="notebook-create" onSubmit={submit}>
          <div className="notebook-create-row">
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value.slice(0, 2))}
              maxLength={2}
              style={{ width: 44, textAlign: 'center' }}
              placeholder="📘"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Class name"
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Create
          </button>
        </form>
      )}

      <div className="notebook-items">
        {notebooks.length === 0 && !creating && (
          <div className="empty" style={{ textAlign: 'left' }}>No notebooks yet.</div>
        )}
        {notebooks.map((nb) => (
          <div
            key={nb.id}
            className={`notebook-item ${activeId === nb.id ? 'active' : ''}`}
            onClick={() => onSelect(nb.id)}
          >
            <span className="notebook-item-icon">{nb.icon || '📘'}</span>
            <span className="notebook-item-name">{nb.name}</span>
            <span className="notebook-item-count">{nb.noteCount}</span>
            <button
              className="notebook-delete"
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm(`Delete "${nb.name}" and all its notes?`)) onDelete(nb.id)
              }}
              aria-label="Delete notebook"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
