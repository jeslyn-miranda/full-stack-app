import { useEffect, useState } from 'react'

const STATUSES = [
  { value: 'TODO', label: 'To-do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'IN_REVIEW', label: 'In Review' },
  { value: 'COMPLETE', label: 'Complete' },
]

const EMPTY = {
  title: '',
  description: '',
  status: 'TODO',
  category: '',
  dueDate: '',
  progress: 0,
}

export default function TaskModal({ task, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(
      task
        ? {
            title: task.title ?? '',
            description: task.description ?? '',
            status: task.status ?? 'TODO',
            category: task.category ?? '',
            dueDate: task.dueDate ?? '',
            progress: task.progress ?? 0,
          }
        : EMPTY
    )
    setError(null)
  }, [task])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const change = (k) => (e) => {
    const v = k === 'progress' ? Number(e.target.value) : e.target.value
    setForm((f) => ({ ...f, [k]: v }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    setSaving(true)
    try {
      await onSave({
        ...form,
        dueDate: form.dueDate || null,
        description: form.description || null,
        category: form.category || null,
      })
      onClose()
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save task')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = () => {
    if (window.confirm('Delete this task?')) onDelete(task.id)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
        <h2>{task?.id ? 'Edit task' : 'New task'}</h2>
        {error && <div className="error">{error}</div>}

        <div className="field">
          <label>Title</label>
          <input value={form.title} onChange={change('title')} autoFocus />
        </div>

        <div className="field">
          <label>Description</label>
          <textarea rows={3} value={form.description} onChange={change('description')} />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={change('status')}>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Category</label>
            <input value={form.category} onChange={change('category')} placeholder="e.g. Reading" />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Due date</label>
            <input type="date" value={form.dueDate} onChange={change('dueDate')} />
          </div>
          <div className="field">
            <label>Progress: {form.progress}%</label>
            <input type="range" min={0} max={100} step={5} value={form.progress} onChange={change('progress')} />
          </div>
        </div>

        <div className="modal-actions">
          {task?.id && (
            <button
              type="button"
              className="btn btn-ghost btn-danger"
              onClick={confirmDelete}
              style={{ marginRight: 'auto' }}
            >
              Delete
            </button>
          )}
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
