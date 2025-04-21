package com.HolosINC.Holos.model;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.client.Client;

@Repository
public interface BaseUserRepository extends JpaRepository<BaseUser, Long> {

    @Query("SELECT u FROM BaseUser u WHERE u.username = :username")
    Optional<BaseUser> findUserByUsername(String username);

    @Query("SELECT u FROM BaseUser u WHERE u.email = :email")
    Optional<BaseUser> findByEmail(String email);
    
    @Query("SELECT c FROM Client c WHERE c.baseUser.id = :id")
    Optional<Client> findClient(Long id);

    @Query("SELECT a FROM Artist a WHERE a.baseUser.id = :id")
    Optional<Artist> findArtist(Long id);
}
