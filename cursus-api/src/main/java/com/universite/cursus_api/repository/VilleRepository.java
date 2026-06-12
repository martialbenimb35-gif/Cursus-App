package com.universite.cursus_api.repository;

import com.universite.cursus_api.models.Ville; // Assure-toi que le chemin vers tes entités est le bon
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Indique à Spring que c'est un composant d'accès aux données
public interface VilleRepository extends JpaRepository<Ville, Long> {
    // JpaRepository<Ville, Long> signifie : On gère l'entité Ville, et sa clé primaire (@Id) est de type Long.
    // Grâce à ça, on a déjà accès à : save(), findAll(), findById(), deleteById()...
}