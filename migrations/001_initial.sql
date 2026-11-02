CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'accountant', 'worker') NOT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NULL UNIQUE,
  phone VARCHAR(40) NULL,
  security_question VARCHAR(255) NULL,
  security_answer VARCHAR(255) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  assignee_id INT UNSIGNED NULL,
  due_date DATE NULL,
  status ENUM('open', 'done') NOT NULL DEFAULT 'open',
  priority ENUM('low', 'medium', 'high') NOT NULL,
  created_by_id INT UNSIGNED NOT NULL,
  completed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by_id) REFERENCES users(id),
  INDEX jobs_assignee_status (assignee_id, status),
  INDEX jobs_created_at (created_at)
);

CREATE TABLE animals (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tag VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(100) NOT NULL,
  breed VARCHAR(100) NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'healthy',
  weight_kg DECIMAL(8,2) NULL,
  location VARCHAR(150) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE time_logs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id INT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  clock_in_time DATETIME NOT NULL,
  clock_out_time DATETIME NULL,
  hours_worked DECIMAL(6,2) NULL,
  status ENUM('in_progress', 'completed') NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES users(id),
  INDEX time_logs_employee_date (employee_id, date)
);

CREATE TABLE transactions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  transaction_date DATE NOT NULL,
  description VARCHAR(255) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  recorded_by_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recorded_by_id) REFERENCES users(id),
  INDEX transactions_date (transaction_date)
);

CREATE TABLE audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE staff (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL UNIQUE,
  department VARCHAR(100) NULL,
  employment_status ENUM('active', 'on_leave', 'inactive') NOT NULL DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE chat_channels (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  channel_name VARCHAR(100) NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE chat_messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  channel_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  message_text VARCHAR(2000) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (channel_id) REFERENCES chat_channels(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX chat_messages_channel_created (channel_id, created_at)
);
