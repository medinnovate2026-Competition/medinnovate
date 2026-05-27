CREATE TABLE IF NOT EXISTS judges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    institution VARCHAR(255),
    speciality VARCHAR(255),
    bio TEXT,
    expertise TEXT,
    photo_url TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    judge_type ENUM('faculty', 'industry', 'research', 'sponsor', 'external') DEFAULT 'faculty',
    featured BOOLEAN DEFAULT FALSE,
    priority INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
