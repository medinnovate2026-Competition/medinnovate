CREATE TABLE IF NOT EXISTS website_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(100) UNIQUE NOT NULL,
    section_name VARCHAR(255),
    title VARCHAR(255),
    subtitle TEXT,
    visible BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    background_type ENUM(
        'default',
        'light',
        'dark',
        'gradient',
        'transparent'
    ) DEFAULT 'default',
    animation VARCHAR(100),
    custom_css_class VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO website_sections (
    section_key,
    section_name,
    title,
    subtitle,
    visible,
    display_order,
    background_type,
    animation,
    custom_css_class
)
SELECT * FROM (
    SELECT 'hero', 'Hero', 'Medinnovate', 'International Healthcare Innovation Hackathon', TRUE, 1, 'default', 'fade', ''
    UNION ALL SELECT 'about', 'About', 'About MedInnovate', 'A global healthcare innovation platform for student teams.', TRUE, 2, 'light', 'slide-up', ''
    UNION ALL SELECT 'stats', 'Stats', 'Global participation', 'Event highlights and participation metrics.', TRUE, 3, 'default', 'fade', ''
    UNION ALL SELECT 'speakers', 'Speakers', 'Speakers', 'Meet keynote speakers and session leaders.', TRUE, 5, 'default', 'fade', ''
    UNION ALL SELECT 'judges', 'Judges', 'Judges', 'Reviewers, evaluators, and panel members.', TRUE, 6, 'light', 'fade', ''
    UNION ALL SELECT 'sponsors', 'Sponsors', 'Sponsors', 'Partners and supporting organisations.', FALSE, 7, 'default', 'fade', ''
    UNION ALL SELECT 'committee', 'Committee', 'Organising Committee', 'Meet the people coordinating MedInnovate.', TRUE, 8, 'light', 'slide-up', ''
    UNION ALL SELECT 'schedule', 'Schedule', 'Schedule', 'Event timeline and important milestones.', FALSE, 9, 'default', 'fade', ''
    UNION ALL SELECT 'faq', 'FAQ', 'Frequently Asked Questions', 'Answers to common participant questions.', TRUE, 10, 'light', 'fade', ''
    UNION ALL SELECT 'community', 'Community', 'Join the Community', 'Connect with MedInnovate for updates and announcements.', TRUE, 11, 'default', 'slide-up', ''
    UNION ALL SELECT 'footer', 'Footer', 'Footer', '', TRUE, 12, 'default', 'none', ''
    UNION ALL SELECT 'gallery', 'Gallery', 'Gallery', 'Event photos and media highlights.', FALSE, 13, 'default', 'fade', ''
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM website_sections);
