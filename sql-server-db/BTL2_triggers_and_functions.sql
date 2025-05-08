-- ===========================
-- TRIGGERS & FUNCTIONS FOR SUPPLY CHAIN DB (SQL SERVER)
-- ===========================

-- 1. Trigger: Log low product stock (log only, does not block operation)
IF OBJECT_ID('dbo.ProductLog', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ProductLog (
        log_id INT IDENTITY(1,1) PRIMARY KEY,
        product_id INT,
        message NVARCHAR(255),
        log_date DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (product_id) REFERENCES dbo.Product(product_id)
    );
END
GO

CREATE OR ALTER TRIGGER trg_LogLowStock
ON dbo.Stores
AFTER INSERT, UPDATE
AS
BEGIN
    DECLARE @product_id INT
    SELECT TOP 1 @product_id = product_id FROM inserted

    DECLARE @total INT
    SELECT @total = SUM(stock_quantity) FROM dbo.Stores WHERE product_id = @product_id

    IF @total < 10
    BEGIN
        INSERT INTO dbo.ProductLog(product_id, message, log_date)
        VALUES (@product_id, N'Warning: Product stock is below 10!', GETDATE())
    END
END
GO

-- 2. Trigger: Update warehouse total stock after changes in Stores
CREATE OR ALTER TRIGGER trg_UpdateWarehouseStock_Insert
ON dbo.Stores
AFTER INSERT, UPDATE
AS
BEGIN
    UPDATE w
    SET w.stock_quantity = (
        SELECT ISNULL(SUM(s.stock_quantity), 0)
        FROM dbo.Stores s
        WHERE s.warehouse_id = w.warehouse_id
    )
    FROM dbo.Warehouse w
    INNER JOIN inserted i ON w.warehouse_id = i.warehouse_id
END
GO

CREATE OR ALTER TRIGGER trg_UpdateWarehouseStock_Delete
ON dbo.Stores
AFTER DELETE
AS
BEGIN
    UPDATE w
    SET w.stock_quantity = (
        SELECT ISNULL(SUM(s.stock_quantity), 0)
        FROM dbo.Stores s
        WHERE s.warehouse_id = w.warehouse_id
    )
    FROM dbo.Warehouse w
    INNER JOIN deleted d ON w.warehouse_id = d.warehouse_id
END
GO

-- 3. Trigger: Ensure shipping start date is not before order date
CREATE OR ALTER TRIGGER trg_CheckShippingDate
ON dbo.Shipping
INSTEAD OF INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN dbo.[Order] o ON i.order_id = o.order_id
        WHERE i.start_date < o.order_date
    )
    BEGIN
        RAISERROR(N'Shipping start date cannot be before order date!', 16, 1)
        ROLLBACK TRANSACTION
        RETURN
    END

    INSERT INTO dbo.Shipping (shipping_id, cost, start_date, end_date, status, tracking_number, carrier_name, transport_mode, shipping_street, shipping_district, shipping_postal_number, order_id)
    SELECT shipping_id, cost, start_date, end_date, status, tracking_number, carrier_name, transport_mode, shipping_street, shipping_district, shipping_postal_number, order_id
    FROM inserted
END
GO

-- 4. Function: Get total stock of a product across all warehouses
CREATE OR ALTER FUNCTION dbo.GetTotalStock
(
    @product_id INT
)
RETURNS INT
AS
BEGIN
    DECLARE @total INT
    SELECT @total = ISNULL(SUM(stock_quantity), 0)
    FROM dbo.Stores
    WHERE product_id = @product_id
    RETURN @total
END
GO

-- 5. Function: Check stock status of a product
CREATE OR ALTER FUNCTION dbo.CheckStockStatus
(
    @product_id INT
)
RETURNS NVARCHAR(20)
AS
BEGIN
    DECLARE @total INT
    SELECT @total = ISNULL(SUM(stock_quantity), 0)
    FROM dbo.Stores
    WHERE product_id = @product_id

    RETURN CASE
        WHEN @total = 0 THEN 'Out of stock'
        WHEN @total <= 10 THEN 'Almost out of stock'
        ELSE 'In stock'
    END
END
GO

CREATE TRIGGER trg_Stores_Update
ON dbo.Stores
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.Stores
    SET last_updated = GETDATE()
    FROM inserted
    WHERE dbo.Stores.warehouse_id = inserted.warehouse_id
      AND dbo.Stores.product_id = inserted.product_id;
END; 