package com.X_Tends.Teams.library_management.service;

import com.X_Tends.Teams.library_management.model.Emprunt;
import com.X_Tends.Teams.library_management.repository.EmpruntRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmpruntService {

    @Autowired
    private final EmpruntRepository empruntRepository;

    public EmpruntService(EmpruntRepository empruntRepository) {
        this.empruntRepository = empruntRepository;
    }

    public Emprunt saveEmprunt(Emprunt emprunt) {
        return empruntRepository.save(emprunt);
    }

    public List<Emprunt> getAllEmprunts() {
        return empruntRepository.findAll();
    }

    public Emprunt getEmpruntById(Long id) {
        return empruntRepository.findById(id).orElseThrow(() -> new RuntimeException("Emprunt non trouvé"));
    }
    public Optional<Emprunt> findById(Long id) {
        return empruntRepository.findById(id);
    }

    public Emprunt save(Emprunt emprunt) {
        return empruntRepository.save(emprunt);
    }

    public void deleteById(Long id) {
        empruntRepository.deleteById(id);
    }

}

