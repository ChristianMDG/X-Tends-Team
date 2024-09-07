package com.X_Tends.Teams.library_management.repository;

import com.X_Tends.Teams.library_management.model.Livre;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LivreRepository extends JpaRepository<Livre, Long> {
    List<Livre> findByDisponible(boolean b);
    // Utilisation d'un EntityGraph pour charger les auteurs de manière Eager
    @EntityGraph(attributePaths = {"auteurs"})
    Livre findWithAuteursById(Long id);

}
