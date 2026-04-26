package com.studyplanner.dto;

import com.studyplanner.model.Task;
import com.studyplanner.model.TaskStatus;

import java.time.Instant;
import java.time.LocalDate;

public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        String category,
        LocalDate dueDate,
        Integer progress,
        Instant createdAt,
        Instant updatedAt
) {
    public static TaskResponse from(Task t) {
        return new TaskResponse(
                t.getId(),
                t.getTitle(),
                t.getDescription(),
                t.getStatus(),
                t.getCategory(),
                t.getDueDate(),
                t.getProgress(),
                t.getCreatedAt(),
                t.getUpdatedAt()
        );
    }
}
