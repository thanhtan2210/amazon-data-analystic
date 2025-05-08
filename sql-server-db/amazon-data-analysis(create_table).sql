-- SQL Script for Inventory Management System on Azure SQL Server
-- Created: May 07, 2025

-- No need to enable FOREIGN KEY constraints at the beginning
-- as we're dropping and recreating tables

-- Create Database
-- Note: In Azure SQL, you typically create the database through Azure portal or CLI
-- This script assumes the database already exists and you're executing within it
-- Drop relationship tables (con) trước
-- IF OBJECT_ID('dbo.[Contains]', 'U') IS NOT NULL DROP TABLE dbo.[Contains];
-- IF OBJECT_ID('dbo.Apply', 'U') IS NOT NULL DROP TABLE dbo.Apply;
-- IF OBJECT_ID('dbo.Manages', 'U') IS NOT NULL DROP TABLE dbo.Manages;
-- IF OBJECT_ID('dbo.Stores', 'U') IS NOT NULL DROP TABLE dbo.Stores;
-- IF OBJECT_ID('dbo.Supplies', 'U') IS NOT NULL DROP TABLE dbo.Supplies;
-- IF OBJECT_ID('dbo.Supervises', 'U') IS NOT NULL DROP TABLE dbo.Supervises;

-- -- Drop các bảng chính (cha) sau
-- IF OBJECT_ID('dbo.Shipping', 'U') IS NOT NULL DROP TABLE dbo.Shipping;
-- IF OBJECT_ID('dbo.Discount', 'U') IS NOT NULL DROP TABLE dbo.Discount;
-- IF OBJECT_ID('dbo.[Order]', 'U') IS NOT NULL DROP TABLE dbo.[Order];
-- IF OBJECT_ID('dbo.Customer', 'U') IS NOT NULL DROP TABLE dbo.Customer;
-- IF OBJECT_ID('dbo.Supplier', 'U') IS NOT NULL DROP TABLE dbo.Supplier;
-- IF OBJECT_ID('dbo.Product', 'U') IS NOT NULL DROP TABLE dbo.Product;
-- IF OBJECT_ID('dbo.Warehouse', 'U') IS NOT NULL DROP TABLE dbo.Warehouse;
-- IF OBJECT_ID('dbo.Employee', 'U') IS NOT NULL DROP TABLE dbo.Employee;

-- 1. Drop all foreign keys
DECLARE @sql NVARCHAR(MAX) = N'';
SELECT @sql = @sql + N'
ALTER TABLE [' + OBJECT_SCHEMA_NAME(parent_object_id) + '].[' + OBJECT_NAME(parent_object_id) + '] DROP CONSTRAINT [' + name + '];'
FROM sys.foreign_keys;
EXEC sp_executesql @sql;

-- 2. Drop all tables
SET @sql = N'';
SELECT @sql = @sql + 'DROP TABLE [' + SCHEMA_NAME(schema_id) + '].[' + name + '];'
FROM sys.tables;
EXEC sp_executesql @sql;

-- Create Tables
CREATE TABLE dbo.Employee (
    employee_id INT PRIMARY KEY,
    full_name NVARCHAR(100) NOT NULL,
    department NVARCHAR(50),
    hire_date DATE,
    email NVARCHAR(100),
    phone_number NVARCHAR(20),
    salary DECIMAL(12, 2),
    role NVARCHAR(50)
);

CREATE TABLE dbo.Warehouse (
    warehouse_id INT PRIMARY KEY,
    warehouse_name NVARCHAR(100) NOT NULL,
    area DECIMAL(10, 2), -- in square meters or feet
    capacity DECIMAL(10, 2), -- total volume or weight capacity
    status NVARCHAR(20) CHECK (status IN ('Active', 'Inactive', 'Under Maintenance')),
    phone_number NVARCHAR(20),
    stock_quantity INT
);

CREATE TABLE dbo.Product (
    product_id INT PRIMARY KEY,
    product_name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    price DECIMAL(12, 2) NOT NULL,
    weight DECIMAL(10, 2),
    category NVARCHAR(50),
    brand NVARCHAR(50),
    date_added DATE DEFAULT GETDATE(),
    images NVARCHAR(MAX), -- Comma-separated URLs or references to image files
    length DECIMAL(10, 2), -- Integrated size attributes
    width DECIMAL(10, 2),  -- Integrated size attributes
    height DECIMAL(10, 2)  -- Integrated size attributes
);

CREATE TABLE dbo.Supplier (
    supplier_id INT PRIMARY KEY,
    company_name NVARCHAR(100) NOT NULL,
    representative_name NVARCHAR(100),
    phone_number NVARCHAR(20),
    email NVARCHAR(100)
);

CREATE TABLE dbo.Customer (
    customer_id INT PRIMARY KEY,
    customer_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100),
    phone_number NVARCHAR(20),
    signup_date DATE DEFAULT GETDATE(),
    street NVARCHAR(100), -- Integrated address attributes
    district NVARCHAR(50), -- Integrated address attributes
    postal_number NVARCHAR(20) -- Integrated address attributes
);

CREATE TABLE dbo.[Order] (
    order_id INT PRIMARY KEY,
    order_date DATETIME DEFAULT GETDATE(),
    order_status NVARCHAR(20) CHECK (order_status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
    quantity INT NOT NULL,
    customer_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES dbo.Customer(customer_id)
);

CREATE TABLE dbo.Discount (
    discount_id INT PRIMARY KEY,
    discount_name NVARCHAR(100),
    discount_type NVARCHAR(20) CHECK (discount_type IN ('Percentage', 'Fixed Amount')),
    discount_value DECIMAL(5, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

CREATE TABLE dbo.Shipping (
    shipping_id INT PRIMARY KEY,
    cost DECIMAL(10, 2) NOT NULL,
    start_date DATE,
    end_date DATE,
    status NVARCHAR(20) CHECK (status IN ('Preparing', 'In Transit', 'Delivered')),
    tracking_number NVARCHAR(50),
    carrier_name NVARCHAR(50),
    transport_mode NVARCHAR(20) CHECK (transport_mode IN ('Air', 'Sea', 'Road', 'Rail')),
    shipping_street NVARCHAR(100),
    shipping_district NVARCHAR(50),
    shipping_postal_number NVARCHAR(20),
    order_id INT,
    FOREIGN KEY (order_id) REFERENCES dbo.[Order](order_id)
);

-- Create Relationship Tables
CREATE TABLE dbo.Supervises (
    employee_id INT,
    warehouse_id INT,
    PRIMARY KEY (employee_id, warehouse_id),
    FOREIGN KEY (employee_id) REFERENCES dbo.Employee(employee_id),
    FOREIGN KEY (warehouse_id) REFERENCES dbo.Warehouse(warehouse_id)
);

CREATE TABLE dbo.Manages (
    employee_id INT,
    order_id INT,
    PRIMARY KEY (employee_id, order_id),
    FOREIGN KEY (employee_id) REFERENCES dbo.Employee(employee_id),
    FOREIGN KEY (order_id) REFERENCES dbo.[Order](order_id)
);

CREATE TABLE dbo.Supplies (
    supplier_id INT,
    product_id INT,
    PRIMARY KEY (supplier_id, product_id),
    FOREIGN KEY (supplier_id) REFERENCES dbo.Supplier(supplier_id),
    FOREIGN KEY (product_id) REFERENCES dbo.Product(product_id)
);

CREATE TABLE dbo.Stores (
    warehouse_id INT,
    product_id INT,
    stock_quantity INT NOT NULL DEFAULT 0,
    last_updated DATETIME NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (warehouse_id, product_id),
    FOREIGN KEY (warehouse_id) REFERENCES dbo.Warehouse(warehouse_id),
    FOREIGN KEY (product_id) REFERENCES dbo.Product(product_id)
);

CREATE TABLE dbo.[Contains] (
    order_id INT,
    product_id INT,
    quantity INT NOT NULL DEFAULT 1,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES dbo.[Order](order_id),
    FOREIGN KEY (product_id) REFERENCES dbo.Product(product_id)
);

CREATE TABLE dbo.Apply (
    discount_id INT,
    order_id INT,
    PRIMARY KEY (discount_id, order_id),
    FOREIGN KEY (discount_id) REFERENCES dbo.Discount(discount_id),
    FOREIGN KEY (order_id) REFERENCES dbo.[Order](order_id)
);

-- Create indexes for better performance
CREATE INDEX IDX_Employee_Department ON dbo.Employee(department);
CREATE INDEX IDX_Product_Category ON dbo.Product(category);
CREATE INDEX IDX_Product_Brand ON dbo.Product(brand);
CREATE INDEX IDX_Order_Status ON dbo.[Order](order_status);
CREATE INDEX IDX_Order_Date ON dbo.[Order](order_date);
CREATE INDEX IDX_Customer_Email ON dbo.Customer(email);
CREATE INDEX IDX_Warehouse_Status ON dbo.Warehouse(status);

-- Insert Sample Data
-- Employees
INSERT INTO dbo.Employee (employee_id, full_name, department, hire_date, email, phone_number, salary, role)
VALUES 
(1, 'John Smith', 'Warehouse', '2023-01-15', 'john.smith@amazon.com', '555-0101', 65000.00, 'Warehouse Manager'),
(2, 'Sarah Johnson', 'Sales', '2023-02-20', 'sarah.j@amazon.com', '555-0102', 58000.00, 'Sales Representative'),
(3, 'Michael Brown', 'IT', '2023-03-10', 'michael.b@amazon.com', '555-0103', 72000.00, 'IT Specialist'),
(4, 'Emily Davis', 'HR', '2023-04-05', 'emily.d@amazon.com', '555-0104', 62000.00, 'HR Manager'),
(5, 'David Wilson', 'Logistics', '2023-05-12', 'david.w@amazon.com', '555-0105', 68000.00, 'Logistics Coordinator');

-- Warehouses
INSERT INTO dbo.Warehouse (warehouse_id, warehouse_name, area, capacity, status, phone_number, stock_quantity)
VALUES 
(1, 'Main Distribution Center', 10000.00, 50000.00, 'Active', '555-0201', 25000),
(2, 'North Regional Hub', 8000.00, 40000.00, 'Active', '555-0202', 20000),
(3, 'South Regional Hub', 7500.00, 35000.00, 'Active', '555-0203', 18000),
(4, 'East Regional Hub', 7000.00, 30000.00, 'Under Maintenance', '555-0204', 15000),
(5, 'West Regional Hub', 8500.00, 45000.00, 'Active', '555-0205', 22000);

-- Products
INSERT INTO dbo.Product (product_id, product_name, description, price, weight, category, brand, date_added, images, length, width, height)
VALUES 
(1, 'Amazon Echo Dot', 'Smart speaker with Alexa', 49.99, 0.3, 'Electronics', 'Amazon', '2023-01-01', 'echo_dot.jpg', 3.9, 3.9, 3.5),
(2, 'Kindle Paperwhite', 'E-reader with 6.8" display', 139.99, 0.4, 'Electronics', 'Amazon', '2023-01-02', 'kindle.jpg', 6.6, 4.6, 0.3),
(3, 'Fire TV Stick', 'Streaming media player', 39.99, 0.2, 'Electronics', 'Amazon', '2023-01-03', 'fire_tv.jpg', 3.4, 1.2, 0.5),
(4, 'Ring Video Doorbell', 'Smart doorbell with camera', 99.99, 0.5, 'Smart Home', 'Ring', '2023-01-04', 'ring_doorbell.jpg', 5.1, 2.4, 1.1),
(5, 'Amazon Basics Microwave', '700-watt microwave oven', 59.99, 25.0, 'Appliances', 'Amazon Basics', '2023-01-05', 'microwave.jpg', 17.3, 14.2, 10.2);

-- Suppliers
INSERT INTO dbo.Supplier (supplier_id, company_name, representative_name, phone_number, email)
VALUES 
(1, 'Tech Components Inc.', 'Robert Chen', '555-0301', 'robert@techcomponents.com'),
(2, 'Global Electronics Ltd.', 'Maria Garcia', '555-0302', 'maria@globalelectronics.com'),
(3, 'Smart Home Solutions', 'James Wilson', '555-0303', 'james@smarthome.com'),
(4, 'Quality Appliances Co.', 'Lisa Thompson', '555-0304', 'lisa@qualityappliances.com'),
(5, 'Digital Innovations', 'Tom Anderson', '555-0305', 'tom@digitalinnovations.com');

-- Customers
INSERT INTO dbo.Customer (customer_id, customer_name, email, phone_number, signup_date, street, district, postal_number)
VALUES 
(1, 'Alice Cooper', 'alice@email.com', '555-0401', '2023-01-10', '123 Main St', 'Downtown', '10001'),
(2, 'Bob Wilson', 'bob@email.com', '555-0402', '2023-01-15', '456 Oak Ave', 'Uptown', '10002'),
(3, 'Carol Martinez', 'carol@email.com', '555-0403', '2023-01-20', '789 Pine Rd', 'Midtown', '10003'),
(4, 'David Lee', 'david@email.com', '555-0404', '2023-01-25', '321 Elm St', 'Westside', '10004'),
(5, 'Eva Brown', 'eva@email.com', '555-0405', '2023-01-30', '654 Maple Dr', 'Eastside', '10005');

-- Orders
INSERT INTO dbo.[Order] (order_id, order_date, order_status, quantity, customer_id)
VALUES 
(1, '2023-02-01 10:00:00', 'Delivered', 2, 1),
(2, '2023-02-02 11:30:00', 'Processing', 1, 2),
(3, '2023-02-03 14:15:00', 'Shipped', 3, 3),
(4, '2023-02-04 09:45:00', 'Pending', 1, 4),
(5, '2023-02-05 16:20:00', 'Delivered', 2, 5);

-- Discounts
INSERT INTO dbo.Discount (discount_id, discount_name, discount_type, discount_value, start_date, end_date)
VALUES 
(1, 'Summer Sale', 'Percentage', 20.00, '2023-06-01', '2023-08-31'),
(2, 'Holiday Special', 'Fixed Amount', 50.00, '2023-12-01', '2023-12-31'),
(3, 'New Customer', 'Percentage', 15.00, '2023-01-01', '2023-12-31'),
(4, 'Bulk Purchase', 'Percentage', 10.00, '2023-01-01', '2023-12-31'),
(5, 'Flash Sale', 'Fixed Amount', 25.00, '2023-03-01', '2023-03-07');

-- Shipping
INSERT INTO dbo.Shipping (shipping_id, cost, start_date, end_date, status, tracking_number, carrier_name, transport_mode, shipping_street, shipping_district, shipping_postal_number, order_id)
VALUES 
(1, 5.99, '2023-02-01', '2023-02-03', 'Delivered', 'TRK123456', 'Amazon Logistics', 'Road', '123 Main St', 'Downtown', '10001', 1),
(2, 7.99, '2023-02-02', NULL, 'In Transit', 'TRK123457', 'FedEx', 'Air', '456 Oak Ave', 'Uptown', '10002', 2),
(3, 4.99, '2023-02-03', '2023-02-05', 'Delivered', 'TRK123458', 'UPS', 'Road', '789 Pine Rd', 'Midtown', '10003', 3),
(4, 6.99, '2023-02-04', NULL, 'Preparing', 'TRK123459', 'DHL', 'Air', '321 Elm St', 'Westside', '10004', 4),
(5, 5.99, '2023-02-05', '2023-02-07', 'Delivered', 'TRK123460', 'Amazon Logistics', 'Road', '654 Maple Dr', 'Eastside', '10005', 5);

-- Relationship Tables Data
-- Supervises
INSERT INTO dbo.Supervises (employee_id, warehouse_id)
VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Manages
INSERT INTO dbo.Manages (employee_id, order_id)
VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Supplies
INSERT INTO dbo.Supplies (supplier_id, product_id)
VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Stores
INSERT INTO dbo.Stores (warehouse_id, product_id, stock_quantity)
VALUES 
(1, 1, 100),
(1, 2, 150),
(2, 3, 200),
(2, 4, 75),
(3, 5, 125);

-- Contains
INSERT INTO dbo.[Contains] (order_id, product_id, quantity)
VALUES 
(1, 1, 2),
(2, 2, 1),
(3, 3, 3),
(4, 4, 1),
(5, 5, 2);

-- Apply
INSERT INTO dbo.Apply (discount_id, order_id)
VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Note: In Azure SQL Database, foreign key constraints are automatically enabled
-- when tables are created with proper FOREIGN KEY definitions