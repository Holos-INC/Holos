INSERT INTO base_user (id, first_name, username, password, email, phone_number, image_profile, created_user) VALUES
(1, 'John', 'john_doe', 'password123', 'john.doe@example.com', '1234567890', 'profile1.jpg', '2025-02-28'),
(2, 'Jane', 'jane_doe', 'password456', 'jane.doe@example.com', '0987654321', 'profile2.jpg', '2025-02-28'),
(3, 'Yellow', 'yellow', 'password', 'yellow.artist@gmail.com', '0987654321', 'profile3.jpg', '2025-02-28');

INSERT INTO clients (id, base_user_id) VALUES
(1, 1),
(2, 2);

INSERT INTO artists (id, base_user_id, num_slots_of_work, table_commisions_price) VALUES
(1, 3, 3,'tabla.jpg');

INSERT INTO categories (id, name, description) VALUES
(1, 'Painting', 'Artworks created using paint on a surface'),
(2, 'Digital Art', 'Artworks made using digital tools'),
(3, 'Sculpture', 'Three-dimensional art made by shaping materials');
