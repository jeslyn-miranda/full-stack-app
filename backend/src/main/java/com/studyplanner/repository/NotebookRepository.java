package com.studyplanner.repository;

import com.studyplanner.model.Notebook;
import com.studyplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotebookRepository extends JpaRepository<Notebook, Long> {
    List<Notebook> findByUserOrderByCreatedAtAsc(User user);
    Optional<Notebook> findByIdAndUser(Long id, User user);
}
