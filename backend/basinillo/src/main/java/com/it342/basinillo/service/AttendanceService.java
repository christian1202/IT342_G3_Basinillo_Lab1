package com.it342.basinillo.service;

import com.it342.basinillo.entity.Attendance;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.repository.AttendanceRepository;
import com.it342.basinillo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Service layer for Attendance management.
 *
 * Handles clock-in / clock-out logic with guard clauses to prevent
 * invalid state transitions (e.g., double clock-in).
 */
@Service
public class AttendanceService {

    /* ---- Constants ---- */
    private static final String STATUS_CLOCKED_IN  = "CLOCKED_IN";
    private static final String STATUS_CLOCKED_OUT = "CLOCKED_OUT";

    /* ---- Dependencies ---- */
    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    /**
     * Constructor Injection — Spring auto-injects both repositories.
     */
    public AttendanceService(AttendanceRepository attendanceRepository,
                             UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
    }

    /* ================================================================== */
    /*  Clock-In                                                           */
    /* ================================================================== */

    /**
     * Records a clock-in for the given user.
     *
     * Guard clauses:
     *   1. User must exist in the database.
     *   2. User must NOT already have an open clock-in record.
     *
     * @param userId the UUID of the user clocking in
     * @return the newly created Attendance record
     * @throws IllegalArgumentException if the user does not exist
     * @throws IllegalStateException    if the user is already clocked in
     */
    public Attendance recordClockIn(UUID userId) {

        // Guard: user must exist
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found: " + userId));

        // Guard: no open clock-in should exist
        List<Attendance> openRecords =
                attendanceRepository.findByUserIdAndStatus(userId, STATUS_CLOCKED_IN);

        if (!openRecords.isEmpty()) {
            throw new IllegalStateException(
                    "User is already clocked in. Clock out first before clocking in again.");
        }

        // --- Create the attendance record ---
        Attendance attendance = Attendance.builder()
                .user(user)
                .clockInTime(Instant.now())
                .status(STATUS_CLOCKED_IN)
                .build();

        return attendanceRepository.save(attendance);
    }

    /* ================================================================== */
    /*  Clock-Out                                                          */
    /* ================================================================== */

    /**
     * Records a clock-out for the given user.
     *
     * Guard clauses:
     *   1. User must have an open clock-in record (status = "CLOCKED_IN").
     *
     * @param userId the UUID of the user clocking out
     * @return the updated Attendance record with clock-out time set
     * @throws IllegalStateException if no open clock-in exists
     */
    public Attendance recordClockOut(UUID userId) {

        // Guard: must have an open clock-in
        List<Attendance> openRecords =
                attendanceRepository.findByUserIdAndStatus(userId, STATUS_CLOCKED_IN);

        if (openRecords.isEmpty()) {
            throw new IllegalStateException(
                    "No open clock-in record found. Clock in first before clocking out.");
        }

        // Take the most recent open record (should only be one, but be safe)
        Attendance attendance = openRecords.get(0);

        // --- Update the record ---
        attendance.setClockOutTime(Instant.now());
        attendance.setStatus(STATUS_CLOCKED_OUT);

        return attendanceRepository.save(attendance);
    }

    /* ================================================================== */
    /*  History                                                            */
    /* ================================================================== */

    /**
     * Retrieves the full attendance history for a user, newest first.
     *
     * @param userId the UUID of the user
     * @return list of attendance records ordered by clockInTime descending
     */
    public List<Attendance> findAttendanceHistoryByUser(UUID userId) {
        return attendanceRepository.findByUserIdOrderByClockInTimeDesc(userId);
    }
}
