package com.studyplanner.service;

import com.studyplanner.dto.TaskRequest;
import com.studyplanner.model.Task;
import com.studyplanner.model.TaskStatus;
import com.studyplanner.model.User;
import com.studyplanner.repository.TaskRepository;
import com.studyplanner.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<Task> listForUser(String email) {
        User user = requireUser(email);
        return taskRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional
    public Task create(String email, TaskRequest req) {
        User user = requireUser(email);
        Task task = Task.builder()
                .title(req.title())
                .description(req.description())
                .status(req.status() != null ? req.status() : TaskStatus.TODO)
                .category(req.category())
                .dueDate(req.dueDate())
                .progress(req.progress() != null ? req.progress() : 0)
                .user(user)
                .build();
        return taskRepository.save(task);
    }

    @Transactional
    public Task update(String email, Long id, TaskRequest req) {
        User user = requireUser(email);
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
        task.setTitle(req.title());
        task.setDescription(req.description());
        if (req.status() != null) task.setStatus(req.status());
        task.setCategory(req.category());
        task.setDueDate(req.dueDate());
        if (req.progress() != null) task.setProgress(req.progress());
        return task;
    }

    @Transactional
    public Task updateStatus(String email, Long id, TaskStatus status) {
        User user = requireUser(email);
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
        task.setStatus(status);
        if (status == TaskStatus.COMPLETE) task.setProgress(100);
        return task;
    }

    @Transactional
    public void delete(String email, Long id) {
        User user = requireUser(email);
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
        taskRepository.delete(task);
    }

    private User requireUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }
}
