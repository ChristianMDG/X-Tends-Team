package com.X_Tends.Teams.library_management.service;

import com.X_Tends.Teams.library_management.model.Auteur;
import com.X_Tends.Teams.library_management.repository.AuteurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AuteurService {

    @Autowired
    private AuteurRepository auteurRepository;

    public Set<Auteur> findAuteursByLivreId(Long livreId) {
        return auteurRepository.findByLivreId(livreId);
    }

    public List<Auteur> getAllAuteurs() {
        return auteurRepository.findAll();
    }

    public Optional<Auteur> getAuteurById(Long id) {
        return auteurRepository.findById(id);
    }

    public Auteur saveAuteur(Auteur auteur) {
        return auteurRepository.save(auteur);
    }

    public Optional<Auteur> updateAuteur(Long id, Auteur auteurDetails) {
        return auteurRepository.findById(id).map(auteur -> {
            auteur.setNom(auteurDetails.getNom());
            auteur.setPrenom(auteurDetails.getPrenom());
            auteur.setLivres(auteurDetails.getLivres());
            return auteurRepository.save(auteur);
        });
    }

    public boolean deleteAuteur(Long id) {
        if (auteurRepository.existsById(id)) {
            auteurRepository.deleteById(id);
            return true;
        }

        return false;
    }
    public Optional<Auteur> findById(Long id) {
        return auteurRepository.findById(id);
    }

    public Auteur save(Auteur auteur) {
        return auteurRepository.save(auteur);
    }

    public void deleteById(Long id) {
        auteurRepository.deleteById(id);
    }
}
