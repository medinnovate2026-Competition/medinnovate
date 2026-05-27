DELETE FROM website_sections WHERE section_key = 'competition';

DELETE FROM master_cms WHERE setting_key = 'competition_enabled';

DROP TABLE IF EXISTS competition_tracks;
