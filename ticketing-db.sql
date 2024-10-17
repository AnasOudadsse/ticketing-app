CREATE DATABASE  IF NOT EXISTS `ticketing` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ticketing`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: ticketing
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `admin_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `admins_admin_id_foreign` (`admin_id`),
  CONSTRAINT `admins_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `client_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clients_client_id_foreign` (`client_id`),
  CONSTRAINT `clients_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,4,'2024-10-13 20:59:59','2024-10-13 20:59:59');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departements`
--

DROP TABLE IF EXISTS `departements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departements`
--

LOCK TABLES `departements` WRITE;
/*!40000 ALTER TABLE `departements` DISABLE KEYS */;
INSERT INTO `departements` VALUES (1,'Informatique','2024-10-13 20:16:50','2024-10-13 20:16:50'),(2,'Ressources Humaines','2024-10-13 20:16:50','2024-10-13 20:16:50'),(3,'Comptabilité','2024-10-13 20:16:50','2024-10-13 20:16:50'),(4,'Marketing','2024-10-13 20:16:50','2024-10-13 20:16:50'),(5,'Production','2024-10-13 20:16:50','2024-10-13 20:16:50');
/*!40000 ALTER TABLE `departements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fonctions`
--

DROP TABLE IF EXISTS `fonctions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fonctions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fonctions`
--

LOCK TABLES `fonctions` WRITE;
/*!40000 ALTER TABLE `fonctions` DISABLE KEYS */;
INSERT INTO `fonctions` VALUES (1,'Directeur','2024-10-13 20:17:27','2024-10-13 20:17:27'),(2,'Chef de projet','2024-10-13 20:17:27','2024-10-13 20:17:27'),(3,'Développeur','2024-10-13 20:17:27','2024-10-13 20:17:27'),(4,'Technicien IT','2024-10-13 20:17:27','2024-10-13 20:17:27'),(5,'Responsable RH','2024-10-13 20:17:27','2024-10-13 20:17:27'),(6,'Comptable','2024-10-13 20:17:27','2024-10-13 20:17:27');
/*!40000 ALTER TABLE `fonctions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `localisations`
--

DROP TABLE IF EXISTS `localisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `localisations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `localisations`
--

LOCK TABLES `localisations` WRITE;
/*!40000 ALTER TABLE `localisations` DISABLE KEYS */;
INSERT INTO `localisations` VALUES (1,'New York','2024-10-13 20:17:41','2024-10-13 20:17:41'),(2,'Paris','2024-10-13 20:17:41','2024-10-13 20:17:41'),(3,'Tokyo','2024-10-13 20:17:41','2024-10-13 20:17:41'),(4,'Berlin','2024-10-13 20:17:41','2024-10-13 20:17:41'),(5,'London','2024-10-13 20:17:41','2024-10-13 20:17:41');
/*!40000 ALTER TABLE `localisations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_100000_create_password_resets_table',1),(2,'2019_08_19_000000_create_failed_jobs_table',1),(3,'2019_12_14_000001_create_personal_access_tokens_table',1),(4,'2024_10_09_081022_create_fonctions_table',1),(5,'2024_10_09_081206_create_departements_table',1),(6,'2024_10_09_081316_create_localisations_table',1),(7,'2024_10_09_081547_create_specialisations_table',1),(8,'2024_10_09_081652_create_users_table',1),(9,'2024_10_09_082944_create_support_its_table',1),(10,'2024_10_09_083214_create_support_its_specialisations_table',1),(11,'2024_10_09_084410_create_admins_table',1),(12,'2024_10_09_084431_create_clients_table',1),(13,'2024_10_09_125142_create_problems_table',1),(14,'2024_10_09_125227_create_tickets_table',1),(15,'2024_10_14_102015_add_type_and_specification_to_problems_table',2);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',3,'auth_token','ec455d56adbbcc553e6bae0455da4da99f090433420e22685a2236e263542228','[\"*\"]','2024-10-13 20:20:57',NULL,'2024-10-13 20:20:57','2024-10-13 20:20:57'),(2,'App\\Models\\User',3,'auth_token','55bedecec78269cf5360ed554d2716c1bb6d0f6062a8d4a06b68980191cc9854','[\"*\"]','2024-10-13 20:57:41',NULL,'2024-10-13 20:57:40','2024-10-13 20:57:41'),(3,'App\\Models\\User',4,'auth_token','be6795bac11a2656a2f6349e3aa4aea0c3c3346bda038e063b8c87db5590868c','[\"*\"]',NULL,NULL,'2024-10-13 20:59:59','2024-10-13 20:59:59'),(4,'App\\Models\\User',4,'auth_token','a03def3b0f0fde09c2a865e83abc53347795a4ecb9227631fb849300ceefafe7','[\"*\"]','2024-10-13 21:00:31',NULL,'2024-10-13 21:00:30','2024-10-13 21:00:31'),(5,'App\\Models\\User',5,'auth_token','f8b7871b122493b23c13db8f3d17b6418c0637226ef4ddec8040e86e1ef30894','[\"*\"]',NULL,NULL,'2024-10-13 21:06:16','2024-10-13 21:06:16'),(6,'App\\Models\\User',5,'auth_token','9e6fc5ec4c29a2f6b2f81f4df09e7719bf63a6d3a64c68f607eb43a6807d51c3','[\"*\"]','2024-10-13 21:12:22',NULL,'2024-10-13 21:12:22','2024-10-13 21:12:22'),(7,'App\\Models\\User',5,'auth_token','ebe910e2d9d4c5b2eba042eb9a79c819b1e3d713969d562231156921b77445b8','[\"*\"]','2024-10-13 21:13:08',NULL,'2024-10-13 21:13:07','2024-10-13 21:13:08'),(8,'App\\Models\\User',4,'auth_token','c1d42cb4111b5ebcb15955a9e04cb0b3b3fd175d3a11bba098bcab56d57efd2f','[\"*\"]','2024-10-13 21:26:38',NULL,'2024-10-13 21:26:37','2024-10-13 21:26:38');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `problems`
--

DROP TABLE IF EXISTS `problems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `problems` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specification` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `problems`
--

LOCK TABLES `problems` WRITE;
/*!40000 ALTER TABLE `problems` DISABLE KEYS */;
INSERT INTO `problems` VALUES (8,'Biostar','2024-10-14 14:46:36','2024-10-14 14:46:36','logiciel',NULL),(9,'Canvas','2024-10-14 14:49:37','2024-10-14 14:49:37','logiciel',NULL),(10,'Catia','2024-10-14 14:49:47','2024-10-14 14:49:47','logiciel',NULL),(11,'EvalBox','2024-10-14 14:49:51','2024-10-14 14:49:51','logiciel',NULL),(12,'Konosys','2024-10-14 14:50:34','2024-10-14 14:50:34','logiciel','Konosys Finance'),(13,'Konosys','2024-10-14 14:50:54','2024-10-14 14:50:54','logiciel','Konosys Planification'),(14,'Konosys','2024-10-14 14:51:05','2024-10-14 14:51:05','logiciel','Konosys Scolarité'),(15,'Konosys','2024-10-14 14:51:15','2024-10-14 14:51:15','logiciel','Konosys Autre'),(16,'Imprimante','2024-10-14 14:52:39','2024-10-14 14:52:39','Matériel',NULL),(17,'Pc Portable','2024-10-14 14:52:50','2024-10-14 14:52:50','Matériel',NULL),(18,'Pc Poste','2024-10-14 14:53:00','2024-10-14 14:53:00','Matériel',NULL),(19,'Scanner','2024-10-14 14:53:08','2024-10-14 14:53:08','Matériel',NULL),(20,'Tablettes','2024-10-14 14:53:19','2024-10-14 14:53:19','Matériel',NULL),(21,'Wifi','2024-10-14 14:55:16','2024-10-14 14:55:16','Infrastructure',NULL),(22,'Réseau','2024-10-14 14:55:48','2024-10-14 14:55:48','Infrastructure',NULL);
/*!40000 ALTER TABLE `problems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specialisations`
--

DROP TABLE IF EXISTS `specialisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specialisations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specialisations`
--

LOCK TABLES `specialisations` WRITE;
/*!40000 ALTER TABLE `specialisations` DISABLE KEYS */;
/*!40000 ALTER TABLE `specialisations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_its`
--

DROP TABLE IF EXISTS `support_its`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_its` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `supportIt_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `support_its_supportit_id_foreign` (`supportIt_id`),
  CONSTRAINT `support_its_supportit_id_foreign` FOREIGN KEY (`supportIt_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_its`
--

LOCK TABLES `support_its` WRITE;
/*!40000 ALTER TABLE `support_its` DISABLE KEYS */;
INSERT INTO `support_its` VALUES (3,1,'2024-10-13 20:18:39','2024-10-13 20:18:39'),(4,2,'2024-10-13 20:18:39','2024-10-13 20:18:39'),(5,5,'2024-10-13 21:06:16','2024-10-13 21:06:16');
/*!40000 ALTER TABLE `support_its` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_its_specialisations`
--

DROP TABLE IF EXISTS `support_its_specialisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_its_specialisations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `specialisation_id` bigint unsigned NOT NULL,
  `support_it_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `support_its_specialisations_specialisation_id_foreign` (`specialisation_id`),
  KEY `support_its_specialisations_support_it_id_foreign` (`support_it_id`),
  CONSTRAINT `support_its_specialisations_specialisation_id_foreign` FOREIGN KEY (`specialisation_id`) REFERENCES `specialisations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `support_its_specialisations_support_it_id_foreign` FOREIGN KEY (`support_it_id`) REFERENCES `support_its` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_its_specialisations`
--

LOCK TABLES `support_its_specialisations` WRITE;
/*!40000 ALTER TABLE `support_its_specialisations` DISABLE KEYS */;
/*!40000 ALTER TABLE `support_its_specialisations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `problem_id` bigint unsigned NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attachement` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supportItID` bigint unsigned DEFAULT NULL,
  `adminID` bigint unsigned DEFAULT NULL,
  `clientID` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `resolution_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tickets_problem_id_foreign` (`problem_id`),
  KEY `tickets_supportitid_foreign` (`supportItID`),
  KEY `tickets_adminid_foreign` (`adminID`),
  KEY `tickets_clientid_foreign` (`clientID`),
  CONSTRAINT `tickets_adminid_foreign` FOREIGN KEY (`adminID`) REFERENCES `admins` (`id`),
  CONSTRAINT `tickets_clientid_foreign` FOREIGN KEY (`clientID`) REFERENCES `clients` (`client_id`),
  CONSTRAINT `tickets_problem_id_foreign` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tickets_supportitid_foreign` FOREIGN KEY (`supportItID`) REFERENCES `support_its` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (5,12,'mchaw lia flousi','published',NULL,NULL,NULL,4,'2024-10-14 15:22:55','2024-10-14 15:22:55',NULL);
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','supportIt','client') COLLATE utf8mb4_unicode_ci NOT NULL,
  `fonction_id` bigint unsigned NOT NULL,
  `departement_id` bigint unsigned NOT NULL,
  `localisation_id` bigint unsigned NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_fonction_id_foreign` (`fonction_id`),
  KEY `users_departement_id_foreign` (`departement_id`),
  KEY `users_localisation_id_foreign` (`localisation_id`),
  CONSTRAINT `users_departement_id_foreign` FOREIGN KEY (`departement_id`) REFERENCES `departements` (`id`) ON DELETE CASCADE,
  CONSTRAINT `users_fonction_id_foreign` FOREIGN KEY (`fonction_id`) REFERENCES `fonctions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `users_localisation_id_foreign` FOREIGN KEY (`localisation_id`) REFERENCES `localisations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin User','admin@example.com','2024-10-13 20:18:35','$2y$10$hs.akln4C0JVFYfe4eAT0.FiMhaKdVWz15Bwb.Vk6ixdZBAZHMf8G','admin',1,1,1,'68gHEgrozw','2024-10-13 20:18:35','2024-10-13 20:18:35'),(2,'Support IT User','support@example.com','2024-10-13 20:18:35','$2y$10$0XUvNRUrROtxtJFVY6BRx.zuPxHB/VDukao.vmgQgjNiglFjqTAhW','supportIt',2,2,2,'xwJOcETJ56','2024-10-13 20:18:35','2024-10-13 20:18:35'),(3,'Client User','client@example.com','2024-10-13 20:18:35','$2y$10$nPgRxgItHukjEl8Dk/6tMON1uKjiKb6oOWDxsKUr4OxA/i2seYuIe','client',3,3,3,'G1PPxo9pfN','2024-10-13 20:18:35','2024-10-13 20:18:35'),(4,'anas client','anasclient@example.com',NULL,'$2y$10$NLQ.i0KqtnbwtHFqUF0QTeCB/7p74OYSxx1./nDXGTKkaXSYBqbK6','client',3,3,3,NULL,'2024-10-13 20:59:58','2024-10-13 20:59:58'),(5,'anas support','anassupport@example.com',NULL,'$2y$10$wDHLWp6U7VuKCgrcQegQyeYZBY.Da4EefdEVVoNQ0K4bJiaaTXsSC','supportIt',3,3,3,NULL,'2024-10-13 21:06:16','2024-10-13 21:06:16');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-14 17:31:45
