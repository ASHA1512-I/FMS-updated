ALTER TABLE users
  DROP COLUMN security_question,
  DROP COLUMN security_answer,
  ADD COLUMN session_version INT UNSIGNED NOT NULL DEFAULT 1 AFTER password;
