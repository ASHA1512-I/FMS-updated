-- Supports the locked latest-weigh-in lookup used to preserve each animal's
-- current weight when older history is added later.
SET @migration_schema = DATABASE();
SET @migration_sql = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE `weigh_ins` ADD INDEX `weigh_ins_animal_measured_at` (`animal_id`, `measured_at`)',
    'SELECT 1')
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = @migration_schema
    AND TABLE_NAME = 'weigh_ins'
    AND INDEX_NAME = 'weigh_ins_animal_measured_at'
);
PREPARE migration_statement FROM @migration_sql;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;
