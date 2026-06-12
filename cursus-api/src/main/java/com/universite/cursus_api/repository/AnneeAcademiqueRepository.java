package com.universite.cursus_api.repository;

import com.universite.cursus_api.models.AnneeAcademique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AnneeAcademiqueRepository extends JpaRepository<AnneeAcademique, Long> {
    
    // Permet de chercher une année par son libellé (ex: "2025-2026")
    Optional<AnneeAcademique> findByLibelle(String libelle);
}