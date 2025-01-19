package ch.bbw.hh.repository;

import ch.bbw.hh.model.PasswordEntry;
import ch.bbw.hh.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PasswordEntryRepository extends JpaRepository<PasswordEntry, Long> {
    List<PasswordEntry> findAllByUser(User user);
    Optional<PasswordEntry> findByIdAndUser(Long id, User user);
}
