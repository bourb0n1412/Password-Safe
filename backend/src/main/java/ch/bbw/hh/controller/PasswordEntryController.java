package ch.bbw.hh.controller;

import ch.bbw.hh.model.PasswordEntry;
import ch.bbw.hh.service.PasswordEntryService;
import ch.bbw.hh.service.JwtService;
import ch.bbw.hh.util.EncryptionUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entries")
public class PasswordEntryController {
    private final PasswordEntryService service;
    private final JwtService jwtService;

    public PasswordEntryController(PasswordEntryService service, JwtService jwtService) {
        this.service = service;
        this.jwtService = jwtService;
    }

    @GetMapping
    public List<PasswordEntry> getAllEntries(@RequestHeader("Authorization") String token) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        List<PasswordEntry> entries = service.getEntriesForUser(username);

        entries.forEach(entry -> {
            try {
                String decryptedPassword = EncryptionUtil.decrypt(entry.getEncryptedPassword());
                entry.setEncryptedPassword(decryptedPassword);
            } catch (Exception e) {
                // Loggen des Fehlers für Debugging
                System.err.println("Fehler beim Entschlüsseln des Passworts für Eintrag ID: " + entry.getId());
                e.printStackTrace();
                entry.setEncryptedPassword("Fehler beim Entschlüsseln");
            }
        });

        return entries;
    }


    @GetMapping("/{id}")
    public ResponseEntity<PasswordEntry> getEntryById(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        return service.getEntryByIdForUser(id, username)
                .map(entry -> {
                    try {
                        String decryptedPassword = EncryptionUtil.decrypt(entry.getEncryptedPassword());
                        entry.setEncryptedPassword(decryptedPassword);
                    } catch (Exception e) {
                        throw new RuntimeException("Fehler beim Entschlüsseln des Passworts", e);
                    }
                    return ResponseEntity.ok(entry);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PasswordEntry createEntry(@RequestHeader("Authorization") String token, @RequestBody PasswordEntry entry) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        return service.saveEntryForUser(entry, username);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PasswordEntry> updateEntry(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestBody PasswordEntry entry) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        return service.getEntryByIdForUser(id, username)
                .map(existingEntry -> {
                    entry.setId(existingEntry.getId());
                    return ResponseEntity.ok(service.saveEntryForUser(entry, username));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        if (service.getEntryByIdForUser(id, username).isPresent()) {
            service.deleteEntry(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
