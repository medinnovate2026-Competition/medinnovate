USE defaultdb;

DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS teams;

CREATE TABLE teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_name VARCHAR(100) NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50),
  transaction_ref VARCHAR(100),
  referral_code VARCHAR(100),
  team_size INT,
  price_per_person DECIMAL(10,2),
  total_paid DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  college VARCHAR(150),
  country VARCHAR(100),
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);
