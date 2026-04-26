import { useEffect, useMemo, useRef, useState } from 'react'
import api from '../api/client.js'
import NotebookList from '../components/NotebookList.jsx'
import NoteList from '../components/NoteList.jsx'
import NoteEditor from '../components/NoteEditor.jsx'
import { useToast } from '../components/ToastContext.jsx'
import { useDebouncedEffect } from '../hooks/useDebouncedEffect.js'

export default function Notes() {
  const [notebooks, setNotebooks] = useState([])
  const [activeNotebookId, setActiveNotebookId] = useState(null)
  const [notes, setNotes] = useState([])
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [draft, setDraft] = useState({ title: '', content: '' })
  const [status, setStatus] = useState('idle') // idle | saving | saved | error
  const toast = useToast()
  const lastSavedRef = useRef({ id: null, title: '', content: '' })

  // Load notebooks on mount
  useEffect(() => {
    api.get('/notebooks').then(({ data }) => {
      setNotebooks(data)
      if (data.length) setActiveNotebookId(data[0].id)
    })
  }, [])

  // Load notes whenever the active notebook changes
  useEffect(() => {
    if (activeNotebookId == null) {
      setNotes([])
      setActiveNoteId(null)
      return
    }
    api.get('/notes', { params: { notebookId: activeNotebookId } }).then(({ data }) => {
      setNotes(data)
      setActiveNoteId(data[0]?.id ?? null)
    })
  }, [activeNotebookId])

  // When the active note changes, seed the draft
  const activeNote = useMemo(
    () => notes.find((n) => n.id === activeNoteId) || null,
    [notes, activeNoteId]
  )
  // Re-seed only when the selected note ID actually changes, so auto-save round-trips
  // (which replace the note object in `notes`) don't clobber the draft or reset the
  // "Saved" indicator back to idle.
  useEffect(() => {
    if (activeNoteId == null) {
      setDraft({ title: '', content: '' })
      lastSavedRef.current = { id: null, title: '', content: '' }
      setStatus('idle')
      return
    }
    const note = notes.find((n) => n.id === activeNoteId)
    if (!note) return
    setDraft({ title: note.title || '', content: note.content || '' })
    lastSavedRef.current = { id: note.id, title: note.title || '', content: note.content || '' }
    setStatus('idle')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNoteId])

  // Mark dirty (so user sees "saving" quickly) when draft diverges
  const isDirty =
    activeNote &&
    (draft.title !== lastSavedRef.current.title || draft.content !== lastSavedRef.current.content)
  useEffect(() => {
    if (isDirty) setStatus((s) => (s === 'saving' ? s : 'saving'))
  }, [isDirty])

  // Auto-save debounced at 1.2s
  useDebouncedEffect(
    () => {
      if (!activeNote) return
      if (!isDirty) return
      const id = activeNote.id
      setStatus('saving')
      api
        .put(`/notes/${id}`, {
          notebookId: activeNote.notebookId,
          title: draft.title,
          content: draft.content,
        })
        .then(({ data }) => {
          setNotes((ns) => ns.map((n) => (n.id === id ? data : n)))
          lastSavedRef.current = { id, title: data.title, content: data.content || '' }
          setStatus('saved')
        })
        .catch(() => {
          setStatus('error')
          toast.error('Auto-save failed')
        })
    },
    [draft.title, draft.content, activeNote?.id],
    1200
  )

  // Warn before unload if there's an unsaved draft
  useEffect(() => {
    if (!isDirty) return
    const handler = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  const createNotebook = async (req) => {
    const { data } = await api.post('/notebooks', req)
    setNotebooks((nbs) => [...nbs, data])
    setActiveNotebookId(data.id)
    toast.success('Notebook added')
  }

  const deleteNotebook = async (id) => {
    await api.delete(`/notebooks/${id}`)
    setNotebooks((nbs) => nbs.filter((n) => n.id !== id))
    if (activeNotebookId === id) {
      const remaining = notebooks.filter((n) => n.id !== id)
      setActiveNotebookId(remaining[0]?.id ?? null)
    }
    toast.info('Notebook deleted')
  }

  const createNote = async () => {
    if (activeNotebookId == null) return
    const { data } = await api.post('/notes', {
      notebookId: activeNotebookId,
      title: 'Untitled',
      content: '',
    })
    setNotes((ns) => [data, ...ns])
    setActiveNoteId(data.id)
    setNotebooks((nbs) =>
      nbs.map((nb) => (nb.id === activeNotebookId ? { ...nb, noteCount: nb.noteCount + 1 } : nb))
    )
  }

  const deleteNote = async () => {
    if (!activeNote) return
    if (!window.confirm('Delete this note?')) return
    const id = activeNote.id
    await api.delete(`/notes/${id}`)
    setNotes((ns) => ns.filter((n) => n.id !== id))
    setActiveNoteId((curr) => (curr === id ? null : curr))
    setNotebooks((nbs) =>
      nbs.map((nb) => (nb.id === activeNotebookId ? { ...nb, noteCount: Math.max(0, nb.noteCount - 1) } : nb))
    )
    toast.info('Note deleted')
  }

  return (
    <div className="notes-shell">
      <div className="notes-col notes-col-narrow">
        <NotebookList
          notebooks={notebooks}
          activeId={activeNotebookId}
          onSelect={setActiveNotebookId}
          onCreate={createNotebook}
          onDelete={deleteNotebook}
        />
      </div>
      <div className="notes-col notes-col-narrow">
        <NoteList
          notes={notes}
          activeId={activeNoteId}
          onSelect={setActiveNoteId}
          onCreate={createNote}
          disabled={activeNotebookId == null}
        />
      </div>
      <div className="notes-col notes-col-wide">
        {activeNote ? (
          <NoteEditor
            title={draft.title}
            content={draft.content}
            status={status}
            onTitleChange={(v) => setDraft((d) => ({ ...d, title: v }))}
            onContentChange={(v) => setDraft((d) => ({ ...d, content: v }))}
            onDelete={deleteNote}
          />
        ) : (
          <div className="empty-hero" style={{ margin: 'auto' }}>
            <div className="empty-hero-icon">✎</div>
            <h3>Pick a note</h3>
            <p>
              {notebooks.length === 0
                ? 'Create a notebook on the left to get started.'
                : activeNotebookId == null
                ? 'Select a notebook, then add a note.'
                : 'Select a note or create a new one.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
