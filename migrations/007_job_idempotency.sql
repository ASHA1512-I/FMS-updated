SET @migration_schema = DATABASE();
SET @migration_sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `jobs` ADD COLUMN `idempotency_key` CHAR(36) NULL AFTER `created_by_id`', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = @migration_schema AND TABLE_NAME = 'jobs' AND COLUMN_NAME = 'idempotency_key');
PREPARE migration_statement FROM @migration_sql; EXECUTE migration_statement; DEALLOCATE PREPARE migration_statement;
SET @migration_sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `jobs` ADD UNIQUE INDEX `jobs_creator_idempotency` (`created_by_id`, `idempotency_key`)', 'SELECT 1') FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = @migration_schema AND TABLE_NAME = 'jobs' AND INDEX_NAME = 'jobs_creator_idempotency');
PREPARE migration_statement FROM @migration_sql; EXECUTE migration_statement; DEALLOCATE PREPARE migration_statement;
