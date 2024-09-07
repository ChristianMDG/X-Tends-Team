package com.X_Tends.Teams.library_management.controller;

import com.X_Tends.Teams.library_management.model.Emprunt;
import com.X_Tends.Teams.library_management.model.Livre;
import com.X_Tends.Teams.library_management.repository.EmpruntRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController

@RequestMapping("/api/emprunts")
public class EmpruntController {

    @Autowired
    private EmpruntRepository empruntRepository;

    @GetMapping
    public List<Emprunt> getAllEmprunts() {
        return empruntRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createEmprunt(@RequestBody Emprunt emprunt) {
        // Vérifier si le livre est déjà emprunté
        boolean isAlreadyBorrowed = empruntRepository.findAll().stream()
            .anyMatch(existingEmprunt -> existingEmprunt.getLivre().getId().equals(emprunt.getLivre().getId())
                                         && existingEmprunt.getDateRetour() == null);

        if (isAlreadyBorrowed) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Livre déjà emprunté");
        }

        try {
            emprunt.setDateEmprunt(LocalDate.now());
            Emprunt savedEmprunt = empruntRepository.save(emprunt);
            return ResponseEntity.ok(savedEmprunt);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Retourner un livre
    @PostMapping("/retourner")
    public ResponseEntity<?> retournerLivre(@RequestParam Long utilisateurId, @RequestParam Long livreId) {
        // Chercher l'emprunt correspondant
        Emprunt emprunt = empruntRepository.findByUtilisateurIdAndLivreId(utilisateurId, livreId)
                .orElse(null);

        if (emprunt == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Emprunt non trouvé");
        }

        // Vérifier si le livre est déjà retourné
        if (emprunt.getDateRetour() != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Le livre a déjà été retourné");
        }

        // Marquer le livre comme retourné en ajoutant la date de retour
        emprunt.setDateRetour(LocalDate.now());
        empruntRepository.save(emprunt);
        return ResponseEntity.ok("Livre retourné avec succès");
    }

    // Trouver les livres empruntés par un utilisateur
    public List<Livre> findLivresByUtilisateurId(Long utilisateurId) {
        return empruntRepository.findLivresByUtilisateurId(utilisateurId);
    }
    }
