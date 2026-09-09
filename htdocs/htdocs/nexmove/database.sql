-- ============================================================
-- NEXmove Physio Database
-- MariaDB / MySQL / phpMyAdmin compatible version
-- ============================================================

SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- Table: services
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `services` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `short_description` TEXT NULL,
    `duration_minutes` SMALLINT UNSIGNED NOT NULL,
    `appointment_type` VARCHAR(100) NOT NULL,
    `price_pence` INT UNSIGNED NOT NULL,
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_services_slug` (`slug`),
    KEY `idx_services_active_sort` (`active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: conditions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `conditions` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(100) NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    `sort_order` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_conditions_slug` (`slug`),
    KEY `idx_conditions_active_sort` (`active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: therapists
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `therapists` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `display_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    KEY `idx_therapists_active` (`active`),
    KEY `idx_therapists_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: bookings
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bookings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `booking_ref` VARCHAR(50) NOT NULL,
    `service_id` INT UNSIGNED NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) NOT NULL,
    `date_of_birth` DATE NOT NULL,
    `postcode` VARCHAR(20) NOT NULL,
    `address_line1` VARCHAR(255) NOT NULL,
    `city` VARCHAR(120) NOT NULL,
    `access_details` TEXT NULL,
    `condition_id` INT UNSIGNED NULL,
    `issue_duration` VARCHAR(100) NULL,
    `pain_level` TINYINT UNSIGNED NULL,
    `symptoms` TEXT NULL,
    `mobility_aid` TINYINT(1) NOT NULL DEFAULT 0,
    `fall_risk` TINYINT(1) NOT NULL DEFAULT 0,
    `preferred_date` DATE NOT NULL,
    `preferred_time` TIME NOT NULL,
    `therapist_id` INT UNSIGNED NULL,
    `consent_privacy` TINYINT(1) NOT NULL DEFAULT 0,
    `consent_updates` TINYINT(1) NOT NULL DEFAULT 0,
    `status` ENUM('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_bookings_booking_ref` (`booking_ref`),
    KEY `idx_bookings_date` (`preferred_date`),
    KEY `idx_bookings_email` (`email`),
    KEY `idx_bookings_service` (`service_id`),
    KEY `idx_bookings_condition` (`condition_id`),
    KEY `idx_bookings_therapist` (`therapist_id`),
    KEY `idx_bookings_status` (`status`),
    CONSTRAINT `fk_bookings_service`
        FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT `fk_bookings_condition`
        FOREIGN KEY (`condition_id`) REFERENCES `conditions` (`id`)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT `fk_bookings_therapist`
        FOREIGN KEY (`therapist_id`) REFERENCES `therapists` (`id`)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT `chk_bookings_pain_level`
        CHECK (`pain_level` IS NULL OR `pain_level` BETWEEN 0 AND 10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Starter service data
-- ------------------------------------------------------------
INSERT IGNORE INTO `services`
(`id`, `slug`, `name`, `short_description`, `duration_minutes`, `appointment_type`, `price_pence`, `active`, `sort_order`)
VALUES
(1, 'home-visit', 'Initial Home Physiotherapy Assessment', 'We come to you', 60, 'Home Visit', 11000, 1, 1),
(2, 'online', 'Online Consultation', 'Video call session', 45, 'Online Consultation', 7500, 1, 2),
(3, 'follow-up', 'Follow-up Session', 'Existing patients', 45, 'Home Visit', 8500, 1, 3);

-- ------------------------------------------------------------
-- Starter condition data
-- ------------------------------------------------------------
INSERT IGNORE INTO `conditions`
(`id`, `slug`, `label`, `active`, `sort_order`)
VALUES
(1, 'back-pain', 'Back Pain', 1, 1),
(2, 'neck-pain', 'Neck Pain', 1, 2),
(3, 'knee-pain', 'Knee Pain', 1, 3),
(4, 'shoulder-pain', 'Shoulder Pain', 1, 4),
(5, 'mobility', 'Mobility', 1, 5),
(6, 'post-op', 'Post-Op Rehab', 1, 6),
(7, 'neurology', 'Neurology', 1, 7),
(8, 'elderly-care', 'Elderly Care', 1, 8),
(9, 'other', 'Other', 1, 9);

-- ------------------------------------------------------------
-- Starter therapist data
-- ------------------------------------------------------------
INSERT IGNORE INTO `therapists`
(`id`, `display_name`, `email`, `active`)
VALUES
(1, 'Any available physiotherapist', NULL, 1);

-- Make sure AUTO_INCREMENT continues after starter records
ALTER TABLE `services` AUTO_INCREMENT = 4;
ALTER TABLE `conditions` AUTO_INCREMENT = 10;
ALTER TABLE `therapists` AUTO_INCREMENT = 2;

SET FOREIGN_KEY_CHECKS = 1;
