package com.X_Tends.Teams.library_management.repository;

import com.X_Tends.Teams.library_management.model.Emprunt;
import com.X_Tends.Teams.library_management.model.Livre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


public interface EmpruntRepository extends JpaRepository<Emprunt, Long> {
    // Query to find all borrowed books by a specific user ID
    @Query("SELECT e.livre FROM Emprunt e WHERE e.utilisateur.id = :utilisateurId")
    List<Livre> findLivresByUtilisateurId(@Param("utilisateurId") Long utilisateurId);
    Optional<Emprunt> findByUtilisateurIdAndLivreId(Long utilisateurId, Long livreId);



}
