package com.universite.cursus_api.repository;

import com.universite.cursus_api.models.Faculte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FaculteRepository extends JpaRepository<Faculte, Long> {
}