package com.amychong.tourmanagementapp.security;

import com.amychong.tourmanagementapp.entity.user.UserDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final String SECRET_KEY;

    @Autowired
    public JwtService(@Value("${jwt.secret}") String secretKey) {
        this.SECRET_KEY = secretKey;
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userDetails.getId());
        claims.put("userName", userDetails.getName());
        claims.put("userActive", userDetails.isEnabled());
        claims.put("userRole", userDetails.getRole());
        claims.put("passwordChangedDate", userDetails.getPasswordChangedDate());
        return generateToken(claims, userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String usernameFromToken = extractUsername(token);
        final Long passwordChangedDateFromToken = extractPasswordChangedDate(token);
        final Long passwordChangedDateFromUser = userDetails.getPasswordChangedDate();

        if (usernameFromToken == null || passwordChangedDateFromToken == null) {
            return false;
        }

        return usernameFromToken.equals(userDetails.getUsername())
                && !isTokenExpired(token)
                && isPasswordChangedDateValid(passwordChangedDateFromToken, passwordChangedDateFromUser);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private boolean isPasswordChangedDateValid(Long passwordChangedDateFromToken, Long passwordChangedDateFromUser) {
        return passwordChangedDateFromToken.equals(passwordChangedDateFromUser);
    }

    private Long extractPasswordChangedDate(String token) {
        return extractClaim(token, claims -> claims.get("passwordChangedDate", Long.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
