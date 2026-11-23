-- Script de inicialización y restauración de base de datos para Hostinger
-- Proyecto: luisreyesvanegas.com
-- Motor: MariaDB 10.11+ / MySQL 8.0+

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

-- 1. Tabla: solicitudes (formularios del sitio)
CREATE TABLE IF NOT EXISTS `solicitudes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `formulario` varchar(30) NOT NULL,
  `puerta` varchar(60) DEFAULT NULL,
  `idioma` char(2) NOT NULL,
  `nombre` varchar(120) DEFAULT NULL,
  `email` varchar(254) NOT NULL,
  `whatsapp` varchar(40) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `datos` json DEFAULT NULL,
  `pagina` varchar(255) DEFAULT NULL,
  `utm_source` varchar(120) DEFAULT NULL,
  `utm_medium` varchar(120) DEFAULT NULL,
  `utm_campaign` varchar(120) DEFAULT NULL,
  `utm_term` varchar(120) DEFAULT NULL,
  `utm_content` varchar(120) DEFAULT NULL,
  `politica_version` varchar(20) NOT NULL,
  `autorizado_en` datetime(3) NOT NULL,
  `crm_page_id` varchar(64) DEFAULT NULL,
  `crm_sincronizado_en` datetime(3) DEFAULT NULL,
  `aviso_enviado_en` datetime(3) DEFAULT NULL,
  `intentos` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `ultimo_error` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `solicitudes_email_idx` (`email`),
  KEY `solicitudes_creado_en_idx` (`creado_en`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla: suscriptores (boletín de noticias)
CREATE TABLE IF NOT EXISTS `suscriptores` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `email` varchar(254) NOT NULL,
  `idioma` char(2) NOT NULL,
  `estado` varchar(12) NOT NULL DEFAULT 'pendiente',
  `token_hash` char(64) NOT NULL,
  `confirmado_en` datetime(3) DEFAULT NULL,
  `baja_en` datetime(3) DEFAULT NULL,
  `pagina` varchar(255) DEFAULT NULL,
  `utm_source` varchar(120) DEFAULT NULL,
  `utm_medium` varchar(120) DEFAULT NULL,
  `utm_campaign` varchar(120) DEFAULT NULL,
  `utm_term` varchar(120) DEFAULT NULL,
  `utm_content` varchar(120) DEFAULT NULL,
  `politica_version` varchar(20) NOT NULL,
  `autorizado_en` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `suscriptores_email_uq` (`email`),
  UNIQUE KEY `suscriptores_token_uq` (`token_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla de control de Drizzle Migrations (evita conflictos si se corre pnpm db:migrate luego)
CREATE TABLE IF NOT EXISTS `__drizzle_migrations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hash` text NOT NULL,
  `created_at` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `__drizzle_migrations` (`id`, `hash`, `created_at`) VALUES
(1, '0000_inicial', 1795150619755),
(2, '0001_nombre-opcional', 1795190646128);
