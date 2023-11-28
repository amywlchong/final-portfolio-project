package com.amychong.tourmanagementapp.config;

import com.amychong.tourmanagementapp.security.CustomAuthenticationEntryPoint;
import com.amychong.tourmanagementapp.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthFilter;
  private final AuthenticationProvider authenticationProvider;
  private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
  private final List<String> allowedOrigins;
  private final List<String> allowedMethods;

  @Autowired
  public SecurityConfig(
      JwtAuthenticationFilter jwtAuthFilter,
      AuthenticationProvider authenticationProvider,
      CustomAuthenticationEntryPoint customAuthenticationEntryPoint,
      @Value("#{'${web.cors.allowed-origins}'.split(',')}") List<String> allowedOrigins,
      @Value("#{'${web.cors.allowed-methods}'.split(',')}") List<String> allowedMethods) {
    this.jwtAuthFilter = jwtAuthFilter;
    this.authenticationProvider = authenticationProvider;
    this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
    this.allowedOrigins = allowedOrigins;
    this.allowedMethods = allowedMethods;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    List<RequestMatcher> publicRequestMatchers =
        Arrays.asList(
            new AntPathRequestMatcher("/api/auth/register"),
            new AntPathRequestMatcher("/api/auth/authenticate"),
            new AntPathRequestMatcher("/api/tours/*/reviews", "GET"),
            new AntPathRequestMatcher("/api/tours/*", "GET"),
            new AntPathRequestMatcher("/api/tours", "GET"),
            new AntPathRequestMatcher("/api/tours/*/images/*", "GET"),
            new AntPathRequestMatcher("/api/users/*/reviews", "GET"),
            new AntPathRequestMatcher("/api/reviews/*", "GET"),
            new AntPathRequestMatcher("/api/reviews", "GET"));

    OrRequestMatcher orPublicRequestMatcher = new OrRequestMatcher(publicRequestMatchers);

    http.cors(Customizer.withDefaults())
        .csrf((csrf) -> csrf.disable())
        .exceptionHandling(
            (exception) -> exception.authenticationEntryPoint(customAuthenticationEntryPoint))
        .authorizeHttpRequests(
            requests ->
                requests
                    .requestMatchers(orPublicRequestMatcher)
                    .permitAll()
                    .anyRequest()
                    .authenticated())
        .sessionManagement(
            (sessionManagement) ->
                sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        .authenticationProvider(authenticationProvider);

    return http.build();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(allowedOrigins);
    configuration.setAllowedMethods(allowedMethods);
    configuration.setAllowedHeaders(List.of("*"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
