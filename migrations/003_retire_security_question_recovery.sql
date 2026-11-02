-- Make each schema change resumable: MySQL DDL auto-commits, so a retry after
-- an interrupted migration must tolerate any earlier change already applied.
SET @migration_schema = DATABASE();

SET @migration_sql = (
  SELECT IF(COUNT(*) > 0,
    'ALTER TABLE `users` DROP COLUMN `security_question`',
    'SELECT 1')
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @migration_schema
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'security_question'
);
PREPARE migration_statement FROM @migration_sql;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @migration_sql = (
  SELECT IF(COUNT(*) > 0,
    'ALTER TABLE `users` DROP COLUMN `security_answer`',
    'SELECT 1')
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @migration_schema
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'security_answer'
);
PREPARE migration_statement FROM @migration_sql;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @migration_sql = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE `users` ADD COLUMN `session_version` INT UNSIGNED NOT NULL DEFAULT 1 AFTER `password`',
    'SELECT 1')
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @migration_schema
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'session_version'
);
PREPARE migration_statement FROM @migration_sql;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;
