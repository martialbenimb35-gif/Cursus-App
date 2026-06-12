package com.universite.cursus_api.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "faculte")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Faculte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @ManyToOne
    @JoinColumn(name = "universite_id")
    @JsonBackReference // Enfant de Universite
    private Universite universite;

    @OneToMany(mappedBy = "faculte", cascade = CascadeType.ALL)
    @JsonManagedReference // Parent de Departement
    private List<Departement> departements;
}