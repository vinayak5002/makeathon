-- Create the database
CREATE DATABASE IF NOT EXISTS customer_db;
USE customer_db;

-- Create Customers table
CREATE TABLE IF NOT EXISTS Customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS Users (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    db_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    total_amount DECIMAL(10, 2),
    status ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Create Products table
CREATE TABLE IF NOT EXISTS Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255),
    price DECIMAL(10, 2),
    stock_quantity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Order_Items table to handle many-to-many relationship between Orders and Products
CREATE TABLE IF NOT EXISTS Order_Items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Insert sample data into Customers table
INSERT INTO Customers (first_name, last_name, email, phone) VALUES
('John', 'Doe', 'john.doe@example.com', '123-456-7890'),
('Jane', 'Smith', 'jane.smith@example.com', '987-654-3210'),
('Emily', 'Johnson', 'emily.johnson@example.com', '555-123-4567'),
('Michael', 'Brown', 'michael.brown@example.com', '222-333-4444');

-- Insert sample data into Products table
INSERT INTO Products (product_name, price, stock_quantity) VALUES
('Laptop', 999.99, 50),
('Smartphone', 499.99, 150),
('Tablet', 299.99, 100),
('Headphones', 89.99, 200);

-- Insert sample data into Orders table
INSERT INTO Orders (customer_id, order_date, total_amount, status) VALUES
(1, '2025-01-10', 1499.98, 'Shipped'),
(2, '2025-01-12', 799.98, 'Pending'),
(3, '2025-01-15', 599.97, 'Delivered'),
(4, '2025-01-17', 179.97, 'Cancelled');

-- Insert sample data into Order_Items table
INSERT INTO Order_Items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 999.99),   -- John bought 1 Laptop
(1, 2, 1, 499.99),   -- John bought 1 Smartphone
(2, 2, 2, 499.99),   -- Jane bought 2 Smartphones
(3, 3, 2, 299.99),   -- Emily bought 2 Tablets
(3, 4, 1, 89.99),    -- Emily bought 1 Headphones
(4, 4, 2, 89.99);    -- Michael bought 2 Headphones

