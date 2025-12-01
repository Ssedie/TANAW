package com.crud.tanaw.Repositories;

import com.crud.tanaw.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUserId(int user_id);
    boolean existsByUserId(int user_id);
}
