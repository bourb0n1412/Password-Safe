package ch.bbw.hh.repository;

import ch.bbw.hh.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username); // Methode, um Benutzer per Username zu finden
}
