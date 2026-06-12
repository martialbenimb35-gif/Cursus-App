package com.universite.cursus_api.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "semestre")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Semestre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom; // Ex: "Semestre 1"
}