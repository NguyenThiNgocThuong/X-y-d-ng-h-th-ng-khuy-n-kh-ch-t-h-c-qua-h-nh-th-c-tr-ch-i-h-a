-- =============================================================
-- Dữ liệu danh mục ban đầu: vật phẩm cửa hàng
-- Chạy SAU schema.sql. Tài khoản demo tạo bằng: cd server && npm run seed:demo
-- =============================================================

USE study_garden;

INSERT INTO items (name, description, type, price, effect_value, model_key) VALUES
-- Thức ăn: effect_value = số điểm độ no được cộng
('Bánh quy hạt',    'Món ăn vặt, +30 độ no',              'food',      15, 30, 'food_cookie'),
('Táo đỏ',          'Trái cây tươi, +20 độ no',           'food',      10, 20, 'food_apple'),
('Bữa tiệc lớn',    'No căng bụng, +60 độ no',            'food',      35, 60, 'food_feast'),
-- Phụ kiện cho thú cưng
('Mũ len',          'Mũ len ấm áp cho thú cưng',          'accessory', 60,  0, 'acc_beanie'),
('Nơ đỏ',           'Chiếc nơ xinh xắn',                  'accessory', 40,  0, 'acc_bow'),
('Kính tròn',       'Trông thật thông thái',              'accessory', 80,  0, 'acc_glasses'),
-- Hạt giống để trồng trong vườn
('Hạt hướng dương', 'Cây cao, ra hoa vàng',               'seed',      20,  0, 'seed_sunflower'),
('Hạt tulip',       'Hoa tulip nhiều màu',                'seed',      25,  0, 'seed_tulip'),
('Hạt xương rồng',  'Dễ sống, chịu được khô hạn',         'seed',      30,  0, 'seed_cactus');
