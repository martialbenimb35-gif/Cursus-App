package com.universite.cursus_api.repository;

import com.universite.cursus_api.models.Semestre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SemestreRepository extends JpaRepository<Semestre, Long> {
}