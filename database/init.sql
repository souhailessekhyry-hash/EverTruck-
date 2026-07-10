-- ====================================================================
-- EverTruck Logistics - MySQL Database Initialization Script
-- ====================================================================
-- This script is executed automatically by the mysql container on first start
-- when mounted into /docker-entrypoint-initdb.d/init.sql.

-- Set default timezone to UTC
SET GLOBAL time_zone = '+00:00';

-- Ensure database uses utf8mb4 collation for full Unicode support (including emojis)
ALTER DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Log successful initialization
SELECT 'EverTruck MySQL database initialized successfully with utf8mb4 collation.' AS message;
