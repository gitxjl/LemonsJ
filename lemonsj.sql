/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50553
 Source Host           : localhost:3306
 Source Schema         : lemonsj

 Target Server Type    : MySQL
 Target Server Version : 50553
 File Encoding         : 65001

 Date: 23/11/2020 16:57:50
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for doc
-- ----------------------------
DROP TABLE IF EXISTS `doc`;
CREATE TABLE `doc`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `iid` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '项目ID',
  `pid` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '所属/层级/目录级别',
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '项目名称',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '内容',
  `tdl` tinyint(3) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否模板 0：否； 1：是',
  `type` tinyint(2) NULL DEFAULT 0 COMMENT '文档类型：0：富文本；1：表格文档；2：markdown；3：curl; 4 : postman ; 5 :swagger ; 6 : openApi; 7 : yaml; 8 : har 1.2',
  `sort` tinyint(4) NULL DEFAULT 0 COMMENT '排序',
  `form` tinyint(2) NULL DEFAULT 0 COMMENT '文档构成： 0：普通文档，1：目录',
  `source` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '源文件',
  `param` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '预留参数',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '文档表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of doc
-- ----------------------------
INSERT INTO `doc` VALUES (1, 1, 0, 'README', '%23+LemonsJ%0D%0ALemonsJ%EF%BC%88%E6%9F%A0%E6%AA%AC%E7%B2%BE%EF%BC%89-+API%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3%E5%B7%A5%E5%85%B7%EF%BC%8C%E6%94%AF%E6%8C%81Postman%E3%80%81Swagger%E4%B8%8A%E4%BC%A0%3C%2Fp%3E%0D%0A%0D%0A%23%23+%E5%8A%9F%E8%83%BD%E5%9B%BE%E4%BE%8B%E4%BB%8B%E7%BB%8D%EF%BC%9A%0D%0A%3Ccenter%3E%0D%0A%3Ccenter%3E%E6%96%B0%E5%A2%9E%E5%8A%9F%E8%83%BD-%E5%88%97%E8%A1%A8%3C%2Fcenter%3E%0D%0A%3Cimg+alt%3D%22%22+height%3D%22475%22+src%3D%22https%3A%2F%2Foscimg.oschina.net%2Foscnet%2Fup-4e60bf94cb7ca44ab483f2f1d8a16ad2e29.JPEG%22+width%3D%22661%22+%2F%3E%3Cbr%3E%0D%0A%3Ccenter%3E%E7%99%BB%E5%BD%95-%E9%BB%98%E8%AE%A4%E8%B4%A6%E6%88%B7%3C%2Fcenter%3E%0D%0A%3Cimg+alt%3D%22%22+height%3D%22586%22+src%3D%22https%3A%2F%2Foscimg.oschina.net%2Foscnet%2Fup-0abd2acf95ecaa881c7c8d2ab59e5c09e66.JPEG%22+width%3D%221107%22+%2F%3E%3Cbr%3E%0D%0A%3Ccenter%3E%E5%AF%BC%E5%85%A5%E5%8A%9F%E8%83%BD-%E5%BD%93%E5%89%8D%E4%BB%85%E6%94%AF%E6%8C%81Postman%E5%92%8CSwagger+2%3C%2Fcenter%3E%0D%0A%3Cimg+alt%3D%22%22+height%3D%22475%22+src%3D%22https%3A%2F%2Foscimg.oschina.net%2Foscnet%2Fup-ee07488fbf1204e017c13a342d06dc187a1.JPEG%22+width%3D%22605%22+%2F%3E%3Cbr%3E%0D%0A%3Ccenter%3E%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86-%E5%8A%9F%E8%83%BD%E5%88%97%E8%A1%A8%3C%2Fcenter%3E%0D%0A%3Cimg+alt%3D%22%22+height%3D%22548%22+src%3D%22https%3A%2F%2Foscimg.oschina.net%2Foscnet%2Fup-96f433dd77de7e4daedae081baa2daf0d04.JPEG%22+width%3D%22585%22+%2F%3E%3Cbr%3E%0D%0A%3Ccenter%3E%E6%96%B0%E5%A2%9E%E5%8A%9F%E8%83%BD-%E8%A1%A8%E6%A0%BC%E6%96%87%E6%A1%A3%3C%2Fcenter%3E%0D%0A%3Cimg+alt%3D%22%22+height%3D%22895%22+src%3D%22https%3A%2F%2Foscimg.oschina.net%2Foscnet%2Fup-58671bf5be4487303bd11f665fdc965734c.JPEG%22+width%3D%221865%22+%2F%3E%3Cbr%3E%0D%0A%3Ccenter%3E%E6%96%B0%E5%A2%9E%E5%8A%9F%E8%83%BD-Markdown%E6%96%87%E6%A1%A3%3C%2Fcenter%3E%0D%0A%3Cimg+alt%3D%22%22+height%3D%22925%22+src%3D%22https%3A%2F%2Foscimg.oschina.net%2Foscnet%2Fup-82aac6ad61bf567ef3048e026739d96eb89.JPEG%22+width%3D%221847%22+%2F%3E%3Cbr%3E%0D%0A%3Ccenter%3E%E6%96%B0%E5%A2%9E%E5%8A%9F%E8%83%BD-Html%E6%96%87%E6%A1%A3%3C%2Fcenter%3E%0D%0A%3Cimg+alt%3D%22%22+height%3D%22690%22+src%3D%22https%3A%2F%2Foscimg.oschina.net%2Foscnet%2Fup-b5f2c84e2ba108e5e5a2ca0bba72e41ba52.JPEG%22+width%3D%221909%22+%2F%3E%3Cbr%3E%0D%0A%3Ccenter%3E%E6%96%B0%E5%A2%9E%E5%8A%9F%E8%83%BD-Curl%E6%96%87%E6%A1%A3%3C%2Fcenter%3E%0D%0A%3Cimg+alt%3D%22%22+src%3D%22https%3A%2F%2Foscimg.oschina.net%2Foscnet%2Fup-90878fcc83d71eb280ca5ff63dc4daedceb.JPEG%22+%2F%3E%3Cbr%3E%0D%0A%3Ccenter%3E%E6%96%B0%E5%A2%9E%E5%8A%9F%E8%83%BD-%E6%96%87%E6%A1%A3-%E4%BF%9D%E5%AD%98%3C%2Fcenter%3E%0D%0A%3Cimg+alt%3D%22%22+height%3D%22267%22+src%3D%22https%3A%2F%2Foscimg.oschina.net%2Foscnet%2Fup-39036f37575e2ccda5951f52753558a12ad.JPEG%22+width%3D%22183%22+%2F%3E%3Cbr%3E%0D%0A%3Ccenter%3E%E6%96%B0%E5%A2%9E%E5%8A%9F%E8%83%BD-%E6%96%B0%E5%A2%9E%E9%A1%B9%E7%9B%AE%3C%2Fcenter%3E%0D%0A%3Cimg+alt%3D%22%22+height%3D%22288%22+src%3D%22https%3A%2F%2Foscimg.oschina.net%2Foscnet%2Fup-e2dcbde519d8e12a95623c18b95d66e8092.JPEG%22+width%3D%22467%22+%2F%3E%3Cbr%3E%0D%0A%3Ccenter%3E%E6%96%B0%E5%A2%9E%E7%9B%AE%E5%BD%95-%E5%BC%B9%E7%AA%97%3C%2Fcenter%3E%0D%0A%3Cimg+alt%3D%22%22+height%3D%22273%22+src%3D%22https%3A%2F%2Foscimg.oschina.net%2Foscnet%2Fup-6d348545fbe3931f064af68373c698be23e.JPEG%22+width%3D%22476%22+%2F%3E%3Cbr%3E%0D%0A%3Ccenter%3E%E5%AF%BC%E5%85%A5%E5%BC%B9%E7%AA%97%3C%2Fcenter%3E%0D%0A%3Cimg+alt%3D%22%22+height%3D%22441%22+src%3D%22https%3A%2F%2Foscimg.oschina.net%2Foscnet%2Fup-ea82407576ed1be2beb2fd7739171c6150d.JPEG%22+width%3D%22512%22+%2F%3E%3Cbr%3E%0D%0A%3Ccenter%3E%E6%89%80%E6%9C%89%E9%A1%B9%E7%9B%AE%3C%2Fcenter%3E%0D%0A%3Cimg+alt%3D%22%22+height%3D%22386%22+src%3D%22https%3A%2F%2Foscimg.oschina.net%2Foscnet%2Fup-f638a54a29b1f9e75f7348d0facd814e31b.JPEG%22+width%3D%22977%22+%2F%3E%3C%2Fcenter%3E', 0, 2, 0, 0, NULL, NULL, NULL, '2020-11-22 21:31:49', '2020-11-22 22:11:57');

-- ----------------------------
-- Table structure for friend
-- ----------------------------
DROP TABLE IF EXISTS `friend`;
CREATE TABLE `friend`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `fid` int(11) NOT NULL COMMENT '好友ID',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_tid_uid`(`fid`, `uid`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户好友关联表' ROW_FORMAT = Fixed;

-- ----------------------------
-- Records of friend
-- ----------------------------

-- ----------------------------
-- Table structure for items
-- ----------------------------
DROP TABLE IF EXISTS `items`;
CREATE TABLE `items`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uid` int(10) UNSIGNED NOT NULL DEFAULT 0 COMMENT '所属用户ID',
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '项目名',
  `info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '信息/描述',
  `open` tinyint(3) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否公开 0：否；1：是',
  `source` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '源文件',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '项目地址',
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '项目路径',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '项目表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of items
-- ----------------------------
INSERT INTO `items` VALUES (1, 0, 'LemonsJ', NULL, 0, NULL, '', '', NULL, '2020-11-22 21:29:37', '2020-11-22 21:29:37');

-- ----------------------------
-- Table structure for items_users
-- ----------------------------
DROP TABLE IF EXISTS `items_users`;
CREATE TABLE `items_users`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `iid` int(11) NULL DEFAULT NULL COMMENT '项目id',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `tid` int(11) UNSIGNED NOT NULL DEFAULT 0 COMMENT '团队ID',
  `permission` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '权限 0：创建人； 1：默认；2：只读；5：删除；6：退出；7：退出(主动)；',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique`(`iid`, `uid`, `tid`, `permission`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '项目-用户权限表' ROW_FORMAT = Fixed;

-- ----------------------------
-- Records of items_users
-- ----------------------------
INSERT INTO `items_users` VALUES (1, 1, 1, 0, 0);

-- ----------------------------
-- Table structure for migrations
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of migrations
-- ----------------------------
INSERT INTO `migrations` VALUES (1, '2020_06_17_154528_create_users_table', 1);

-- ----------------------------
-- Table structure for teams
-- ----------------------------
DROP TABLE IF EXISTS `teams`;
CREATE TABLE `teams`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '所属用户ID',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '团队名称',
  `u_num` int(4) NOT NULL COMMENT '成员数',
  `i_num` int(4) NOT NULL COMMENT '项目数',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '团队表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of teams
-- ----------------------------

-- ----------------------------
-- Table structure for teams_users
-- ----------------------------
DROP TABLE IF EXISTS `teams_users`;
CREATE TABLE `teams_users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tid` int(11) NOT NULL COMMENT '团队ID',
  `uid` int(11) NOT NULL COMMENT '用户/成员ID',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_tid_uid`(`tid`, `uid`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '团队用户关联表' ROW_FORMAT = Fixed;

-- ----------------------------
-- Records of teams_users
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头像',
  `verification` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '验证令牌 ',
  `verified` tinyint(1) NULL DEFAULT 0 COMMENT '验证状态 0：未验证；1：已验证；2：修改邮箱',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'guest', '$2y$10$1HbSmxXNB0ULh1/cBzclpOKcoSM3eTOflX2/.HSMK6pPu/cEzd/su', 'guest@guest.com', 'assets/face/6.jpg', NULL, 0, '2020-06-18 08:04:03', '2020-06-20 15:34:45');
INSERT INTO `users` VALUES (3, 'test2', '$10$rHzCOgg.hvpIP.FM3fXQ4uelC1EsvDJpIfEsrdWTNFQuUaV6JX7E.', '11sssss1@qq.com', NULL, NULL, 0, '2020-06-27 22:27:55', '2020-06-27 22:27:55');
INSERT INTO `users` VALUES (9, 'test3', '$2y$10$rHzCOgg.hvpIP.FM3fXQ4uelC1EsvDJpIfEsrdWTNFQuUaV6JX7E.', 'admin@admin.com', NULL, NULL, 0, '2020-07-10 10:57:01', '2020-07-10 10:57:01');
INSERT INTO `users` VALUES (10, 'test4', '$2y$10$rHzCOgg.hvpIP.FM3fXQ4uelC1EsvDJpIfEsrdWTNFQuUaV6JX7E.', 'admin4@admin.com', NULL, NULL, 0, '2020-07-10 11:00:33', '2020-07-10 11:00:33');
INSERT INTO `users` VALUES (12, 'guest3', '$2y$10$1HbSmxXNB0ULh1/cBzclpOKcoSM3eTOflX2/.HSMK6pPu/cEzd/su', '1115678894@qq.com', 'assets/face/6.jpg', 'c1df0b-A9FBED31-6F4F-00C9-137F-06D75946ABE5', 0, '2020-07-27 05:00:39', '2020-10-29 23:45:21');
INSERT INTO `users` VALUES (13, 'guest1', '$2y$10$MmyCC2GHxJrUzQse/vNpr.OSzj4wfTrc5olgbBXmzJRzADBX8WoFi', 'guest1@guest.com', NULL, NULL, 0, '2020-08-02 18:46:55', '2020-08-02 18:46:55');
INSERT INTO `users` VALUES (14, 'guest2', '$2y$10$UfO.waXE2a7zQll8DsxI5Od/EF7igH.5P70Z1pTD/s8Arozpb2Nri', 'guest2@guest.com', 'assets/face/5.jpg', NULL, 0, '2020-08-02 18:49:12', '2020-10-21 18:04:00');

-- ----------------------------
-- Table structure for users_info
-- ----------------------------
DROP TABLE IF EXISTS `users_info`;
CREATE TABLE `users_info`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `verification_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '验证令牌 ',
  `verified` tinyint(1) NOT NULL DEFAULT 0 COMMENT '验证状态 0：未验证；1：已验证',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型 0：账号初始验证；1：已验证；2：修改邮箱',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users_info
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
