-- Keep the one-open-shift rule enforceable by MySQL, not only the API.
-- If an older release created duplicate open shifts, retain the most recently
-- created one and close the earlier duplicates at their clock-in time.
UPDATE time_logs AS duplicate_log
JOIN (
  SELECT employee_id, MAX(id) AS keep_id
  FROM time_logs
  WHERE clock_out_time IS NULL
  GROUP BY employee_id
  HAVING COUNT(*) > 1
) AS duplicates ON duplicates.employee_id = duplicate_log.employee_id
SET duplicate_log.clock_out_time = duplicate_log.clock_in_time,
    duplicate_log.hours_worked = 0,
    duplicate_log.status = 'completed'
WHERE duplicate_log.clock_out_time IS NULL
  AND duplicate_log.id <> duplicates.keep_id;

-- MySQL has no partial unique indexes. A generated value is the employee ID
-- only for open shifts, and NULL for completed shifts (which remain repeatable
-- under a UNIQUE index). Each DDL operation is conditional so a retry after
-- an interrupted migration is safe.
SET @migration_schema = DATABASE();

SET @migration_sql = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE `time_logs` ADD COLUMN `open_employee_id` INT UNSIGNED GENERATED ALWAYS AS (CASE WHEN `clock_out_time` IS NULL THEN `employee_id` ELSE NULL END) STORED',
    'SELECT 1')
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @migration_schema
    AND TABLE_NAME = 'time_logs'
    AND COLUMN_NAME = 'open_employee_id'
);
PREPARE migration_statement FROM @migration_sql;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @migration_sql = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE `time_logs` ADD UNIQUE INDEX `time_logs_one_open_shift` (`open_employee_id`)',
    'SELECT 1')
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = @migration_schema
    AND TABLE_NAME = 'time_logs'
    AND INDEX_NAME = 'time_logs_one_open_shift'
);
PREPARE migration_statement FROM @migration_sql;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;
