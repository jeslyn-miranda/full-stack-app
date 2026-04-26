package com.studyplanner.dto;

import com.studyplanner.model.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(
        @NotNull Long id,
        @NotNull TaskStatus status
) {}
