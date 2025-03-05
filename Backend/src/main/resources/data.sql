INSERT INTO clients (id, first_name, username, password, email, phone_number, image_profile, created_user) VALUES
(1, 'John', 'john_doe', 'password123', 'john.doe@example.com', '1234567890', NULL, '2025-02-28'),
(2, 'Jane', 'jane_doe', 'password456', 'jane.doe@example.com', '1234567890', NULL, '2025-02-28');

INSERT INTO artists (id, first_name, username, password, email, phone_number, image_profile, created_user, num_slots_of_work, table_commisions_price) VALUES
(1,'Yellow', 'yellow_doe', 'password789', 'yellow.doe@example.com', '1234567890', NULL, '2025-02-28', 3, NULL);

INSERT INTO categories (id, name, description) VALUES
(1,'Painting', 'Artworks created using paint on a surface'),
(2,'Digital Art', 'Artworks made using digital tools'),
(3,'Sculpture', 'Three-dimensional art made by shaping materials');

INSERT INTO works (id, artist_id, name, description, price) VALUES 
(1, 1, 'Sunset Painting', 'A beautiful sunset painting', 150.0),
(2, 1, 'Ocean Waves', 'A calming ocean scene with waves', 200.0),
(3, 1, 'Starry Night Replica', 'Inspired by Van Gogh’s Starry Night', 300.0),
(4, 1, 'Abstract Art', 'A modern abstract composition', 180.0),
(5, 1, 'Forest Path', 'A peaceful forest pathway', 120.0);

INSERT INTO works_done (id, artist_id, image) VALUES 
(1, 1, NULL),
(2, 1, NULL),
(3, 1, NULL),
(4, 1, NULL);