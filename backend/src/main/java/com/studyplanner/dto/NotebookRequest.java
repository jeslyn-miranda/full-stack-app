package com.studyplanner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NotebookRequest(
        @NotBlank @Size(max = 80) String name,
        @Size(max = 8) String icon
) {}
