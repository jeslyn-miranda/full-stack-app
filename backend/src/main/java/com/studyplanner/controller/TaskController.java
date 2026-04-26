package com.studyplanner.controller;

import com.studyplanner.dto.StatusUpdateRequest;
import com.studyplanner.dto.TaskRequest;
import com.studyplanner.dto.TaskResponse;
import com.studyplanner.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskResponse> list(@AuthenticationPrincipal UserDetails principal) {
        return taskService.listForUser(principal.getUsername()).stream()
                .map(TaskResponse::from)
                .toList();
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@AuthenticationPrincipal UserDetails principal,
                                               @Valid @RequestBody TaskRequest req) {
        return ResponseEntity.ok(TaskResponse.from(taskService.create(principal.getUsername(), req)));
    }

    @PutMapping("/{id}")
    public TaskResponse update(@AuthenticationPrincipal UserDetails principal,
                               @PathVariable Long id,
                               @Valid @RequestBody TaskRequest req) {
        return TaskResponse.from(taskService.update(principal.getUsername(), id, req));
    }

    @PatchMapping("/status")
    public TaskResponse updateStatus(@AuthenticationPrincipal UserDetails principal,
                                     @Valid @RequestBody StatusUpdateRequest req) {
        return TaskResponse.from(taskService.updateStatus(principal.getUsername(), req.id(), req.status()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
        taskService.delete(principal.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
