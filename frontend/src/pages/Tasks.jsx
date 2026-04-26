import { useEffect, useMemo, useState } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import api from '../api/client.js'
import TaskCard from '../components/TaskCard.jsx'
import TaskModal from '../components/TaskModal.jsx'
import { useToast } from '../components/ToastContext.jsx'

const COLUMNS = [
  { key: 'TODO', label: 'To-do', color: 'var(--todo)' },
  { key: 'IN_PROGRESS', label: 'In Progress', color: 'var(--progress)' },
  { key: 'IN_REVIEW', label: 'In Review', color: 'var(--review)' },
  { key: 'COMPLETE', label: 'Complete', color: 'var(--success)' },
]

function SkeletonCard() {
  return (
    <div className="task-card skeleton">
      <div className="skeleton-line w-70" />
      <div className="skeleton-line w-40" />
      <div className="skeleton-line w-100 tall" />
    </div>
  )
}

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [modal, setModal] = useState(null)
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/tasks')
      setTasks(data)
    } catch {
      toast.error('Could not load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tasks.filter((t) => {
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false
      if (!q) return true
      return (
        t.title.toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
      )
    })
  }, [tasks, query, statusFilter])

  const byColumn = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((c) => [c.key, []]))
    filtered.forEach((t) => map[t.status]?.push(t))
    return map
  }, [filtered])

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const id = Number(draggableId)
    const newStatus = destination.droppableId
    const prev = tasks
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status: newStatus } : t)))
    try {
      const { data } = await api.patch('/tasks/status', { id, status: newStatus })
      setTasks((ts) => ts.map((t) => (t.id === id ? data : t)))
      if (newStatus === 'COMPLETE') toast.success('Nice work! Task complete ✿')
    } catch {
      setTasks(prev)
      toast.error('Could not update status')
    }
  }

  const saveTask = async (form) => {
    if (modal?.id) {
      const { data } = await api.put(`/tasks/${modal.id}`, form)
      setTasks((ts) => ts.map((t) => (t.id === data.id ? data : t)))
      toast.success('Task updated')
    } else {
      const { data } = await api.post('/tasks', form)
      setTasks((ts) => [data, ...ts])
      toast.success('Task added')
    }
  }

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`)
    setTasks((ts) => ts.filter((t) => t.id !== id))
    setModal(null)
    toast.info('Task deleted')
  }

  const hasAny = tasks.length > 0

  return (
    <>
      <div className="main-header">
        <div>
          <h1>Tasks</h1>
          <div className="subtitle">Drag cards between columns to update progress.</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({})}>
          + New task
        </button>
      </div>

      <div className="toolbar">
        <input
          className="search"
          placeholder="Search by title, category…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="ALL">All statuses</option>
          {COLUMNS.map((c) => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </select>
      </div>

      {!loading && !hasAny && (
        <div className="empty-hero">
          <div className="empty-hero-icon">✿</div>
          <h3>Your planner is quiet</h3>
          <p>Create your first task to get moving.</p>
          <button className="btn btn-primary" onClick={() => setModal({})}>+ New task</button>
        </div>
      )}

      {(loading || hasAny) && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="board">
            {COLUMNS.map((col) => (
              <div key={col.key} className="column">
                <div className="column-header">
                  <span className="column-title">
                    <span className="column-dot" style={{ background: col.color }} />
                    {col.label}
                  </span>
                  <span className="column-count">{byColumn[col.key].length}</span>
                </div>
                <Droppable droppableId={col.key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`column-body ${snapshot.isDraggingOver ? 'is-over' : ''}`}
                    >
                      {loading && <><SkeletonCard /><SkeletonCard /></>}
                      {!loading && byColumn[col.key].map((t, i) => (
                        <TaskCard key={t.id} task={t} index={i} onEdit={(task) => setModal(task)} />
                      ))}
                      {provided.placeholder}
                      {!loading && byColumn[col.key].length === 0 && (
                        <div className="empty">No tasks here yet</div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {modal !== null && (
        <TaskModal
          task={modal}
          onClose={() => setModal(null)}
          onSave={saveTask}
          onDelete={deleteTask}
        />
      )}
    </>
  )
}
