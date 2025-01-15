package ch.bbw.hh.repository;

import ch.bbw.hh.model.PasswordEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordEntryRepository extends JpaRepository<PasswordEntry, Long> {
}
