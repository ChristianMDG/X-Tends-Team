package com.X_Tends.Teams.library_management.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.Set;

@Entity
public class Livre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 1, max = 255)
    private String titre;

    private String isbn;
    private LocalDate datePublication;
    private boolean disponible;
    private LocalDate borrowDate;
    private LocalDate returnDate;

    // Relation Many-to-Many avec Auteur
    @ManyToMany
    @JoinTable(
            name = "livre_auteur",
            joinColumns = @JoinColumn(name = "livre_id"),
            inverseJoinColumns = @JoinColumn(name = "auteur_id")
    )
    private Set<Auteur> auteurs;

    // Relation Many-to-Many avec Utilisateur
    @ManyToMany(mappedBy = "livres")
    private Set<Utilisateur> emprunteurs;

    // Relation One-to-Many avec Emprunt
    @OneToMany(mappedBy = "livre", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Emprunt> emprunts;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public LocalDate getDatePublication() { return datePublication; }
    public void setDatePublication(LocalDate datePublication) { this.datePublication = datePublication; }

    public boolean isDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }

    public Set<Auteur> getAuteurs() { return auteurs; }
    public void setAuteurs(Set<Auteur> auteurs) { this.auteurs = auteurs; }

    public Set<Utilisateur> getEmprunteurs() { return emprunteurs; }
    public void setEmprunteurs(Set<Utilisateur> emprunteurs) { this.emprunteurs = emprunteurs; }

    public Set<Emprunt> getEmprunts() { return emprunts; }
    public void setEmprunts(Set<Emprunt> emprunts) { this.emprunts = emprunts; }


    public LocalDate getBorrowDate() {
        return borrowDate;
    }

    public void setBorrowDate(LocalDate borrowDate) {
        this.borrowDate = borrowDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

}
