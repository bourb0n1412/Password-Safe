package ch.bbw.hh.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256); // Sicherer Schlüssel

    // Token generieren
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Token für 10 Stunden gültig
                .signWith(secretKey) // Sichere Signatur mit dem generierten Schlüssel
                .compact();
    }

    // Benutzername aus Token extrahieren
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Überprüfen, ob Token abgelaufen ist
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Claims extrahieren
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
