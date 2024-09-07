package com.X_Tends.Teams.library_management.service;

import com.X_Tends.Teams.library_management.model.Auteur;
import com.X_Tends.Teams.library_management.model.Livre;
import com.X_Tends.Teams.library_management.repository.LivreRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class LivreService {

    @Autowired
    private LivreRepository livreRepository;
    private AuteurService auteurService;

    public Optional<Livre> getLivreWithAuteurs(Long id) {
        // Choisissez une des méthodes en fonction de votre besoin
        return Optional.ofNullable(livreRepository.findWithAuteursById(id));

    }
    // Add an Auteur to a Livre

    public List<Livre> getAllLivres() {
        return livreRepository.findAll();
    }

    public List<Livre> getAvailableLivres() {
        return livreRepository.findByDisponible(true);
    }

    public Livre getLivreById(Long id) {
        return livreRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livre non trouvé avec l'ID : " + id));
    }

    public Livre addLivre(Livre livre) {
        return livreRepository.save(livre);
    }

    public Livre updateLivre(Long id, Livre updatedLivre) {
        Livre livre = getLivreById(id);
        livre.setTitre(updatedLivre.getTitre());
        livre.setIsbn(updatedLivre.getIsbn());
        livre.setDatePublication(updatedLivre.getDatePublication());
        livre.setDisponible(updatedLivre.isDisponible());
        return livreRepository.save(livre);
    }

    public void deleteLivre(Long id) {
        livreRepository.deleteById(id);
    }

    public List<Livre> getBorrowedLivres() {
        return livreRepository.findByDisponible(false);
    }

    public Livre saveOrUpdateLivre(Livre livre) {
        return livreRepository.save(livre);
    }
    public Optional<Livre> findById(Long id) {
        return livreRepository.findById(id);
    }

    public Livre save(Livre livre) {
        return livreRepository.save(livre);
    }

    public void deleteById(Long id) {
        livreRepository.deleteById(id);
    }
    public Livre addAuteurToLivre(Long livreId, Auteur auteur) {
        Livre livre = livreRepository.findById(livreId).orElseThrow(() -> new RuntimeException("Livre not found"));
        Set<Auteur> auteurs = livre.getAuteurs();
        auteurs.add(auteur);
        livre.setAuteurs(auteurs); // Now this method is used
        return livreRepository.save(livre);
    }

}
