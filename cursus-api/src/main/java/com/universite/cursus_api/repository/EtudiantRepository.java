package com.universite.cursus_api.repository;

import com.universite.cursus_api.models.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    
    Optional<Etudiant> findByMatriculeUnique(String matriculeUnique);

    // Nouvelle méthode de recherche insensible à la casse (LOWER)
    @Query("SELECT e FROM Etudiant e WHERE " +
           "LOWER(e.matriculeUnique) = LOWER(:keyword) OR " +
           "LOWER(e.nom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.prenom) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Etudiant> searchByMatriculeOrNom(@Param("keyword") String keyword);
}