package com.universite.cursus_api.controller;

import com.universite.cursus_api.models.AnneeAcademique;
import com.universite.cursus_api.models.Etudiant;
import com.universite.cursus_api.models.Palmares;
import com.universite.cursus_api.repository.AnneeAcademiqueRepository;
import com.universite.cursus_api.repository.EtudiantRepository;
import com.universite.cursus_api.service.EtudiantService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/etudiants")
@CrossOrigin(origins = "*") 
public class EtudiantController {

    private final EtudiantRepository etudiantRepository;
    private final AnneeAcademiqueRepository anneeAcademiqueRepository;
    private final EtudiantService etudiantService;

    public EtudiantController(EtudiantService etudiantService, AnneeAcademiqueRepository anneeAcademiqueRepository, EtudiantRepository etudiantRepository) {
        this.etudiantService = etudiantService;
        this.anneeAcademiqueRepository = anneeAcademiqueRepository;
        this.etudiantRepository = etudiantRepository;
    }

    @GetMapping
   public List<Etudiant> obtenirTousLesEtudiants() {
    // Si ton repository s'appelle autrement, adapte "etudiantRepository"
    return etudiantRepository.findAll(); 
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
        return anneeAcademiqueRepository.findAll(); 
    }
}