package ch.bbw.hh.service;

import ch.bbw.hh.model.User;
import ch.bbw.hh.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@PropertySource("classpath:pepper.properties")
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${pepper.secret}")
    private String pepper;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean validatePassword(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            // Passwort mit Pepper kombinieren, bevor es validiert wird
            String passwordWithPepper = password + pepper;
            return passwordEncoder.matches(passwordWithPepper, user.get().getPassword());
        }
        return false;
    }

    public User registerUser(User user) {
        // Überprüfen, ob der Benutzername bereits existiert
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Benutzername ist bereits vergeben.");
        }

        // Passwort mit Pepper kombinieren, bevor es gehasht wird
        String passwordWithPepper = user.getPassword() + pepper;
        String hashedPassword = passwordEncoder.encode(passwordWithPepper);
        user.setPassword(hashedPassword);

        // Benutzer speichern
        return userRepository.save(user);
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden."));
    }
}
