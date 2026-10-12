-- =============================================================
-- Study Garden - Hệ thống khuyến khích tự học qua trò chơi hóa
-- Lược đồ CSDL (MySQL 8 / MariaDB 10.4+ trong XAMPP)
-- Chạy: mở phpMyAdmin > tab SQL > dán file này > Go
-- =============================================================

DROP DATABASE IF EXISTS study_garden;
CREATE DATABASE study_garden CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE study_garden;

-- -------------------------------------------------------------
-- 1. Người dùng
-- -------------------------------------------------------------
CREATE TABLE users (
  id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email              VARCHAR(255) NOT NULL UNIQUE,
  password_hash      VARCHAR(255) NOT NULL,
  display_name       VARCHAR(100) NOT NULL,
  avatar             VARCHAR(255) NULL,
  daily_goal_minutes SMALLINT UNSIGNED NOT NULL DEFAULT 50,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 2. Chỉ số tổng hợp của người dùng (XP, xu, cấp độ, chuỗi ngày)
-- -------------------------------------------------------------
CREATE TABLE user_stats (
  user_id         INT UNSIGNED PRIMARY KEY,
  total_xp        INT UNSIGNED NOT NULL DEFAULT 0,
  level           SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  coins           INT UNSIGNED NOT NULL DEFAULT 0,
  current_streak  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  longest_streak  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  last_study_date DATE NULL,
  total_minutes   INT UNSIGNED NOT NULL DEFAULT 0,
  CONSTRAINT fk_stats_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 3. Mục tiêu học tập
-- -------------------------------------------------------------
CREATE TABLE goals (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        INT UNSIGNED NOT NULL,
  title          VARCHAR(200) NOT NULL,
  description    TEXT NULL,
  target_minutes INT UNSIGNED NOT NULL DEFAULT 0,
  deadline       DATE NULL,
  status         ENUM('active', 'completed', 'archived') NOT NULL DEFAULT 'active',
  completed_at   DATETIME NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_goals_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_goals_user_status (user_id, status)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 4. Nhiệm vụ thuộc mục tiêu
-- -------------------------------------------------------------
CREATE TABLE tasks (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  goal_id             INT UNSIGNED NOT NULL,
  title               VARCHAR(200) NOT NULL,
  estimated_pomodoros TINYINT UNSIGNED NOT NULL DEFAULT 1,
  status              ENUM('todo', 'done') NOT NULL DEFAULT 'todo',
  completed_at        DATETIME NULL,
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_goal FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 5. Phiên học Pomodoro - nguồn dữ liệu của mọi phần thưởng
-- -------------------------------------------------------------
CREATE TABLE study_sessions (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED NOT NULL,
  task_id         INT UNSIGNED NULL,
  planned_minutes TINYINT UNSIGNED NOT NULL DEFAULT 25,
  actual_minutes  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  started_at      DATETIME NOT NULL,
  ended_at        DATETIME NULL,
  status          ENUM('running', 'completed', 'cancelled') NOT NULL DEFAULT 'running',
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_sessions_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
  INDEX idx_sessions_user_started (user_id, started_at)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 6. Nhật ký cộng XP/xu (UNIQUE chống thưởng trùng một nguồn)
-- -------------------------------------------------------------
CREATE TABLE reward_logs (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  source_type ENUM('session', 'task', 'goal', 'streak') NOT NULL,
  source_id   INT UNSIGNED NOT NULL,
  xp          INT NOT NULL DEFAULT 0,
  coins       INT NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rewards_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_reward_source (user_id, source_type, source_id),
  INDEX idx_rewards_user_created (user_id, created_at)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 7. Danh mục vật phẩm cửa hàng
-- -------------------------------------------------------------
CREATE TABLE items (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  description  VARCHAR(255) NULL,
  type         ENUM('food', 'accessory', 'seed') NOT NULL,
  price        INT UNSIGNED NOT NULL,
  effect_value SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  model_key    VARCHAR(50) NOT NULL,
  is_active    TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 8. Thú cưng ảo (mỗi người dùng một con)
-- -------------------------------------------------------------
CREATE TABLE pets (
  id                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id               INT UNSIGNED NOT NULL UNIQUE,
  name                  VARCHAR(50) NOT NULL DEFAULT 'Bé Mầm',
  stage                 ENUM('egg', 'baby', 'teen', 'adult') NOT NULL DEFAULT 'egg',
  satiety               TINYINT UNSIGNED NOT NULL DEFAULT 80,
  mood                  ENUM('happy', 'normal', 'hungry', 'sad') NOT NULL DEFAULT 'normal',
  last_fed_at           DATETIME NULL,
  equipped_accessory_id INT UNSIGNED NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_pets_accessory FOREIGN KEY (equipped_accessory_id) REFERENCES items(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 9. Cây trồng trong khu vườn
-- -------------------------------------------------------------
CREATE TABLE plants (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id          INT UNSIGNED NOT NULL,
  seed_item_id     INT UNSIGNED NOT NULL,
  slot_x           TINYINT UNSIGNED NOT NULL,
  slot_y           TINYINT UNSIGNED NOT NULL,
  stage            ENUM('seed', 'sprout', 'young', 'mature', 'bloom') NOT NULL DEFAULT 'seed',
  watered_sessions SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  is_withered      TINYINT(1) NOT NULL DEFAULT 0,
  planted_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_plants_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_plants_seed FOREIGN KEY (seed_item_id) REFERENCES items(id),
  UNIQUE KEY uq_plant_slot (user_id, slot_x, slot_y)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 10. Túi đồ (vật phẩm người dùng đang sở hữu)
-- -------------------------------------------------------------
CREATE TABLE inventories (
  user_id  INT UNSIGNED NOT NULL,
  item_id  INT UNSIGNED NOT NULL,
  quantity SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, item_id),
  CONSTRAINT fk_inv_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_inv_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 11. Lịch sử mua hàng
-- -------------------------------------------------------------
CREATE TABLE purchases (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  item_id     INT UNSIGNED NOT NULL,
  quantity    SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  total_price INT UNSIGNED NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_purchases_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_purchases_item FOREIGN KEY (item_id) REFERENCES items(id),
  INDEX idx_purchases_user_created (user_id, created_at)
) ENGINE=InnoDB;
