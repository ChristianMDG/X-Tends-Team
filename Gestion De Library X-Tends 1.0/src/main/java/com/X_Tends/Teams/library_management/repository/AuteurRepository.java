package com.X_Tends.Teams.library_management.repository;

import com.X_Tends.Teams.library_management.model.Auteur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface AuteurRepository extends JpaRepository<Auteur, Long> {
    @Query("SELECT a FROM Auteur a JOIN a.livres l WHERE l.id = :livreId")
    Set<Auteur> findByLivreId(@Param("livreId") Long livreId);
}
