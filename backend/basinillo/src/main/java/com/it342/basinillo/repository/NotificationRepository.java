package com.it342.basinillo.repository;

import com.it342.basinillo.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for the Notification entity.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    /**
     * Find all notifications for a user, newest first.
     *
     * @param userId the recipient user UUID
     * @return list of notifications ordered by creation date descending
     */
    List<Notification> findByUserIdOrderByCreatedAtDesc(UUID userId);

    /**
     * Find only unread notifications for a user.
     *
     * @param userId the recipient user UUID
     * @return list of unread notifications
     */
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(UUID userId);

    /**
     * Count unread notifications for badge display.
     *
     * @param userId the recipient user UUID
     * @return count of unread notifications
     */
    long countByUserIdAndIsReadFalse(UUID userId);
}
