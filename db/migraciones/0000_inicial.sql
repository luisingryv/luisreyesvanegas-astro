CREATE TABLE `solicitudes` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`formulario` varchar(30) NOT NULL,
	`puerta` varchar(60),
	`idioma` char(2) NOT NULL,
	`nombre` varchar(120) NOT NULL,
	`email` varchar(254) NOT NULL,
	`whatsapp` varchar(40),
	`mensaje` text,
	`datos` json,
	`pagina` varchar(255),
	`utm_source` varchar(120),
	`utm_medium` varchar(120),
	`utm_campaign` varchar(120),
	`utm_term` varchar(120),
	`utm_content` varchar(120),
	`politica_version` varchar(20) NOT NULL,
	`autorizado_en` datetime(3) NOT NULL,
	`crm_page_id` varchar(64),
	`crm_sincronizado_en` datetime(3),
	`aviso_enviado_en` datetime(3),
	`intentos` tinyint unsigned NOT NULL DEFAULT 0,
	`ultimo_error` text,
	CONSTRAINT `solicitudes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `suscriptores` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`email` varchar(254) NOT NULL,
	`idioma` char(2) NOT NULL,
	`estado` varchar(12) NOT NULL DEFAULT 'pendiente',
	`token_hash` char(64) NOT NULL,
	`confirmado_en` datetime(3),
	`baja_en` datetime(3),
	`pagina` varchar(255),
	`utm_source` varchar(120),
	`utm_medium` varchar(120),
	`utm_campaign` varchar(120),
	`utm_term` varchar(120),
	`utm_content` varchar(120),
	`politica_version` varchar(20) NOT NULL,
	`autorizado_en` datetime(3) NOT NULL,
	CONSTRAINT `suscriptores_id` PRIMARY KEY(`id`),
	CONSTRAINT `suscriptores_email_uq` UNIQUE(`email`),
	CONSTRAINT `suscriptores_token_uq` UNIQUE(`token_hash`)
);
--> statement-breakpoint
CREATE INDEX `solicitudes_email_idx` ON `solicitudes` (`email`);--> statement-breakpoint
CREATE INDEX `solicitudes_creado_en_idx` ON `solicitudes` (`creado_en`);