package com.HolosINC.Holos.model;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BaseUserRepository extends JpaRepository<BaseUser, Integer> {

    @Query("SELECT u FROM BaseUser u WHERE u.username = :username AND u.password = :password")
    Optional<BaseUser> login(String username, String password);

    @Query("SELECT u FROM BaseUser u WHERE u.username = :username")
    Optional<BaseUser> findByUsername(String username);
}
