package com.crud.tanaw.repositories;

import com.crud.tanaw.entities.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Integer> {
    boolean existsByReplyIdIs(Integer replyId);
    List<Reply> findByUserUserId(Integer userId);
}
