-- Optimized table structure for table `users`
CREATE TABLE `users` (
  `user_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `profile_img` varchar(255) DEFAULT 'profile-image.png',
  `gender` ENUM('male', 'female', 'other') NOT NULL,
  `profile_desc` varchar(255) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `idx_unique_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `users`
INSERT INTO `users` (`user_id`, `username`, `email`, `pass`, `first_name`, `last_name`, `profile_img`, `gender`, `profile_desc`, `created_at`) 
VALUES (13, 'atharvandure', 'atharvandure812@gmail.com', '$2y$10$reWXOE38qfANbmG4c1JiuuNkFToUprdBUI57hC.CP2vV2kceKP4HW', 'atharv', 'andure', 'img_6a6b32fbb99f21.17155345.jpeg', 'male', 'hey', '2026-07-30 11:07:55');

CREATE TABLE `Group` (
  `groupId` char(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  `groupName` varchar(50) NOT NULL,
  `deletedAt` timestamp,
  `createdAt` timestamp DEFAULT (now())
);

CREATE TABLE `GroupMember` (
  `groupId` char(36) CHARACTER SET ascii COLLATE ascii_bin,
  `userId` bigint(20) UNSIGNED NOT NULL,
  `role` varchar(10) DEFAULT 'member',
  `joinedAt` timestamp DEFAULT (now()),
  PRIMARY KEY (`groupId`, `userId`)
);

CREATE TABLE `Message` (
  `messageId` char(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY COMMENT 'MUST be UUIDv7 or ULID',
  `senderId` bigint(20) UNSIGNED NOT NULL,
  `receiverUserId` bigint(20) UNSIGNED,
  `groupId` char(36) CHARACTER SET ascii COLLATE ascii_bin,
  `content` varchar(1000),
  `messageType` varchar(10) DEFAULT 'text' COMMENT 'text, image, file',
  `mediaUrl` varchar(255),
  `status` varchar(10) DEFAULT 'sent' COMMENT 'sent, delivered, read',
  `deletedAt` timestamp COMMENT 'For unsending messages',
  `createdAt` timestamp DEFAULT (now())
);

CREATE TABLE `Connection` (
  `connectionId` char(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  `senderId` bigint(20) UNSIGNED NOT NULL,
  `receiverId` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(20) DEFAULT 'pending' COMMENT 'pending, accepted, blocked',
  `createdAt` timestamp DEFAULT (now())
);

CREATE INDEX `idx_user_groups` ON `GroupMember` (`userId`);
CREATE INDEX `idx_direct_chat_history` ON `Message` (`receiverUserId`, `createdAt`);
CREATE INDEX `idx_group_chat_history` ON `Message` (`groupId`, `createdAt`);
CREATE UNIQUE INDEX `uq_connection` ON `Connection` (`senderId`, `receiverId`);
CREATE INDEX `idx_pending_requests` ON `Connection` (`receiverId`);

ALTER TABLE `Message` ADD FOREIGN KEY (`senderId`) REFERENCES `users` (`user_id`);
ALTER TABLE `Message` ADD FOREIGN KEY (`receiverUserId`) REFERENCES `users` (`user_id`);
ALTER TABLE `Message` ADD FOREIGN KEY (`groupId`) REFERENCES `Group` (`groupId`);

ALTER TABLE `GroupMember` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`user_id`);
ALTER TABLE `GroupMember` ADD FOREIGN KEY (`groupId`) REFERENCES `Group` (`groupId`);

ALTER TABLE `Connection` ADD FOREIGN KEY (`senderId`) REFERENCES `users` (`user_id`);
ALTER TABLE `Connection` ADD FOREIGN KEY (`receiverId`) REFERENCES `users` (`user_id`);