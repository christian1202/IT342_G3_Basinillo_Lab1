package com.it342.basinillo.repository;

import com.it342.basinillo.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for the Attendance entity.
 *
 * Provides standard CRUD operations plus custom queries
 * for user-specific lookups and date-range filtering.
 */
@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    /**
     * Find all attendance records for a specific user, ordered by clock-in time descending.
     *
     * @param userId the UUID of the user
     * @return list of attendance records (newest first)
     */
    List<Attendance> findByUserIdOrderByClockInTimeDesc(UUID userId);

    /**
     * Find attendance records for a user filtered by status.
     * Useful for finding open clock-in records (status = "CLOCKED_IN").
     *
     * @param userId the UUID of the user
     * @param status the status filter ("CLOCKED_IN" or "CLOCKED_OUT")
     * @return matching attendance records
     */
    List<Attendance> findByUserIdAndStatus(UUID userId, String status);

    /**
     * Find all attendance records within a specific time window.
     * Useful for daily/weekly reports.
     *
     * @param start the beginning of the time range (inclusive)
     * @param end   the end of the time range (inclusive)
     * @return matching attendance records
     */
    List<Attendance> findByClockInTimeBetween(Instant start, Instant end);
}
