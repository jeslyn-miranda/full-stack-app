import { Draggable } from '@hello-pangea/dnd'
import { categoryColor } from '../utils/categoryColor.js'
import { dueState } from '../utils/dueDate.js'

export default function TaskCard({ task, index, onEdit }) {
  const due = dueState(task.dueDate)
  const isDone = task.status === 'COMPLETE'

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${snapshot.isDragging ? 'dragging' : ''} ${isDone ? 'is-done' : ''}`}
          onClick={() => onEdit(task)}
        >
          <div className="task-card-title">{task.title}</div>
          <div className="task-card-meta">
            {task.category && (
              <span className="tag">
                <span className="category-dot" style={{ background: categoryColor(task.category) }} />
                {task.category}
              </span>
            )}
            {due && (
              <span className={`tag-date tone-${due.tone}`}>
                {due.tone === 'overdue' ? '⚠' : '🕒'} {due.label}
              </span>
            )}
          </div>
          <div className="progress-row">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${task.progress}%`,
                background: isDone ? 'var(--success)' : 'var(--accent)',
              }}
            />
          </div>
        </div>
      )}
    </Draggable>
  )
}
