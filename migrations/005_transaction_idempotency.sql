-- A request key is unique only for the staff member who recorded it. Existing
-- historical records remain valid because a UNIQUE index permits multiple NULLs.
-- Each DDL operation is conditional so retrying after an interrupted migration
-- remains safe.
SET @migration_schema = DATABASE();

SET @migration_sql = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE `transactions` ADD COLUMN `idempotency_key` CHAR(36) NULL AFTER `recorded_by_id`',
    'SELECT 1')
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @migration_schema
    AND TABLE_NAME = 'transactions'
    AND COLUMN_NAME = 'idempotency_key'
);
PREPARE migration_statement FROM @migration_sql;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @migration_sql = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE `transactions` ADD UNIQUE INDEX `transactions_recording_idempotency` (`recorded_by_id`, `idempotency_key`)',
    'SELECT 1')
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = @migration_schema
    AND TABLE_NAME = 'transactions'
    AND INDEX_NAME = 'transactions_recording_idempotency'
);
PREPARE migration_statement FROM @migration_sql;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;
