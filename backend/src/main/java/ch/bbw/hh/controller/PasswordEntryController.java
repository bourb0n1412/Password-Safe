package ch.bbw.hh.controller;

import ch.bbw.hh.model.PasswordEntry;
import ch.bbw.hh.service.PasswordEntryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entries")
public class PasswordEntryController {
    private final PasswordEntryService service;

    public PasswordEntryController(PasswordEntryService service) {
        this.service = service;
    }

    @GetMapping
    public List<PasswordEntry> getAllEntries() {
        return service.getAllEntries();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PasswordEntry> getEntryById(@PathVariable Long id) {
        return service.getEntryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PasswordEntry createEntry(@RequestBody PasswordEntry entry) {
        return service.saveEntry(entry);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PasswordEntry> updateEntry(@PathVariable Long id, @RequestBody PasswordEntry entry) {
        return service.getEntryById(id)
                .map(existingEntry -> {
                    entry.setId(existingEntry.getId());
                    return ResponseEntity.ok(service.saveEntry(entry));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        if (service.getEntryById(id).isPresent()) {
            service.deleteEntry(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
