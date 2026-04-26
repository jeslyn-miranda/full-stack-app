package com.studyplanner.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record NoteRequest(
        @NotNull Long notebookId,
        @Size(max = 200) String title,
        String content
) {}
