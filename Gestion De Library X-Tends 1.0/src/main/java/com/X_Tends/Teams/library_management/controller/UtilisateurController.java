package com.X_Tends.Teams.library_management.controller;

import com.X_Tends.Teams.library_management.model.Emprunt;
import com.X_Tends.Teams.library_management.model.Utilisateur;
import com.X_Tends.Teams.library_management.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {
    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurService.getAllUtilisateurs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable("id") Long id) {
        return utilisateurService.getUtilisateurById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Utilisateur> createUtilisateur(@RequestBody @Validated Utilisateur utilisateur) {
        Utilisateur savedUtilisateur = utilisateurService.saveUtilisateur(utilisateur);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUtilisateur);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> updateUtilisateur(@PathVariable("id") Long id, @RequestBody @Validated Utilisateur utilisateurDetails) {
        Utilisateur updatedUtilisateur = utilisateurService.updateUtilisateur(id, utilisateurDetails);
        return ResponseEntity.ok(updatedUtilisateur);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable("id") Long id) {
        utilisateurService.deleteUtilisateur(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/{utilisateurId}/emprunts")
    public ResponseEntity<Utilisateur> addEmpruntToUtilisateur(@PathVariable("id") Long utilisateurId, @RequestBody Emprunt emprunt) {
        Utilisateur updatedUtilisateur = utilisateurService.addEmpruntToUtilisateur(utilisateurId, emprunt);
        return ResponseEntity.ok(updatedUtilisateur);
    }
}

