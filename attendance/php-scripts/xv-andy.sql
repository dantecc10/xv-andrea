/*
 Navicat Premium Dump SQL

 Source Server         : XV Andrea
 Source Server Type    : MySQL
 Source Server Version : 101113 (10.11.13-MariaDB-0ubuntu0.24.04.1)
 Source Host           : 74.208.62.188:3306
 Source Schema         : xv-andy

 Target Server Type    : MySQL
 Target Server Version : 101113 (10.11.13-MariaDB-0ubuntu0.24.04.1)
 File Encoding         : 65001

 Date: 22/12/2025 01:40:35
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for guests
-- ----------------------------
DROP TABLE IF EXISTS `guests`;
CREATE TABLE `guests` (
  `id_guest` int(11) NOT NULL,
  `family_guest` varchar(255) DEFAULT NULL,
  `name_guest` varchar(255) DEFAULT NULL,
  `last_names_guest` varchar(255) DEFAULT NULL,
  `assigned_to_table` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_guest`),
  KEY `fk_guest_assigned_to_table` (`assigned_to_table`),
  CONSTRAINT `fk_guest_assigned_to_table` FOREIGN KEY (`assigned_to_table`) REFERENCES `tables` (`id_table`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- ----------------------------
-- Table structure for qr_codes
-- ----------------------------
DROP TABLE IF EXISTS `qr_codes`;
CREATE TABLE `qr_codes` (
  `id_qr_code` int(11) NOT NULL,
  `link_qr_code` text DEFAULT NULL,
  `passes_qr_code` int(11) DEFAULT NULL,
  `assigned_to_guest` int(11) NOT NULL,
  PRIMARY KEY (`id_qr_code`) USING BTREE,
  KEY `fk_qr_code_assigned_to_guest` (`assigned_to_guest`),
  CONSTRAINT `fk_qr_code_assigned_to_guest` FOREIGN KEY (`assigned_to_guest`) REFERENCES `guests` (`id_guest`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- ----------------------------
-- Table structure for tables
-- ----------------------------
DROP TABLE IF EXISTS `tables`;
CREATE TABLE `tables` (
  `id_table` int(11) NOT NULL,
  PRIMARY KEY (`id_table`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

SET FOREIGN_KEY_CHECKS = 1;
