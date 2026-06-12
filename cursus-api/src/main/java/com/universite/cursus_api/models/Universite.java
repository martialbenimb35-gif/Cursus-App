package com.universite.cursus_api.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "universite")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Universite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(name = "code_unique", unique = true, nullable = false)
    private String codeUnique;

    private String adresse;

    @ManyToOne
    @JoinColumn(name = "ville_id")
    @JsonBackReference // Enfant de Ville
    private Ville ville;

    @OneToMany(mappedBy = "universite", cascade = CascadeType.ALL)
    @JsonManagedReference // Parent de Faculte
    private List<Faculte> facultes;
}