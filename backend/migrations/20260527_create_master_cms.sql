CREATE TABLE IF NOT EXISTS master_cms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value LONGTEXT,
    setting_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO master_cms (setting_key, setting_value, setting_type)
SELECT * FROM (
    SELECT 'homepage_sections', '[]', 'json'
    UNION ALL SELECT 'site_theme', '{"mode":"default","primary_color":"#7C3AED","accent_color":"#EC4899","button_style":"rounded","animation_intensity":"normal"}', 'json'
    UNION ALL SELECT 'maintenance_mode', 'false', 'boolean'
    UNION ALL SELECT 'maintenance_message', 'MedInnovate is currently under maintenance. Please check back soon.', 'text'
    UNION ALL SELECT 'announcement_enabled', 'false', 'boolean'
    UNION ALL SELECT 'announcement_text', 'Registrations Open', 'text'
    UNION ALL SELECT 'countdown_enabled', 'false', 'boolean'
    UNION ALL SELECT 'countdown_date', '', 'text'
    UNION ALL SELECT 'registration_banner_enabled', 'false', 'boolean'
    UNION ALL SELECT 'registration_banner_text', 'Early Bird Open', 'text'
    UNION ALL SELECT 'popup_enabled', 'false', 'boolean'
    UNION ALL SELECT 'popup_title', 'Registrations Open', 'text'
    UNION ALL SELECT 'popup_content', 'Register your team and start building for public health.', 'text'
    UNION ALL SELECT 'schedule_enabled', 'false', 'boolean'
    UNION ALL SELECT 'gallery_enabled', 'false', 'boolean'
    UNION ALL SELECT 'sponsors_enabled', 'false', 'boolean'
    UNION ALL SELECT 'judges_enabled', 'true', 'boolean'
    UNION ALL SELECT 'speakers_enabled', 'true', 'boolean'
    UNION ALL SELECT 'committee_enabled', 'true', 'boolean'
    UNION ALL SELECT 'faq_enabled', 'true', 'boolean'
    UNION ALL SELECT 'community_enabled', 'true', 'boolean'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM master_cms);
