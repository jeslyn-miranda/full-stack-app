function preview(html) {
  if (!html) return ''
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.slice(0, 80)
}

function formatDate(iso) {
  const d = new Date(iso)
  const today = new Date()
  const same = d.toDateString() === today.toDateString()
  return same
    ? d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function NoteList({ notes, activeId, onSelect, onCreate, disabled }) {
  return (
    <div className="note-list">
      <div className="note-list-header">
        <span className="notebook-list-title">Notes</span>
        <button
          className="notebook-new-btn"
          onClick={onCreate}
          disabled={disabled}
          aria-label="New note"
          title={disabled ? 'Select a notebook first' : 'New note'}
        >
          +
        </button>
      </div>
      <div className="note-items">
        {notes.length === 0 && (
          <div className="empty" style={{ textAlign: 'left' }}>
            {disabled ? 'Pick a notebook to see its notes.' : 'No notes here yet.'}
          </div>
        )}
        {notes.map((n) => (
          <div
            key={n.id}
            className={`note-item ${activeId === n.id ? 'active' : ''}`}
            onClick={() => onSelect(n.id)}
          >
            <div className="note-item-title">{n.title || 'Untitled'}</div>
            <div className="note-item-preview">{preview(n.content) || 'No content yet'}</div>
            <div className="note-item-date">{formatDate(n.updatedAt)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
