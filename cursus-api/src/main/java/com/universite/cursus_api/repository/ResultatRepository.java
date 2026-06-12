package com.universite.cursus_api.repository;

import com.universite.cursus_api.models.Resultat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResultatRepository extends JpaRepository<Resultat, Long> {
    
    // Permet de récupérer toutes les notes d'un étudiant spécifique grâce à son ID technique
    List<Resultat> findByEtudiantId(Long etudiantId);
    
    // Permet de récupérer les notes d'un étudiant pour une année académique précise
    List<Resultat> findByEtudiantIdAndAnneeAcademiqueId(Long etudiantId, Long anneeAcademiqueId);
}