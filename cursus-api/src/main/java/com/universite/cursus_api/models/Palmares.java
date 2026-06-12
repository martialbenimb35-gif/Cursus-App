package com.universite.cursus_api.models;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Palmares {
    private Etudiant etudiant;
    private Universite universite;
    private Promotion promotion;
    private AnneeAcademique anneeAcademique;
    private List<Resultat> detailsResultats;
    private Double moyenneGenerale;
    private String mention; 
}