CREATE TABLE `blog_categories` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100),
	`description` text,
	CONSTRAINT `blog_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`title` varchar(300) NOT NULL,
	`slug` varchar(300),
	`excerpt` text,
	`content` text NOT NULL,
	`cover_image` varchar(500),
	`category_id` bigint,
	`author_id` bigint,
	`published` boolean DEFAULT false,
	`featured` boolean DEFAULT false,
	`view_count` int DEFAULT 0,
	`published_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(50),
	`subject` varchar(200),
	`message` text NOT NULL,
	`status` varchar(50) DEFAULT 'new',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `drivers` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`license_number` varchar(100),
	`license_type` varchar(50),
	`phone` varchar(50),
	`email` varchar(255),
	`status` varchar(50) DEFAULT 'active',
	`avatar` varchar(500),
	`rating` decimal(3,2) DEFAULT '5.00',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `drivers_id` PRIMARY KEY(`id`),
	CONSTRAINT `drivers_license_number_unique` UNIQUE(`license_number`)
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`category` varchar(100),
	`sort_order` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	CONSTRAINT `faqs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`invoice_number` varchar(100),
	`shipment_id` bigint,
	`user_id` bigint,
	`amount` decimal(12,2) NOT NULL,
	`tax` decimal(12,2) DEFAULT '0',
	`total` decimal(12,2) NOT NULL,
	`status` varchar(50) DEFAULT 'draft',
	`due_date` date,
	`paid_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoice_number_unique` UNIQUE(`invoice_number`)
);
--> statement-breakpoint
CREATE TABLE `media_library` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`filename` varchar(500) NOT NULL,
	`original_name` varchar(500),
	`mime_type` varchar(100),
	`size` bigint,
	`url` varchar(1000) NOT NULL,
	`folder` varchar(200) DEFAULT 'uploads',
	`uploaded_by` bigint,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `media_library_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` bigint,
	`title` varchar(300) NOT NULL,
	`message` text,
	`type` varchar(50) DEFAULT 'info',
	`read` boolean DEFAULT false,
	`link` varchar(500),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`logo` varchar(500),
	`website` varchar(300),
	`tier` varchar(50) DEFAULT 'silver',
	`is_active` boolean DEFAULT true,
	CONSTRAINT `partners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quote_requests` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(50),
	`company` varchar(200),
	`origin` varchar(300),
	`destination` varchar(300),
	`cargo_type` varchar(100),
	`weight` decimal(10,2),
	`dimensions` varchar(100),
	`message` text,
	`status` varchar(50) DEFAULT 'new',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `quote_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`key` varchar(200) NOT NULL,
	`value` text,
	`type` varchar(50) DEFAULT 'string',
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `shipments` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`tracking_number` varchar(100) NOT NULL,
	`user_id` bigint,
	`origin` varchar(300) NOT NULL,
	`destination` varchar(300) NOT NULL,
	`weight` decimal(10,2),
	`dimensions` varchar(100),
	`status` varchar(50) DEFAULT 'pending',
	`priority` varchar(50) DEFAULT 'normal',
	`estimated_delivery` date,
	`actual_delivery` date,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `shipments_id` PRIMARY KEY(`id`),
	CONSTRAINT `shipments_tracking_number_unique` UNIQUE(`tracking_number`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`company` varchar(200),
	`role` varchar(100),
	`content` text NOT NULL,
	`rating` int DEFAULT 5,
	`avatar` varchar(500),
	`featured` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tracking` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`shipment_id` bigint,
	`location` varchar(300) NOT NULL,
	`status` varchar(100) NOT NULL,
	`description` text,
	`timestamp` timestamp DEFAULT (now()),
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	CONSTRAINT `tracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`unionId` varchar(255),
	`name` varchar(255),
	`email` varchar(320),
	`avatar` text,
	`role` varchar(50) NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	`lastSignInAt` timestamp NOT NULL DEFAULT (now()),
	`password_hash` varchar(255),
	`first_name` varchar(100),
	`last_name` varchar(100),
	`phone` varchar(50),
	`company` varchar(200),
	`is_active` boolean DEFAULT true,
	`email_verified` boolean DEFAULT false,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_unionId_unique` UNIQUE(`unionId`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`type` varchar(50) DEFAULT 'truck',
	`license_plate` varchar(50),
	`capacity` decimal(10,2),
	`year` int,
	`status` varchar(50) DEFAULT 'available',
	`image` varchar(500),
	`description` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicles_license_plate_unique` UNIQUE(`license_plate`)
);
--> statement-breakpoint
ALTER TABLE `blog_posts` ADD CONSTRAINT `blog_posts_category_id_blog_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `blog_categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD CONSTRAINT `blog_posts_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_shipment_id_shipments_id_fk` FOREIGN KEY (`shipment_id`) REFERENCES `shipments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `media_library` ADD CONSTRAINT `media_library_uploaded_by_users_id_fk` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shipments` ADD CONSTRAINT `shipments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tracking` ADD CONSTRAINT `tracking_shipment_id_shipments_id_fk` FOREIGN KEY (`shipment_id`) REFERENCES `shipments`(`id`) ON DELETE no action ON UPDATE no action;