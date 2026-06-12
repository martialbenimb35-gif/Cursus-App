package com.universite.cursus_api.controller;

import com.universite.cursus_api.models.AnneeAcademique;
import com.universite.cursus_api.models.Etudiant;
import com.universite.cursus_api.models.Palmares;
import com.universite.cursus_api.repository.AnneeAcademiqueRepository;
import com.universite.cursus_api.service.EtudiantService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/etudiants")
@CrossOrigin(origins = "http://localhost:5173") 
public class EtudiantController {

    private final AnneeAcademiqueRepository anneeAcademiqueRepository;
    private final EtudiantService etudiantService;

    public EtudiantController(EtudiantService etudiantService, AnneeAcademiqueRepository anneeAcademiqueRepository) {
        this.etudiantService = etudiantService;
        this.anneeAcademiqueRepository = anneeAcademiqueRepository;
    }

    
    @GetMapping("/recherche")
    public ResponseEntity<List<Etudiant>> rechercher(@RequestParam String query) {
        List<Etudiant> etudiants = etudiantService.rechercherEtudiants(query);
        return ResponseEntity.ok(etudiants);
    }

    
    @GetMapping("/{matriculeUnique}")
    public ResponseEntity<Etudiant> getEtudiantParMatricule(@PathVariable String matriculeUnique) {
        Optional<Etudiant> etudiantOpt = etudiantService.chercherParMatricule(matriculeUnique);
        return etudiantOpt.map(ResponseEntity::ok)
                          .orElseGet(() -> ResponseEntity.notFound().build());
    }

    
    @GetMapping("/{matriculeUnique}/palmares/{anneeAcademiqueId}")
    public ResponseEntity<Palmares> getPalmaresEtudiant(
            @PathVariable String matriculeUnique,
            @PathVariable Long anneeAcademiqueId) {
        
        Optional<Palmares> palmaresOpt = etudiantService.genererPalmares(matriculeUnique, anneeAcademiqueId);
        return palmaresOpt.map(ResponseEntity::ok)
                          .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/annees")
public List<AnneeAcademique> getAnnees() {
    return anneeAcademiqueRepository.findAll(); }
}