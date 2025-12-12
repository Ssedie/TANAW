package com.crud.tanaw.services;
import org.springframework.stereotype.Component;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class PasswordRateLimiter {

    private final Map<Long, Integer> attempts = new ConcurrentHashMap<>();
    private final Map<Long, Long> lockUntil = new ConcurrentHashMap<>();

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCK_TIME_MS = 3 * 60 * 1000; // 3 minutes

    public boolean isLocked(Long userId) {
        Long lockTime = lockUntil.get(userId);
        if (lockTime == null) return false;
        if (Instant.now().toEpochMilli() > lockTime) {
            attempts.put(userId, 0);
            lockUntil.remove(userId);
            return false;
        }
        return true;
    }

    public void recordFail(Long userId) {
        int count = attempts.getOrDefault(userId, 0) + 1;
        attempts.put(userId, count);

        if (count >= MAX_ATTEMPTS) {
            lockUntil.put(userId, Instant.now().toEpochMilli() + LOCK_TIME_MS);
        }
    }

    public void reset(Long userId) {
        attempts.put(userId, 0);
        lockUntil.remove(userId);
    }
}
