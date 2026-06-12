package com.universite.cursusapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration // Dit à Spring que c'est un fichier de configuration
@EnableWebSecurity // Active la configuration de sécurité personnalisée
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // On désactive la protection CSRF car on développe une API REST (les requêtes viendront de React/Postman)
            .csrf(csrf -> csrf.disable()) 
            
            // On autorise TOUTES les requêtes HTTP sans avoir besoin de se connecter
            // C'est temporaire pour pouvoir tester nos futurs endpoints tranquillement
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); 
        
        return http.build();
    }
}