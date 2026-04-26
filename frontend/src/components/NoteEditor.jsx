import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

function ToolbarButton({ onClick, active, disabled, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`tt-btn ${active ? 'active' : ''}`}
    >
      {children}
    </button>
  )
}

export default function NoteEditor({ title, content, onTitleChange, onContentChange, onDelete, status }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: 'Start writing your notes…' }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => onContentChange(editor.getHTML()),
  })

  // Sync when switching notes (content prop changes for an already-mounted editor)
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if ((content || '') !== current) {
      editor.commands.setContent(content || '', false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, content])

  useEffect(() => () => editor?.destroy(), [editor])

  const addLink = () => {
    const url = window.prompt('Link URL')
    if (!url) return
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="note-editor">
      <div className="note-editor-header">
        <input
          className="note-title-input"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled"
        />
        <div className="note-editor-status">
          <span className={`save-indicator ${status}`}>
            {status === 'saving' && '● Saving…'}
            {status === 'saved' && '✓ Saved'}
            {status === 'error' && '⚠ Not saved'}
            {status === 'idle' && ' '}
          </span>
          {onDelete && (
            <button className="btn btn-ghost btn-danger" onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      </div>

      {editor && (
        <div className="tt-toolbar">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold"
          ><b>B</b></ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic"
          ><i>I</i></ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            title="Strikethrough"
          ><s>S</s></ToolbarButton>
          <span className="tt-sep" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >H1</ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >H2</ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >H3</ToolbarButton>
          <span className="tt-sep" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet list"
          >• List</ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Numbered list"
          >1. List</ToolbarButton>
          <span className="tt-sep" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="Quote"
          >❝</ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            title="Inline code"
          >&lt;/&gt;</ToolbarButton>
          <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="Link">🔗</ToolbarButton>
        </div>
      )}

      <EditorContent editor={editor} className="tt-content" />
    </div>
  )
}
