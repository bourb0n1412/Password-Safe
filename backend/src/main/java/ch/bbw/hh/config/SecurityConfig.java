package ch.bbw.hh.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF-Schutz vollständig deaktivieren (nur für Entwicklung!)
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin())) // Frames von derselben Domain erlauben
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // Alle Anfragen ohne Authentifizierung erlauben

        return http.build();
    }
}
