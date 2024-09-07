package com.X_Tends.Teams.library_management.controller;

import com.X_Tends.Teams.library_management.model.Livre;
import com.X_Tends.Teams.library_management.service.LivreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/livres")
public class LivreController {

    @Autowired
    private LivreService livreService;

    // Récupérer tous les livres
    @GetMapping
    public List<Livre> getAllLivres() {
        return livreService.getAllLivres();
    }

    // Récupérer les livres disponibles
    @GetMapping("/disponibles")
    public List<Livre> getAvailableLivres() {
        return livreService.getAvailableLivres();
    }

    // Récupérer un livre par son ID
    @GetMapping("/{id}")
    public ResponseEntity<Livre> getLivreById(@PathVariable("id") Long id) {
        try {
            Livre livre = livreService.getLivreById(id);
            return ResponseEntity.ok(livre);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Ajouter un nouveau livre
    @PostMapping
    public ResponseEntity<Livre> addLivre(@RequestBody Livre livre) {
        Livre nouveauLivre = livreService.addLivre(livre);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouveauLivre);
    }

    // Mettre à jour un livre par ID
    @PutMapping("/{id}")
    public ResponseEntity<Livre> updateLivre(@PathVariable("id") Long id, @RequestBody Livre updatedLivre) {
        try {
            Livre livre = livreService.updateLivre(id, updatedLivre);
            return ResponseEntity.ok(livre);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Supprimer un livre par ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLivre(@PathVariable("id") Long id) {
        try {
            livreService.deleteLivre(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Emprunter un livre
    @PostMapping("/emprunter/{id}")
    public ResponseEntity<String> emprunterLivre(@PathVariable Long id) {
        try {
            Livre livre = livreService.getLivreById(id);
            if (!livre.isDisponible()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Le livre n'est pas disponible.");
            }

            // Mettre à jour la disponibilité
            livre.setDisponible(false);
            livre.setBorrowDate(LocalDate.now());
            livre.setReturnDate(LocalDate.now().plusDays(14));

            livreService.updateLivre(id, livre);
            return ResponseEntity.ok("Livre emprunté avec succès.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Livre non trouvé.");
        }
    }

    // Afficher les livres empruntés
    @GetMapping("/emprunts")
    public List<Livre> getBorrowedLivres() {
        return livreService.getBorrowedLivres();
    }
    }



