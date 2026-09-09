CREATE TABLE IF NOT EXISTS `admin_users` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(190) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    `last_login_at` DATETIME NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_admin_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admin_users` (`full_name`,`email`,`password_hash`,`active`)
SELECT 'NEXmove Administrator','admin@nexmove.local','$2y$12$yDCsMEqF05qZjV980h/E5euGdNxkXOx4D1LrXlr44YL2RMNjSUcl2',1
WHERE NOT EXISTS (SELECT 1 FROM `admin_users` WHERE `email`='admin@nexmove.local');
