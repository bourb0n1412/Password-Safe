package ch.bbw.hh.controller;

import ch.bbw.hh.model.User;
import ch.bbw.hh.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            registeredUser.setPassword(null); // Passwort aus der Antwort entfernen
            return ResponseEntity.ok(registeredUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }


    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateUser(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(false);
        }

        boolean isValid = userService.validatePassword(username, password);
        return ResponseEntity.ok(isValid);
    }


}
