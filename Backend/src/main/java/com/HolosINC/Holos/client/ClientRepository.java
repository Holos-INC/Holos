package com.HolosINC.Holos.client;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.HolosINC.Holos.artist.Artist;

public interface ClientRepository extends JpaRepository<Client, Long> {

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Client c WHERE c.id = :id")
    boolean isClient(Long id);
    
    @Query("SELECT c FROM Client c WHERE c.baseUser.id = :id")
    Optional<Client> getClientByUser(Long id);

    @Query("SELECT COUNT(c) > 0 FROM Commision c WHERE c.client.id = :clientId AND c.status = 'ACCEPTED'")
    boolean hasActiveCommisions(Long clientId);

    @Query("SELECT c FROM Client c WHERE c.baseUser.id = :id")
   Optional<Artist> findClientByUser(Long id);

    //Puede que esta query quede obsoleta después de actualizar el webhook
    @Query("SELECT c FROM Client c WHERE c.baseUser.email = :email")
    Optional<Client> getClientByEmail(String email);
}
