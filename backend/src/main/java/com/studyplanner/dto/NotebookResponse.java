package com.studyplanner.dto;

import com.studyplanner.model.Notebook;

import java.time.Instant;

public record NotebookResponse(
        Long id,
        String name,
        String icon,
        Instant createdAt,
        long noteCount
) {
    public static NotebookResponse from(Notebook n, long noteCount) {
        return new NotebookResponse(n.getId(), n.getName(), n.getIcon(), n.getCreatedAt(), noteCount);
    }
}
