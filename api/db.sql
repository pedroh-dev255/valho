-- Active: 1750763277253@@127.0.0.1@3306@valho_db
CREATE DATABASE IF NOT EXISTS valho_db charset utf8mb4 COLLATE utf8mb4_unicode_ci;
USE valho_db;

--drop database valho_db;
CREATE TABLE IF NOT EXISTS institutions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cnpj VARCHAR(20) NOT NULL UNIQUE,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS invites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    created_by INT NOT NULL, -- ID do usuario que criou o convite. 0 para convites criados pelo sistema
    id_institution INT NOT NULL,
    status ENUM('pending', 'accepted', 'expired') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Foreign Key (id_institution) REFERENCES institutions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_institution INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expires_at DATETIME,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    Foreign Key (id_institution) REFERENCES institutions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `key` VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_institution INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Foreign Key (id_institution) REFERENCES institutions(id),
    UNIQUE KEY unique_role_per_institution (
        id_institution,
        name
    ),
    INDEX idx_roles_institution(id_institution)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,

    PRIMARY KEY(role_id, permission_id),

    FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    FOREIGN KEY (permission_id)
        REFERENCES permissions(id)
        ON DELETE CASCADE
);

CREATE TABLE user_roles (
    user_id INT,
    role_id INT,

    PRIMARY KEY(user_id, role_id),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs(
    id INT NOT NULL AUTO_INCREMENT,
    id_institution INT NOT NULL,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    level ENUM('info', 'good', 'warning', 'error') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (id_institution) REFERENCES institutions(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


-- ============================================================================
-- ESTOQUE / INVENTÁRIO
-- ============================================================================

-- CATEGORIAS DE PRODUTOS
CREATE TABLE IF NOT EXISTS inventory_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_institution INT NOT NULL,

    name VARCHAR(255) NOT NULL,
    description TEXT,

    color VARCHAR(20) DEFAULT '#10B981',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (id_institution)
        REFERENCES institutions(id)
        ON DELETE CASCADE,

    INDEX idx_inventory_categories_institution(id_institution)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- LOCAIS / DEPÓSITOS / ESTOQUES
CREATE TABLE IF NOT EXISTS inventory_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_institution INT NOT NULL,

    name VARCHAR(255) NOT NULL,
    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_institution)
        REFERENCES institutions(id)
        ON DELETE CASCADE,

    INDEX idx_inventory_locations_institution(id_institution)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- FORNECEDORES
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_institution INT NOT NULL,

    company_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),

    document VARCHAR(30),
    email VARCHAR(255),
    phone VARCHAR(30),

    contact_name VARCHAR(255),

    status ENUM('active', 'inactive') DEFAULT 'active',

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (id_institution)
        REFERENCES institutions(id)
        ON DELETE CASCADE,

    INDEX idx_suppliers_institution(id_institution)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- PRODUTOS
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_institution INT NOT NULL,

    category_id INT,
    supplier_id INT,

    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(255),

    name VARCHAR(255) NOT NULL,
    description TEXT,

    unit VARCHAR(30) DEFAULT 'un',
    image_url TEXT,

    cost_price DECIMAL(12,2) DEFAULT 0.00,
    sale_price DECIMAL(12,2) DEFAULT 0.00,

    minimum_stock DECIMAL(12,3) DEFAULT 0,
    maximum_stock DECIMAL(12,3) DEFAULT NULL,

    current_stock DECIMAL(12,3) DEFAULT 0,

    status ENUM('active', 'inactive') DEFAULT 'active',

    created_by INT,
    updated_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (id_institution)
        REFERENCES institutions(id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES inventory_categories(id)
        ON DELETE SET NULL,

    FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE SET NULL,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    FOREIGN KEY (updated_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    INDEX idx_products_institution(id_institution),
    INDEX idx_products_category(category_id),
    INDEX idx_products_supplier(supplier_id),
    INDEX idx_products_name(name),
    INDEX idx_products_status(status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ESTOQUE POR LOCAL
CREATE TABLE IF NOT EXISTS product_location_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,

    product_id INT NOT NULL,
    location_id INT NOT NULL,

    quantity DECIMAL(12,3) DEFAULT 0,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    FOREIGN KEY (location_id)
        REFERENCES inventory_locations(id)
        ON DELETE CASCADE,

    UNIQUE KEY unique_product_location (
        product_id,
        location_id
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- COMPRAS
CREATE TABLE IF NOT EXISTS purchase_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,

    id_institution INT NOT NULL,

    supplier_id INT NOT NULL,

    created_by INT NOT NULL,

    financial_transaction_id INT NULL,

    status ENUM(
        'draft',
        'pending',
        'approved',
        'partial_received',
        'received',
        'cancelled'
    ) DEFAULT 'draft',

    invoice_number VARCHAR(100),

    notes TEXT,

    subtotal DECIMAL(12,2) DEFAULT 0.00,
    discount DECIMAL(12,2) DEFAULT 0.00,
    shipping_cost DECIMAL(12,2) DEFAULT 0.00,
    total DECIMAL(12,2) DEFAULT 0.00,

    purchase_date DATE,
    expected_delivery_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (id_institution)
        REFERENCES institutions(id)
        ON DELETE CASCADE,

    FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    INDEX idx_purchase_orders_institution(id_institution),
    INDEX idx_purchase_orders_supplier(supplier_id),
    INDEX idx_purchase_orders_status(status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ITENS DAS COMPRAS
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,

    purchase_order_id INT NOT NULL,
    product_id INT NOT NULL,

    quantity DECIMAL(12,3) NOT NULL,
    received_quantity DECIMAL(12,3) DEFAULT 0,

    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,

    FOREIGN KEY (purchase_order_id)
        REFERENCES purchase_orders(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    INDEX idx_purchase_items_order(purchase_order_id),
    INDEX idx_purchase_items_product(product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- MOVIMENTAÇÕES DE ESTOQUE
CREATE TABLE IF NOT EXISTS inventory_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,

    id_institution INT NOT NULL,

    product_id INT NOT NULL,

    location_id INT,

    user_id INT NOT NULL,

    purchase_order_id INT NULL,

    type ENUM(
        'entry',
        'exit',
        'adjustment',
        'transfer',
        'loss',
        'return'
    ) NOT NULL,

    reason VARCHAR(255),

    quantity DECIMAL(12,3) NOT NULL,

    stock_before DECIMAL(12,3) NOT NULL,
    stock_after DECIMAL(12,3) NOT NULL,

    unit_cost DECIMAL(12,2),

    reference_document VARCHAR(255),

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_institution)
        REFERENCES institutions(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (location_id)
        REFERENCES inventory_locations(id)
        ON DELETE SET NULL,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (purchase_order_id)
        REFERENCES purchase_orders(id)
        ON DELETE SET NULL,

    INDEX idx_inventory_movements_institution(id_institution),
    INDEX idx_inventory_movements_product(product_id),
    INDEX idx_inventory_movements_type(type),
    INDEX idx_inventory_movements_created(created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- AJUSTES DE INVENTÁRIO
CREATE TABLE IF NOT EXISTS inventory_adjustments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    id_institution INT NOT NULL,

    created_by INT NOT NULL,

    reason TEXT NOT NULL,

    status ENUM(
        'draft',
        'completed',
        'cancelled'
    ) DEFAULT 'draft',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_institution)
        REFERENCES institutions(id)
        ON DELETE CASCADE,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ITENS DOS AJUSTES
CREATE TABLE IF NOT EXISTS inventory_adjustment_items (
    id INT AUTO_INCREMENT PRIMARY KEY,

    adjustment_id INT NOT NULL,

    product_id INT NOT NULL,

    expected_quantity DECIMAL(12,3) NOT NULL,
    counted_quantity DECIMAL(12,3) NOT NULL,

    difference_quantity DECIMAL(12,3) NOT NULL,

    notes TEXT,

    FOREIGN KEY (adjustment_id)
        REFERENCES inventory_adjustments(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- TRANSFERÊNCIAS ENTRE ESTOQUES
CREATE TABLE IF NOT EXISTS inventory_transfers (
    id INT AUTO_INCREMENT PRIMARY KEY,

    id_institution INT NOT NULL,

    from_location_id INT NOT NULL,
    to_location_id INT NOT NULL,

    created_by INT NOT NULL,

    status ENUM(
        'draft',
        'in_transit',
        'completed',
        'cancelled'
    ) DEFAULT 'draft',

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_institution)
        REFERENCES institutions(id)
        ON DELETE CASCADE,

    FOREIGN KEY (from_location_id)
        REFERENCES inventory_locations(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (to_location_id)
        REFERENCES inventory_locations(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ITENS DAS TRANSFERÊNCIAS
CREATE TABLE IF NOT EXISTS inventory_transfer_items (
    id INT AUTO_INCREMENT PRIMARY KEY,

    transfer_id INT NOT NULL,

    product_id INT NOT NULL,

    quantity DECIMAL(12,3) NOT NULL,

    FOREIGN KEY (transfer_id)
        REFERENCES inventory_transfers(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;