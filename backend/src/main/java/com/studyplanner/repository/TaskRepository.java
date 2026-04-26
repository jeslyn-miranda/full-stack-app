package com.studyplanner.repository;

import com.studyplanner.model.Task;
import com.studyplanner.model.TaskStatus;
import com.studyplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserOrderByCreatedAtDesc(User user);
    List<Task> findByUserAndStatus(User user, TaskStatus status);
    Optional<Task> findByIdAndUser(Long id, User user);
}
