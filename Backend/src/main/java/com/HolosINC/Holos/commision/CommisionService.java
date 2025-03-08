package com.HolosINC.Holos.commision;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;

@Service
public class CommisionService {
    
    private final CommisionRepository commisionRepository;
    private final ArtistService artistService;

    @Autowired
    public CommisionService(CommisionRepository commisionRepository, ArtistService artistService){
        this.commisionRepository = commisionRepository;
        this.artistService = artistService;
    }

    public Commision createCommision(Commision commision) {
        return commisionRepository.save(commision);
    }

    public List<Commision> getAllCommisions() {
        return commisionRepository.findAll();
    }

    public Commision getCommisionById(Long id) {
        return commisionRepository.findById(id).orElse(null);
    }

    @Transactional
    public Commision updateCommisionStatus(Long commisionId, Long artistId, boolean accept) {
        Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));

        Artist artist = artistService.findArtist(artistId);

        if (!commision.getArtist().getId().equals(artist.getId())) {
            throw new IllegalArgumentException("El artista no tiene permisos para modificar esta comisión.");
        }

        if (accept) { 
            if (artist.getNumSlotsOfWork() > 0) {
                commision.setStatus(StatusCommision.ACCEPTED);
                commision.setAcceptedDateByArtist(new Date());
                artist.setNumSlotsOfWork(artist.getNumSlotsOfWork() - 1); // Reducir el número de slots
            } else {
                commision.setStatus(StatusCommision.IN_WAIT_LIST);
            }
        } else { 
            if (!commision.getStatus().equals(StatusCommision.REQUESTED)) {
                throw new IllegalStateException("Solo se pueden rechazar comisiones en estado 'REQUESTED'.");
            }
            commision.setStatus(StatusCommision.REJECTED);
        }

        return commisionRepository.save(commision);
    }

    @Transactional
    public void cancelCommision(Long commisionId, Long clientId) {
        Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));

        if (!commision.getClient().getId().equals(clientId)) {
            throw new IllegalArgumentException("El cliente no tiene permisos para cancelar esta comisión.");
        }

        if (!(commision.getStatus() == StatusCommision.REQUESTED ||
            commision.getStatus() == StatusCommision.IN_WAIT_LIST ||
            commision.getStatus() == StatusCommision.ACCEPTED)) {
            throw new IllegalStateException("La comisión no puede ser cancelada en su estado actual.");
        }

        commision.setStatus(StatusCommision.CANCELED);
        commisionRepository.save(commision);
    }

    public Commision deleteCommision(Long id) {
        Commision commision = commisionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", id));
        commisionRepository.delete(commision);
        return commision;
    }
}
