package com.it342.basinillo.repository;

import com.it342.basinillo.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the Product entity.
 *
 * Provides standard CRUD operations plus custom queries
 * for SKU lookups and name-based searching.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Find a product by its exact SKU (Stock Keeping Unit).
     *
     * @param sku the SKU to search for
     * @return an Optional containing the product if found
     */
    Optional<Product> findBySku(String sku);

    /**
     * Search products whose name contains the given keyword (case-insensitive).
     * Useful for search bars / autocomplete.
     *
     * @param keyword the search term
     * @return list of matching products
     */
    List<Product> findByNameContainingIgnoreCase(String keyword);
}
