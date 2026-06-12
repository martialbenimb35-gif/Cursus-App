package com.universite.cursus_api.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "annee_academique")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AnneeAcademique {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String libelle; // Ex: "2025-2026"
}