package com.it342.basinillo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * JPA Entity for inventory products.
 *
 * Each record represents a unique product in the warehouse
 * identified by its SKU (Stock Keeping Unit).
 *
 * Mapped to the "products" table — Hibernate creates it automatically
 * via ddl-auto=update.
 *
 * Design notes:
 *   - Price uses BigDecimal (never double/float for monetary values).
 *   - createdAt / updatedAt are managed via JPA lifecycle callbacks.
 */
@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    /* ------------------------------------------------------------------ */
    /*  Primary Key                                                        */
    /* ------------------------------------------------------------------ */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ------------------------------------------------------------------ */
    /*  Core Fields                                                        */
    /* ------------------------------------------------------------------ */

    /**
     * Stock Keeping Unit — a unique identifier for inventory tracking.
     * Example: "SHIP-2026-001".
     */
    @Column(name = "sku", nullable = false, unique = true, length = 50)
    private String sku;

    /**
     * Human-readable product name.
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Optional longer description of the product.
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Unit price in the default currency.
     * Precision 10, scale 2 → supports up to 99,999,999.99.
     */
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /**
     * Current quantity in stock.
     * A negative value should never occur — guard in the service layer.
     */
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    /* ------------------------------------------------------------------ */
    /*  Audit Timestamps                                                   */
    /* ------------------------------------------------------------------ */

    /**
     * Automatically set when the entity is first persisted.
     */
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    /**
     * Automatically updated every time the entity is modified.
     */
    @Column(name = "updated_at")
    private Instant updatedAt;

    /* ---- JPA lifecycle callbacks ---- */

    @PrePersist
    protected void onPrePersist() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onPreUpdate() {
        this.updatedAt = Instant.now();
    }
}
