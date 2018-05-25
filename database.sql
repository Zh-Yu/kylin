/*
 Navicat Premium Data Transfer

 Source Server         : Linode
 Source Server Type    : MySQL
 Source Server Version : 50720
 Source Host           : database.tangzongchao.com
 Source Database       : kylin

 Target Server Type    : MySQL
 Target Server Version : 50720
 File Encoding         : utf-8

 Date: 05/25/2018 22:26:23 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `bizType`
-- ----------------------------
DROP TABLE IF EXISTS `bizType`;
CREATE TABLE `bizType` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '业务类型编号',
  `chineseName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `employees`
-- ----------------------------
DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '员工编号',
  `chineseName` varchar(50) DEFAULT NULL COMMENT '员工中文名',
  `teamId` int(11) DEFAULT NULL COMMENT '所属团队编号',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `performance`
-- ----------------------------
DROP TABLE IF EXISTS `performance`;
CREATE TABLE `performance` (
  `id` int(11) NOT NULL COMMENT '业务量自增号',
  `employeeId` int(11) NOT NULL,
  `bizTypeId` int(11) NOT NULL,
  `value` double(11,0) NOT NULL COMMENT '业务量',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `teams`
-- ----------------------------
DROP TABLE IF EXISTS `teams`;
CREATE TABLE `teams` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '团队编号',
  `chineseName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
