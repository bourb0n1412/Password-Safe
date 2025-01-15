package ch.bbw.hh.service;

import ch.bbw.hh.model.PasswordEntry;
import ch.bbw.hh.repository.PasswordEntryRepository;
import ch.bbw.hh.util.EncryptionUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PasswordEntryService {
    private final PasswordEntryRepository repository;

    public PasswordEntryService(PasswordEntryRepository repository) {
        this.repository = repository;
    }

    public List<PasswordEntry> getAllEntries() {
        List<PasswordEntry> entries = repository.findAll();
        entries.forEach(entry -> {
            try {
                entry.setEncryptedPassword(EncryptionUtil.decrypt(entry.getEncryptedPassword()));
            } catch (Exception e) {
                throw new RuntimeException("Fehler beim Entschlüsseln des Passworts", e);
            }
        });
        return entries;
    }

    public Optional<PasswordEntry> getEntryById(Long id) {
        return repository.findById(id).map(entry -> {
            try {
                entry.setEncryptedPassword(EncryptionUtil.decrypt(entry.getEncryptedPassword()));
            } catch (Exception e) {
                throw new RuntimeException("Fehler beim Entschlüsseln des Passworts", e);
            }
            return entry;
        });
    }

    public PasswordEntry saveEntry(PasswordEntry entry) {
        try {
            entry.setEncryptedPassword(EncryptionUtil.encrypt(entry.getEncryptedPassword()));
        } catch (Exception e) {
            throw new RuntimeException("Fehler beim Verschlüsseln des Passworts", e);
        }
        return repository.save(entry);
    }

    public void deleteEntry(Long id) {
        repository.deleteById(id);
    }
}
