package com.universite.cursus_api.service;

import com.universite.cursus_api.models.Etudiant;
import com.universite.cursus_api.models.Palmares;
import com.universite.cursus_api.models.Resultat;
import com.universite.cursus_api.repository.EtudiantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EtudiantService {

    private final EtudiantRepository etudiantRepository;

    public EtudiantService(EtudiantRepository etudiantRepository) {
        this.etudiantRepository = etudiantRepository;
    }

    public Optional<Etudiant> chercherParMatricule(String matricule) {
        return etudiantRepository.findByMatriculeUnique(matricule);
    }

    // Nouvelle méthode pour le moteur de recherche
    public List<Etudiant> rechercherEtudiants(String keyword) {
        return etudiantRepository.searchByMatriculeOrNom(keyword);
    }

    public Optional<Palmares> genererPalmares(String matricule, Long anneeId) {
        Optional<Etudiant> etudiantOpt = etudiantRepository.findByMatriculeUnique(matricule);
        if (etudiantOpt.isEmpty()) return Optional.empty();

        Etudiant etudiant = etudiantOpt.get();
        List<Resultat> resultats = etudiant.getResultats();

        if (resultats.isEmpty()) {
            return Optional.of(new Palmares(
                etudiant, null, 
                null, 
                null, 
                resultats, 
                0.0, 
                "Pas de notes"));
        }

        double totalNotesPonderees = 0.0;
        int totalCredits = 0;
        for (Resultat res : resultats) {
            totalNotesPonderees += res.getNote() * res.getCredit();
            totalCredits += res.getCredit();
        }

        double moyenne = totalNotesPonderees / totalCredits;
        String mention;
        if (moyenne >= 17) mention = "Excellent (Plus Grande Distinction)";
        else if (moyenne >= 15) mention = "Très Bien (Grande Distinction)";
        else if (moyenne >= 13) mention = "Bien (Distinction)";
        else if (moyenne >= 10) mention = "Satisfaisant (Satisfaction)";
        else mention = "Ajourné";

        return Optional.of(new Palmares(etudiant,
            null, 
            null, 
            null, 
            resultats, moyenne, mention
        ));
    }
}