package com.studyplanner.service;

import com.studyplanner.dto.NotebookRequest;
import com.studyplanner.dto.NotebookResponse;
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
public class NotebookService {

    private final NotebookRepository notebookRepository;
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public NotebookService(NotebookRepository notebookRepository, NoteRepository noteRepository, UserRepository userRepository) {
        this.notebookRepository = notebookRepository;
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    public List<NotebookResponse> list(String email) {
        User user = requireUser(email);
        return notebookRepository.findByUserOrderByCreatedAtAsc(user).stream()
                .map(nb -> NotebookResponse.from(nb, noteRepository.countByUserAndNotebook(user, nb)))
                .toList();
    }

    @Transactional
    public NotebookResponse create(String email, NotebookRequest req) {
        User user = requireUser(email);
        Notebook nb = Notebook.builder()
                .name(req.name())
                .icon(req.icon())
                .user(user)
                .build();
        nb = notebookRepository.save(nb);
        return NotebookResponse.from(nb, 0);
    }

    @Transactional
    public void delete(String email, Long id) {
        User user = requireUser(email);
        Notebook nb = notebookRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Notebook not found"));
        noteRepository.deleteByNotebook(nb);
        notebookRepository.delete(nb);
    }

    private User requireUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }
}
