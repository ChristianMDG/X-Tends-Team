package com.X_Tends.Teams.library_management.service;

import com.X_Tends.Teams.library_management.ResourceNotFoundException;
import com.X_Tends.Teams.library_management.model.Emprunt;
import com.X_Tends.Teams.library_management.model.Utilisateur;
import com.X_Tends.Teams.library_management.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UtilisateurService {
    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    public Optional<Utilisateur> getUtilisateurById(Long id) {
        return utilisateurRepository.findById(id);
    }

    public Utilisateur saveUtilisateur(Utilisateur utilisateur) {
        // Ajoutez ici une validation des données si nécessaire
        return utilisateurRepository.save(utilisateur);
    }

    public Utilisateur updateUtilisateur(Long id, Utilisateur utilisateurDetails) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé pour cet ID :: " + id));

        utilisateur.setNom(utilisateurDetails.getNom());
        utilisateur.setEmail(utilisateurDetails.getEmail());
        // Mettez à jour d'autres champs si nécessaire

        return utilisateurRepository.save(utilisateur);
    }

    public void deleteUtilisateur(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé pour cet ID :: " + id));

        utilisateurRepository.delete(utilisateur);
    }

    public Optional<Utilisateur> findById(Long id) {
        return utilisateurRepository.findById(id);
    }

    public Utilisateur save(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    public void deleteById(Long id) {
        utilisateurRepository.deleteById(id);
    }

    public Utilisateur addEmpruntToUtilisateur(Long utilisateurId, Emprunt emprunt) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur not found"));
        Set<Emprunt> emprunts = utilisateur.getEmprunts();
        emprunts.add(emprunt);
        utilisateur.setEmprunts(emprunts); // Usage of setter
        return utilisateurRepository.save(utilisateur);
    }

}