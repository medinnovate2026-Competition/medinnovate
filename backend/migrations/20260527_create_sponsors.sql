CREATE TABLE IF NOT EXISTS sponsors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tier ENUM('title', 'platinum', 'gold', 'silver', 'bronze', 'community', 'exhibitor', 'support') DEFAULT 'support',
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    instagram_url TEXT,
    linkedin_url TEXT,
    booth_number VARCHAR(100),
    session_enabled BOOLEAN DEFAULT FALSE,
    session_title VARCHAR(255),
    session_description TEXT,
    display_order INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
