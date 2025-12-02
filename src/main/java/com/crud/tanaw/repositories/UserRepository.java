package com.crud.tanaw.repositories;

import com.crud.tanaw.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUserId(Integer userId);
    boolean existsByUserId(Integer userId);
    boolean existsByEmail(String email);
}
