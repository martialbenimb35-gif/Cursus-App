package com.universite.cursus_api.repository;

import com.universite.cursus_api.models.Universite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UniversiteRepository extends JpaRepository<Universite, Long> {
    
    // Une méthode personnalisée : Permet de retrouver une université grâce à son code unique (ex: UNIKIN)
    Optional<Universite> findByCodeUnique(String codeUnique);
}