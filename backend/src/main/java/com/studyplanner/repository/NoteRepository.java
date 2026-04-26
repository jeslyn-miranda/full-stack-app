package com.studyplanner.repository;

import com.studyplanner.model.Note;
import com.studyplanner.model.Notebook;
import com.studyplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserAndNotebookOrderByUpdatedAtDesc(User user, Notebook notebook);
    List<Note> findByUserOrderByUpdatedAtDesc(User user);
    Optional<Note> findByIdAndUser(Long id, User user);
    long countByUserAndNotebook(User user, Notebook notebook);
    void deleteByNotebook(Notebook notebook);
}
