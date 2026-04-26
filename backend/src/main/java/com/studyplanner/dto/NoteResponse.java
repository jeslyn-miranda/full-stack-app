package com.studyplanner.dto;

import com.studyplanner.model.Note;

import java.time.Instant;

public record NoteResponse(
        Long id,
        Long notebookId,
        String title,
        String content,
        Instant createdAt,
        Instant updatedAt
) {
    public static NoteResponse from(Note n) {
        return new NoteResponse(
                n.getId(),
                n.getNotebook().getId(),
                n.getTitle(),
                n.getContent(),
                n.getCreatedAt(),
                n.getUpdatedAt()
        );
    }
}
