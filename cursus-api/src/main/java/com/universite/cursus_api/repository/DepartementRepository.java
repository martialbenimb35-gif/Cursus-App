package com.universite.cursus_api.repository;

import com.universite.cursus_api.models.Departement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartementRepository extends JpaRepository<Departement, Long> {
}