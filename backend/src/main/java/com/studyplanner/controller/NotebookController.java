package com.studyplanner.controller;

import com.studyplanner.dto.NotebookRequest;
import com.studyplanner.dto.NotebookResponse;
import com.studyplanner.service.NotebookService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notebooks")
public class NotebookController {

    private final NotebookService notebookService;

    public NotebookController(NotebookService notebookService) {
        this.notebookService = notebookService;
    }

    @GetMapping
    public List<NotebookResponse> list(@AuthenticationPrincipal UserDetails principal) {
        return notebookService.list(principal.getUsername());
    }

    @PostMapping
    public ResponseEntity<NotebookResponse> create(@AuthenticationPrincipal UserDetails principal,
                                                   @Valid @RequestBody NotebookRequest req) {
        return ResponseEntity.ok(notebookService.create(principal.getUsername(), req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
        notebookService.delete(principal.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
