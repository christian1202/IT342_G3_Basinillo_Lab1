package com.it342.basinillo.repository;

import com.it342.basinillo.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Spring Data JPA repository for the Organization entity.
 */
@Repository
public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
}
