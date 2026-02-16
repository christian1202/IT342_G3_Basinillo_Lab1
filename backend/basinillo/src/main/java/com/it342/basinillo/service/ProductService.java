package com.it342.basinillo.service;

import com.it342.basinillo.entity.Product;
import com.it342.basinillo.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for Product (Inventory) management.
 *
 * Provides full CRUD operations with guard-clause validation.
 * All methods follow Single Responsibility — each does exactly one thing.
 */
@Service
public class ProductService {

    private final ProductRepository productRepository;

    /**
     * Constructor Injection — Spring auto-injects the ProductRepository.
     */
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /* ================================================================== */
    /*  READ                                                               */
    /* ================================================================== */

    /**
     * Returns every product in the inventory.
     *
     * @return list of all products
     */
    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }

    /**
     * Finds a single product by its database ID.
     *
     * @param productId the product's primary key
     * @return an Optional containing the product if found
     */
    public Optional<Product> findProductById(Long productId) {
        return productRepository.findById(productId);
    }

    /**
     * Searches products whose name contains the keyword (case-insensitive).
     *
     * @param keyword the search term
     * @return list of matching products
     */
    public List<Product> searchProductsByName(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    /* ================================================================== */
    /*  CREATE                                                             */
    /* ================================================================== */

    /**
     * Creates a new product in the inventory.
     *
     * Guard: rejects the request if a product with the same SKU already exists.
     *
     * @param product the product to create
     * @return the saved product with its generated ID
     * @throws IllegalArgumentException if the SKU is already taken
     */
    public Product createProduct(Product product) {

        // Guard: SKU must be unique
        Optional<Product> existingProduct = productRepository.findBySku(product.getSku());

        if (existingProduct.isPresent()) {
            throw new IllegalArgumentException(
                    "A product with SKU '" + product.getSku() + "' already exists.");
        }

        return productRepository.save(product);
    }

    /* ================================================================== */
    /*  UPDATE                                                             */
    /* ================================================================== */

    /**
     * Updates an existing product's details.
     *
     * Guard: returns empty Optional if the product does not exist.
     * Only mutable fields are updated — the ID and createdAt remain unchanged.
     *
     * @param productId      the ID of the product to update
     * @param updatedProduct the new field values
     * @return an Optional containing the updated product, or empty if not found
     */
    public Optional<Product> updateProduct(Long productId, Product updatedProduct) {

        // Guard: product must exist
        Optional<Product> optionalProduct = productRepository.findById(productId);

        if (optionalProduct.isEmpty()) {
            return Optional.empty();
        }

        Product existingProduct = optionalProduct.get();

        // --- Update mutable fields ---
        existingProduct.setSku(updatedProduct.getSku());
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setQuantity(updatedProduct.getQuantity());

        return Optional.of(productRepository.save(existingProduct));
    }

    /* ================================================================== */
    /*  DELETE                                                             */
    /* ================================================================== */

    /**
     * Deletes a product by its database ID.
     *
     * Guard: returns false if the product does not exist.
     *
     * @param productId the ID of the product to delete
     * @return true if deleted, false if not found
     */
    public boolean deleteProduct(Long productId) {

        // Guard: product must exist
        if (!productRepository.existsById(productId)) {
            return false;
        }

        productRepository.deleteById(productId);
        return true;
    }
}
