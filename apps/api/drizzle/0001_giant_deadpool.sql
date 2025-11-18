CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`transaction_type` text NOT NULL,
	`origin` text NOT NULL,
	`destination` text NOT NULL,
	`amount` real NOT NULL,
	`message` text,
	`operation_date` integer NOT NULL,
	`phone_number` text,
	`status` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `upload_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`file_name` text NOT NULL,
	`phone_number` text,
	`total_records` integer NOT NULL,
	`successful_records` integer NOT NULL,
	`failed_records` integer NOT NULL,
	`duplicate_records` integer DEFAULT 0 NOT NULL,
	`errors` text,
	`upload_date` integer NOT NULL
);
