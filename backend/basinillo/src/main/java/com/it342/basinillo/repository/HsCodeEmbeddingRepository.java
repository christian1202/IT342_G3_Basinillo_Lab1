package com.it342.basinillo.repository;

import com.it342.basinillo.entity.HsCodeEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for the HsCodeEmbedding entity.
 *
 * Note: Semantic similarity search (vector queries) will use custom
 * native SQL queries with pgvector once Task 1.13 is complete. This
 * repository provides standard CRUD and basic lookups only.
 */
@Repository
public interface HsCodeEmbeddingRepository extends JpaRepository<HsCodeEmbedding, UUID> {

    /**
     * Find an HS Code entry by its exact code.
     *
     * @param hsCode the tariff code to look up
     * @return matching entries (codes can have sub-classifications)
     */
    List<HsCodeEmbedding> findByHsCode(String hsCode);

    /**
     * Check if a specific HS Code already exists in the database.
     *
     * @param hsCode the tariff code to check
     * @return true if at least one entry exists
     */
    boolean existsByHsCode(String hsCode);
}
