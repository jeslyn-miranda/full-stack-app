package com.studyplanner.dto;

import com.studyplanner.model.TaskStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TaskRequest(
        @NotBlank @Size(max = 200) String title,
        @Size(max = 2000) String description,
        TaskStatus status,
        @Size(max = 60) String category,
        LocalDate dueDate,
        @Min(0) @Max(100) Integer progress
) {}
