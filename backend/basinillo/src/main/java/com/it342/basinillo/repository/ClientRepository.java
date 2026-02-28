package com.it342.basinillo.repository;

import com.it342.basinillo.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for the Client entity.
 */
@Repository
public interface ClientRepository extends JpaRepository<Client, UUID> {

    /**
     * Find all clients belonging to a specific organization.
     *
     * @param orgId the organization UUID
     * @return list of clients scoped to that org
     */
    List<Client> findByOrgId(UUID orgId);
}
