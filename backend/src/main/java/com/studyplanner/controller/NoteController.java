package com.studyplanner.controller;

import com.studyplanner.dto.NoteRequest;
import com.studyplanner.dto.NoteResponse;
import com.studyplanner.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public List<NoteResponse> list(@AuthenticationPrincipal UserDetails principal,
                                   @RequestParam(required = false) Long notebookId) {
        return noteService.list(principal.getUsername(), notebookId).stream()
                .map(NoteResponse::from)
                .toList();
    }

    @PostMapping
    public ResponseEntity<NoteResponse> create(@AuthenticationPrincipal UserDetails principal,
                                               @Valid @RequestBody NoteRequest req) {
        return ResponseEntity.ok(NoteResponse.from(noteService.create(principal.getUsername(), req)));
    }

    @PutMapping("/{id}")
    public NoteResponse update(@AuthenticationPrincipal UserDetails principal,
                               @PathVariable Long id,
                               @Valid @RequestBody NoteRequest req) {
        return NoteResponse.from(noteService.update(principal.getUsername(), id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
        noteService.delete(principal.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
