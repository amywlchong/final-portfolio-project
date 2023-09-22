package com.amychong.tourmanagementapp.config;

import com.amychong.tourmanagementapp.security.CustomAuthenticationEntryPoint;
import com.amychong.tourmanagementapp.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, AuthenticationProvider authenticationProvider, CustomAuthenticationEntryPoint customAuthenticationEntryPoint) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
        this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        List<RequestMatcher> publicRequestMatchers = Arrays.asList(
                new AntPathRequestMatcher("/api/auth/register"),
                new AntPathRequestMatcher("/api/auth/authenticate"),
                new AntPathRequestMatcher("/api/tours/*/reviews", "GET"),
                new AntPathRequestMatcher("/api/tours/*", "GET"),
                new AntPathRequestMatcher("/api/tours", "GET"),
                new AntPathRequestMatcher("/api/users/*/reviews", "GET"),
                new AntPathRequestMatcher("/api/reviews/*", "GET"),
                new AntPathRequestMatcher("/api/reviews", "GET")
        );

        OrRequestMatcher orPublicRequestMatcher = new OrRequestMatcher(publicRequestMatchers);

        http
                .csrf((csrf) -> csrf.disable())
                .exceptionHandling((exception) -> exception
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                )
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers(orPublicRequestMatcher).permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement((sessionManagement) ->
                        sessionManagement
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authenticationProvider(authenticationProvider);
                
        return http.build();
    }
}
