package com.HolosINC.Holos.auth;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;


public interface AuthoritiesRepository extends CrudRepository<Authorities, String> {

	@Query("SELECT DISTINCT auth FROM Authorities auth WHERE auth.authority = :authority")
	Optional<Authorities> findByName(String authority);

	@Query("SELECT COUNT(*) > 0 FROM BaseUser b WHERE b.username = :username")
	boolean existsBaseUserByUsername(String username);

	@Query("SELECT COUNT(*) > 0 FROM BaseUser b WHERE b.email = :email")
	boolean existsBaseUserByEmail(String email);
}
