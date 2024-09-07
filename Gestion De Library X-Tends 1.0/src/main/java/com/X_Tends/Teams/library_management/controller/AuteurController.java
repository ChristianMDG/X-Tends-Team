package com.X_Tends.Teams.library_management.controller;

import com.X_Tends.Teams.library_management.model.Auteur;
import com.X_Tends.Teams.library_management.service.AuteurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/auteurs")

public class AuteurController {
    @Autowired
    private AuteurService auteurService;
    @GetMapping("/{livreId}/auteurs")

    public Set<Auteur> getAuteursByLivreId(@PathVariable Long livreId) {
        return auteurService.findAuteursByLivreId(livreId);
    }

    @GetMapping
    public List<Auteur> getAllAuteurs() {
        return auteurService.getAllAuteurs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Auteur> getAuteurById(@PathVariable("id") Long id) {
        return auteurService.getAuteurById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Auteur> createAuteur(@RequestBody @Validated Auteur auteur) {
        Auteur savedAuteur = auteurService.saveAuteur(auteur);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAuteur);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Auteur> updateAuteur(@PathVariable("id") Long id, @RequestBody @Validated Auteur auteurDetails) {
        return auteurService.updateAuteur(id, auteurDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuteur(@PathVariable("id") Long id) {
        if (auteurService.deleteAuteur(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

