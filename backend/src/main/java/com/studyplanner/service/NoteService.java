package com.studyplanner.service;

import com.studyplanner.dto.NoteRequest;
import com.studyplanner.model.Note;
import com.studyplanner.model.Notebook;
import com.studyplanner.model.User;
import com.studyplanner.repository.NoteRepository;
import com.studyplanner.repository.NotebookRepository;
import com.studyplanner.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final NotebookRepository notebookRepository;
    private final UserRepository userRepository;

    public NoteService(NoteRepository noteRepository, NotebookRepository notebookRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.notebookRepository = notebookRepository;
        this.userRepository = userRepository;
    }

    public List<Note> list(String email, Long notebookId) {
        User user = requireUser(email);
        if (notebookId != null) {
            Notebook nb = notebookRepository.findByIdAndUser(notebookId, user)
                    .orElseThrow(() -> new EntityNotFoundException("Notebook not found"));
            return noteRepository.findByUserAndNotebookOrderByUpdatedAtDesc(user, nb);
        }
        return noteRepository.findByUserOrderByUpdatedAtDesc(user);
    }

    @Transactional
    public Note create(String email, NoteRequest req) {
        User user = requireUser(email);
        Notebook nb = notebookRepository.findByIdAndUser(req.notebookId(), user)
                .orElseThrow(() -> new EntityNotFoundException("Notebook not found"));
        Note note = Note.builder()
                .title(req.title() == null || req.title().isBlank() ? "Untitled" : req.title())
                .content(req.content())
                .notebook(nb)
                .user(user)
                .build();
        return noteRepository.save(note);
    }

    @Transactional
    public Note update(String email, Long id, NoteRequest req) {
        User user = requireUser(email);
        Note note = noteRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Note not found"));

        if (req.notebookId() != null && !req.notebookId().equals(note.getNotebook().getId())) {
            Notebook nb = notebookRepository.findByIdAndUser(req.notebookId(), user)
                    .orElseThrow(() -> new EntityNotFoundException("Notebook not found"));
            note.setNotebook(nb);
        }
        if (req.title() != null) note.setTitle(req.title().isBlank() ? "Untitled" : req.title());
        if (req.content() != null) note.setContent(req.content());
        return note;
    }

    @Transactional
    public void delete(String email, Long id) {
        User user = requireUser(email);
        Note note = noteRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Note not found"));
        noteRepository.delete(note);
    }

    private User requireUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }
}
