package com.crud.tanaw.repositories;

import com.crud.tanaw.entities.ResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResetTokenRepository extends JpaRepository<ResetToken, Long> {
    Optional<ResetToken> findByTokenAndUsedFalse(String token);
}
