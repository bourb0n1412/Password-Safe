package ch.bbw.hh.service;

import ch.bbw.hh.model.PasswordEntry;
import ch.bbw.hh.model.User;
import ch.bbw.hh.repository.PasswordEntryRepository;
import ch.bbw.hh.repository.UserRepository;
import ch.bbw.hh.util.EncryptionUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PasswordEntryService {
    private final PasswordEntryRepository repository;
    private final UserRepository userRepository;

    public PasswordEntryService(PasswordEntryRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public List<PasswordEntry> getEntriesForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden."));
        List<PasswordEntry> entries = repository.findAllByUser(user);

        // Entschlüsseln der Passwörter vor der Rückgabe
        entries.forEach(entry -> {
            try {
                String decryptedPassword = EncryptionUtil.decrypt(entry.getEncryptedPassword());
                entry.setEncryptedPassword(decryptedPassword);
            } catch (Exception e) {
                throw new RuntimeException("Fehler beim Entschlüsseln des Passworts für Eintrag ID: " + entry.getId(), e);
            }
        });

        return entries;
    }

    public Optional<PasswordEntry> getEntryByIdForUser(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden."));
        Optional<PasswordEntry> entry = repository.findByIdAndUser(id, user);

        entry.ifPresent(e -> {
            try {
                String decryptedPassword = EncryptionUtil.decrypt(e.getEncryptedPassword());
                e.setEncryptedPassword(decryptedPassword);
            } catch (Exception ex) {
                throw new RuntimeException("Fehler beim Entschlüsseln des Passworts für Eintrag ID: " + id, ex);
            }
        });

        return entry;
    }

    public PasswordEntry saveEntryForUser(PasswordEntry entry, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden."));
        entry.setUser(user);

        try {
            // Passwort verschlüsseln mit AES
            String encryptedPassword = EncryptionUtil.encrypt(entry.getEncryptedPassword());
            entry.setEncryptedPassword(encryptedPassword);
        } catch (Exception e) {
            throw new RuntimeException("Fehler beim Verschlüsseln des Passworts", e);
        }

        return repository.save(entry);
    }

    public void deleteEntry(Long id) {
        repository.deleteById(id);
    }
}
