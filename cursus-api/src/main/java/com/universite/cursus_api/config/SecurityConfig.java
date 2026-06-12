package com.universite.cursus_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Désactiver le CSRF (nécessaire pour les API REST)
            .csrf(csrf -> csrf.disable())
            
            // 2. Autoriser tout le monde à accéder aux URLs commençant par /api/
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll() 
                .anyRequest().authenticated()
            )
            
            // 3. Désactiver le formulaire de connexion automatique (celui qui te bloque)
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}