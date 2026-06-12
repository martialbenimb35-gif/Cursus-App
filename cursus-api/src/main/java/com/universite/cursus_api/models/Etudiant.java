package com.universite.cursus_api.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference; // Importation essentielle pour couper la boucle infinie

@Entity
@Table(name = "etudiant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Etudiant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "matricule_unique", unique = true, nullable = false)
    private String matriculeUnique;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Temporal(TemporalType.DATE)
    @Column(name = "date_naissance")
    private Date dateNaissance;

    @Column(unique = true, nullable = false)
    private String email;

    // LA MISE À JOUR EST ICI : @JsonManagedReference permet d'autoriser la sérialisation 
    // des résultats depuis l'étudiant sans causer de boucle infinie.
    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Resultat> resultats;
}