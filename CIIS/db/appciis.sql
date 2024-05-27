CREATE DATABASE  IF NOT EXISTS `app_ciis` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `app_ciis`;
-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: app_ciis
-- ------------------------------------------------------
-- Server version	8.0.19

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
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `audit_id` int NOT NULL AUTO_INCREMENT,
  `table_name` varchar(255) NOT NULL,
  `action_type` varchar(255) NOT NULL,
  `action_date` datetime NOT NULL,
  `user_id` int NOT NULL,
  `old_data` varchar(255) DEFAULT NULL,
  `new_data` varchar(255) DEFAULT NULL,
  `record_id` int NOT NULL,
  PRIMARY KEY (`audit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (6,'reservation','update','2023-07-23 22:27:14',87,NULL,'{\"status\":\"2\"}',69),(7,'reservation','update','2023-07-23 23:14:01',87,NULL,'{\"status\":\"2\"}',69),(8,'reservation','update','2023-07-23 20:55:31',87,NULL,'{\"status\":\"2\"}',69),(9,'reservation','update','2023-07-23 21:10:27',87,NULL,'{\"status\":\"2\"}',69),(10,'reservation','update','2023-07-24 02:47:50',87,NULL,'{\"status\":\"2\"}',69),(11,'reservation','update','2023-07-23 21:48:57',87,NULL,'{\"status\":\"2\"}',69),(12,'reservation','update','2023-07-29 02:07:11',87,NULL,'{\"status\":\"2\"}',86),(13,'reservation','update','2023-08-08 19:06:27',87,NULL,'{\"status\":\"2\"}',75),(14,'reservation','update','2023-08-08 19:07:54',87,NULL,'{\"status\":\"2\"}',75),(15,'reservation','update','2023-08-08 19:21:15',87,NULL,'{\"status\":\"2\"}',75);
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conference_attendances`
--

DROP TABLE IF EXISTS `conference_attendances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conference_attendances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `reservation_id` int DEFAULT NULL,
  `conference_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_conference_reservation` (`conference_id`,`reservation_id`),
  KEY `reservation_id` (`reservation_id`),
  CONSTRAINT `conference_attendances_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id_reservation`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `conference_attendances_ibfk_2` FOREIGN KEY (`conference_id`) REFERENCES `conferences` (`id_conference`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conference_attendances`
--

LOCK TABLES `conference_attendances` WRITE;
/*!40000 ALTER TABLE `conference_attendances` DISABLE KEYS */;
INSERT INTO `conference_attendances` VALUES (45,'2023-08-10 21:01:57',109,5),(46,'2023-08-10 21:01:57',109,6),(47,'2023-08-10 21:01:57',109,7),(48,'2023-08-10 21:01:57',109,8);
/*!40000 ALTER TABLE `conference_attendances` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`usuario`@`localhost`*/ /*!50003 TRIGGER `add_datetime_attendances` BEFORE INSERT ON `conference_attendances` FOR EACH ROW BEGIN
  SET NEW.created_at = DATE_SUB(utc_timestamp(), INTERVAL 5 DAY_HOUR);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `conferences`
--

DROP TABLE IF EXISTS `conferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conferences` (
  `id_conference` int NOT NULL AUTO_INCREMENT,
  `topic_conference` varchar(255) NOT NULL,
  `start_date_conference` datetime NOT NULL,
  `exp_date_conference` datetime NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `event_id` int DEFAULT NULL,
  `speaker_id` int DEFAULT NULL,
  `is_morning` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_conference`),
  KEY `event_id` (`event_id`),
  KEY `speaker_id` (`speaker_id`),
  CONSTRAINT `conferences_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id_event`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `conferences_ibfk_2` FOREIGN KEY (`speaker_id`) REFERENCES `speakers` (`id_speaker`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conferences`
--

LOCK TABLES `conferences` WRITE;
/*!40000 ALTER TABLE `conferences` DISABLE KEYS */;
INSERT INTO `conferences` VALUES (1,'Business Intelligence, Data Analytics y Machine Learning','2023-08-10 09:00:00','2023-08-11 09:50:00',1,12,1,1),(2,'AWS para Business Intelligence','2023-08-10 10:00:00','2023-08-11 10:50:00',1,12,2,1),(3,'Integrando APIs REST de ESRI en Aplicaciones','2023-08-10 11:00:00','2023-08-11 11:50:00',1,12,3,1),(4,'Integración de procesos de negocio con SAP ERP','2023-08-10 12:00:00','2023-08-11 12:50:00',1,12,4,1),(5,'Desarrollo móvil multiplataforma usando React Native','2023-08-10 15:00:00','2023-08-11 15:50:00',1,12,5,0),(6,'Business Intelligence en la industria Minera con Power BI','2023-08-10 16:00:00','2023-08-11 16:50:00',1,12,6,0),(7,'Data-driven: la transformación digital basada en el dato y la analítica avanzada','2023-08-10 17:00:00','2023-08-11 17:50:00',1,12,7,0),(8,'Patrones de diseño y buenas prácticas en el desarrollo de software','2023-08-10 18:00:00','2023-08-11 18:50:00',1,12,8,0);
/*!40000 ALTER TABLE `conferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id_event` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `about` varchar(255) DEFAULT NULL,
  `place` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `exp_date` date DEFAULT NULL,
  `price` decimal(5,2) DEFAULT NULL,
  `dir_logo` varchar(255) DEFAULT NULL,
  `dir_brouchere` varchar(255) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `type_event_id` int DEFAULT NULL,
  PRIMARY KEY (`id_event`),
  KEY `type_event_id` (`type_event_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`type_event_id`) REFERENCES `type_events` (`id_typeEvent`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'CIIS XIII','Décimo tercera edición del congreso de informática y sistemas',NULL,'2012-12-05','2012-12-07',NULL,NULL,NULL,0,1),(2,'CIIS XIV','Décimo cuarta edición del congreso de informática y sistemas',NULL,'2013-10-05','2013-10-19',NULL,NULL,NULL,0,1),(3,'CIIS XV','Décimo quinta edición del congreso de informática y sistemas',NULL,NULL,NULL,NULL,NULL,NULL,0,1),(4,'CIIS XVI','Décimo quinta edición del congreso de informática y sistemas',NULL,NULL,NULL,NULL,NULL,NULL,0,1),(5,'CIIS XVII','Décimo séptima edición del congreso de informática y sistemas',NULL,'2016-11-07','2016-11-12',NULL,NULL,NULL,0,1),(6,'CIIS XVIII','Décimo octava edición del congreso de informática y sistemas',NULL,'2017-11-13','2017-11-17',NULL,NULL,NULL,0,1),(7,'CIIS XIX','Décimo novena edición del congreso de informática y sistemas',NULL,'2018-11-12','2018-11-16',NULL,NULL,NULL,0,1),(8,'CIIS XX','Vigésima edición del congreso de informática y sistemas',NULL,'2019-11-11','2019-11-15',NULL,NULL,NULL,0,1),(9,'CIIS XXI','Vigésimo primera edición del congreso de informática y sistemas',NULL,'2020-11-09','2020-11-13',NULL,NULL,NULL,0,1),(10,'CIIS XXII','Vigésimo segunda edición del congreso de informática y sistemas',NULL,'2021-11-06','2021-11-10',NULL,NULL,NULL,0,1),(11,'CIIS XXIII','Vigésimo tercera edición del congreso de informática y sistemas',NULL,'2022-11-07','2022-11-11',NULL,NULL,NULL,0,1),(12,'POSTMASTER XX','Vigésimo Postmaster del Encuentro de engresados',NULL,'2023-08-10','2023-08-11',NULL,NULL,NULL,1,2);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery_events`
--

DROP TABLE IF EXISTS `gallery_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery_events` (
  `id_galleryPhoto` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `dir_photo` varchar(255) NOT NULL,
  `eventId` int DEFAULT NULL,
  PRIMARY KEY (`id_galleryPhoto`),
  KEY `eventId` (`eventId`),
  CONSTRAINT `gallery_events_ibfk_1` FOREIGN KEY (`eventId`) REFERENCES `events` (`id_event`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery_events`
--

LOCK TABLES `gallery_events` WRITE;
/*!40000 ALTER TABLE `gallery_events` DISABLE KEYS */;
INSERT INTO `gallery_events` VALUES (1,'ciis-history/ciis-xiii-FlyerPrincipal.jpg','Flyer principal',1),(2,'ciis-history/ciis-xiv-FlyerPrincipal.jpg','Flyer principal',2),(3,'ciis-history/ciis-xiv-postmasterXI.png','Flyer de postmaster XI',2),(4,'ciis-history/ciis-xiv-EventoRelacionado.jpg','Flyer de evento relacionado',2),(5,'ciis-history/ciis-xv-BannerPromocional.png','Banner promocional',3),(6,'ciis-history/ciis-xv-BannerPromocionalLogo.jpg','Banner promocional (logo)',3),(7,'ciis-history/ciis-xv-FotografiaPonencia.jpg','Fotografía de ponencia',3),(8,'ciis-history/ciis-xvi-FlyerPrincipal.jpg','Flyer principal',4),(9,'ciis-history/ciis-xvi-FlyerPromocional.png','Flyer promocional',4),(10,'ciis-history/ciis-xvi-FlyerConcursoProgramacion.jpg','Flyer de concurso (programación)',4),(11,'ciis-history/ciis-xvi-auditorio.jpg','Fotografía de auditorío',4),(12,'ciis-history/ciis-xvi-ReconocimientoPonente.jpg','Reconocimiento a ponente',4),(13,'ciis-history/ciis-xvii-FlyerPrincipal.jpg','Flyer principal',5),(14,'ciis-history/ciis-xvii-eventoRelacionado.png','Flyer de evento relacionado',5),(15,'ciis-history/ciis-xvii-FlyerConcursoProgramacion.jpg','Flyer de concurso (programación)',5),(16,'ciis-history/ciis-xvii-auditorio.jpg','Fotografía de auditorío',5),(17,'ciis-history/ciis-xvii-FotografiaPonencia.jpg','Fotografía de ponencia',5),(18,'ciis-history/ciis-xvii-organizadores.jpg','Entrega de organizadores',5),(19,'ciis-history/ciis-xviii-FlyerPrincipal.jpg','Flyer principal',6),(20,'ciis-history/ciis-xviii-auditorio.jpg','Fotografía de auditorío',6),(21,'ciis-history/ciis-xviii-FotografiaPonencia.jpg','Fotografía de ponencia',6),(22,'ciis-history/ciis-xix-FlyerPrincipal.jpg','Flyer principal',7),(23,'ciis-history/ciis-xix-postmasterXV.jpg','Flyer de postmaster XV',7),(24,'ciis-history/ciis-xix-FeriaTecnologica.jpg','Fotografía de feria tecnológica',7),(25,'ciis-history/ciis-xix-auditorio.jpg','Fotografía de auditorío',7),(26,'ciis-history/ciix-xix-ponencia.jpg','Fotografía de ponencia',7),(27,'ciis-history/ciis-xix-entregaCertificado.jpg','Entrega de certificado a ponente',7),(28,'ciis-history/ciis-xx-FlyerDeConcursosCall4Posters.jpg','Flyer de concursos (call for posters)',8),(29,'ciis-history/ciis-xx-postmasterXVI.jpg','Flyer de postmaster XVI',8),(30,'ciis-history/ciis-xx-feriaTecnologica.jpg','Flyer de feria tecnológica',8),(31,'ciis-history/ciis-xx-inauguracion.jpg','Fotografía de inauguración',8),(32,'ciis-history/ciis-xx-auditorio.jpg','Fotografía de auditorío',8),(33,'ciis-history/ciis-xx-AntesalaEvento.jpg','Fotografía de antesala al evento',8),(34,'ciis-history/ciis-xxi-flyers-ponentes1.jpg','Flyer de ponentes - parte 1',9),(35,'ciis-history/ciis-xxi-flyers-ponentes2.jpg','Flyer de ponentes - parte 2',9),(36,'ciis-history/ciis-xxi-flyers-ponentes3.jpg','Flyer de ponentes - parte 3',9),(37,'ciis-history/ciis-xxii-postmater-18.jpg','Flyer de postmaster XVII',9),(38,'ciis-history/ciis-xxi-discusion.jpg','Flyer de panel de discusión',9),(39,'ciis-history/ciis-xxi-feriaTecnologica.jpg','Flyer de feria tecnológica',9),(40,'ciis-history/ciis-xxii-CronogramaPonencias.jpg','Cronograma de ponencias',10),(41,'ciis-history/ciis-xxii-postmater-18.jpg','Flyer de postmaster XVIII',10),(42,'ciis-history/ciis-xxii-FlyerPrimerPosterSession.jpg','Flyer de primer poster session',10),(43,'ciis-history/ciis-xxii-call4posters.jpg','Flyer de concursos (call for posters)',10),(44,'ciis-history/ciis-xxii-HACKATHON.jpg','Flyer de concursos (hackathon)',10),(45,'ciis-history/ciis-xxii-organizadores.jpg','Organizadores del evento',10),(46,'ciis-history/ciis-xxiii-FlyerPrincipal.jpg','Flyer principal',11),(47,'ciis-history/ciis-xxiii-CronogramaPonencias.jpg','Cronograma de ponencias',11),(48,'ciis-history/ciis-xxiii-postmasterXIX.png','Flyer de postmaster XIX',11),(49,'ciis-history/ciis-xxiii-auditorio.jpg','Fotografía de auditorío',11),(50,'ciis-history/ciis-xxiii-talleres.jpg','Fotografía de talleres',11),(51,'ciis-history/ciis-xxiii-Estudiantes.jpg','Fotografía de estudiantes',11);
/*!40000 ALTER TABLE `gallery_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `price_type_attendees`
--

DROP TABLE IF EXISTS `price_type_attendees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `price_type_attendees` (
  `id_price_type_attendee` int NOT NULL AUTO_INCREMENT,
  `price_attendee` decimal(6,2) NOT NULL,
  `start_date_price` date NOT NULL,
  `exp_date_price` date DEFAULT NULL,
  `event_id` int NOT NULL,
  `type_attendee_id` int NOT NULL,
  PRIMARY KEY (`id_price_type_attendee`),
  KEY `event_id` (`event_id`),
  KEY `type_attendee_id` (`type_attendee_id`),
  CONSTRAINT `price_type_attendees_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id_event`),
  CONSTRAINT `price_type_attendees_ibfk_2` FOREIGN KEY (`type_attendee_id`) REFERENCES `type_attendees` (`id_type_attendee`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `price_type_attendees`
--

LOCK TABLES `price_type_attendees` WRITE;
/*!40000 ALTER TABLE `price_type_attendees` DISABLE KEYS */;
INSERT INTO `price_type_attendees` VALUES (1,15.00,'2023-07-01','2023-08-09',12,1),(2,20.00,'2023-07-01','2023-08-09',12,2),(3,25.00,'2023-07-01','2023-08-09',12,3),(4,20.00,'2023-08-10',NULL,12,1),(5,25.00,'2023-08-10',NULL,12,2),(6,30.00,'2023-08-10',NULL,12,3);
/*!40000 ALTER TABLE `price_type_attendees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id_reservation` int NOT NULL AUTO_INCREMENT,
  `num_voucher` varchar(15) NOT NULL,
  `dir_voucher` varchar(255) NOT NULL,
  `dir_fileuniversity` varchar(255) DEFAULT NULL,
  `enrollment_status` tinyint(1) NOT NULL DEFAULT '1',
  `active` tinyint(1) NOT NULL,
  `user_id` int DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  `price_type_attendee_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_reservation`),
  UNIQUE KEY `num_voucher` (`num_voucher`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`),
  KEY `price_type_attendee_id` (`price_type_attendee_id`),
  CONSTRAINT `reservations_ibfk_163` FOREIGN KEY (`user_id`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `reservations_ibfk_164` FOREIGN KEY (`event_id`) REFERENCES `events` (`id_event`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `reservations_ibfk_165` FOREIGN KEY (`price_type_attendee_id`) REFERENCES `price_type_attendees` (`id_price_type_attendee`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (68,'10269894','voucher/2c4337ec-d0c7-4e96-a02e-0729076bc558.jpg','file-university/40db7dbb-a440-4d28-8113-130c1eb81bb4.jpg',3,1,86,12,2,'2023-07-27 00:00:00','2023-08-10 10:04:02'),(69,'00391694','voucher/bbc1f413-a4e0-4d6e-a72c-cfe7224fc5f6.jpg',NULL,2,1,88,12,3,'2023-07-27 00:00:00','2023-08-10 10:04:02'),(70,'00123456','voucher/5b7ecf42-12ab-47ca-9103-de79ddbb2519.jpg',NULL,1,1,89,12,3,'2023-07-27 00:00:00','2023-08-10 10:04:02'),(71,'02502232','voucher/4831a83b-1d35-407d-a162-b63f11197404.jpg','file-university/38585a75-b7f6-4f22-9c9c-9fed7adf86e7.jpg',1,1,90,12,2,'2023-07-27 00:00:00','2023-08-10 10:04:02'),(72,'014954634','voucher/870e8e89-65ba-403d-88ea-112b044563cb.jpg','file-university/12b0102a-b0a1-466f-ad8d-1993b6951421.jpg',1,1,91,12,2,'2023-07-27 00:00:00','2023-08-10 10:04:02'),(73,'13694510','voucher/6affbb02-62f1-4f86-80d3-eec36387fd8d.jpg','file-university/5c6d8db0-38b5-4076-9733-4fd60d77b99f.jpg',1,1,92,12,1,'2023-07-27 00:00:00','2023-08-10 10:04:02'),(74,'00146478','voucher/613d71c0-15a6-4b64-bb5f-e65c3b74369f.jpg','file-university/7b438b90-6c7b-4f6f-9029-99f2b9c1d69c.jpg',1,1,93,12,1,'2023-07-27 00:00:00','2023-08-10 10:04:02'),(75,'000034151','voucher/1340a095-b2be-4c20-bd44-753648ce5174.jpg','file-university/26d81129-eeaa-417a-9430-321fac8e0cfd.jpg',2,1,94,12,2,'2023-07-27 00:00:00','2023-08-10 10:04:02'),(79,'123333333','voucher/6e43867e-de25-4c54-a102-b902d702363c.jpg','file-university/cc167792-b88a-4b62-b65b-bf27e51b59a5.jpg',1,1,99,12,2,'2023-07-27 00:00:00','2023-08-10 10:04:02'),(84,'22222222','voucher/47098384-e027-43f3-8151-32198d4f261f.jpg','file-university/0ae911da-b7ca-4e9d-95f3-ad3be2d6af93.jpg',1,1,105,12,2,'2023-07-27 00:00:00','2023-08-10 10:04:02'),(85,'00237994','voucher/e5452c5e-e273-4be5-a937-91649d31e768.jpg',NULL,1,1,107,12,3,'2023-07-29 06:33:31','2023-07-29 06:33:31'),(86,'11037994','voucher/b04705f6-35b9-4406-80a7-6719aa01a652.jpg',NULL,2,1,108,12,3,'2023-07-29 01:36:51','2023-07-29 02:07:11'),(87,'989745210','voucher/ed92444d-d3fa-4ff0-a8f7-6a00f3a2b7a3.jpg',NULL,1,1,109,12,3,'2023-08-03 13:38:29','2023-08-03 13:38:29'),(89,'089745210','voucher/c1bd17fd-c783-4042-9c2d-953189357c7e.jpg',NULL,1,1,111,12,3,'2023-08-03 13:46:24','2023-08-03 13:46:24'),(108,'023148441','voucher/836c9a7c-4b44-447a-9b5a-71841c1e0df6.jpg','file-university/7ce63527-f116-4e97-b8b7-d2a7544c73af.jpg',1,1,134,12,5,'2023-08-06 20:21:21','2023-08-06 20:21:21'),(109,'003145488','voucher/427ae1a1-d8d8-43ee-a2cd-abbffaa8f925.jpg','file-university/dd893455-dbc3-4219-91bb-fb22acc1d7d9.jpg',2,1,135,12,5,'2023-08-07 00:41:44','2023-08-08 21:56:04'),(110,'826564123','voucher/783cb99a-05b1-4a1b-b32d-1e04029ac38f.jpg',NULL,1,1,136,12,6,'2023-08-10 01:57:04','2023-08-10 01:57:04'),(111,'82400000123','voucher/0103eaab-3557-4a1f-8a1e-6fba681d196b.jpg',NULL,1,1,137,12,6,'2023-08-10 02:36:57','2023-08-10 02:36:57'),(112,'400000123','voucher/1b208e1b-bbba-48d3-b7b4-7f2508d818f9.jpg',NULL,1,1,138,12,6,'2023-08-10 02:44:05','2023-08-10 02:44:05'),(113,'4011111231','voucher/fa242dd0-8715-471f-95bc-498276d21a78.jpg',NULL,1,1,139,12,6,'2023-08-10 10:17:49','2023-08-10 10:17:49'),(114,'406611231','voucher/ca585b95-f1f3-454a-8dfc-6ea15041bd2c.jpg',NULL,1,1,140,12,6,'2023-08-10 17:59:35','2023-08-10 17:59:35');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`usuario`@`localhost`*/ /*!50003 TRIGGER `add_datetime_reservation` BEFORE INSERT ON `reservations` FOR EACH ROW BEGIN
  SET NEW.created_at := DATE_SUB(utc_timestamp(), INTERVAL 5 DAY_HOUR);
  SET NEW.updated_at := DATE_SUB(utc_timestamp(), INTERVAL 5 DAY_HOUR);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`usuario`@`localhost`*/ /*!50003 TRIGGER `update_datetime_reservation` BEFORE UPDATE ON `reservations` FOR EACH ROW BEGIN
  SET NEW.updated_at = DATE_SUB(utc_timestamp(), INTERVAL 5 HOUR);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_role` int NOT NULL AUTO_INCREMENT,
  `name_role` varchar(255) NOT NULL,
  PRIMARY KEY (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador'),(2,'Organizador'),(3,'Asistente');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `speakers`
--

DROP TABLE IF EXISTS `speakers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `speakers` (
  `id_speaker` int NOT NULL AUTO_INCREMENT,
  `name_speaker` varchar(255) NOT NULL,
  `lastname_speaker` varchar(255) NOT NULL,
  `ocupation_speaker` varchar(255) NOT NULL,
  `university_speaker` varchar(255) DEFAULT NULL,
  `email_speaker` varchar(255) DEFAULT NULL,
  `phone_speaker` varchar(255) DEFAULT NULL,
  `about_profile_speaker` varchar(255) DEFAULT NULL,
  `img_dir_speaker` varchar(255) DEFAULT NULL,
  `work_place_speaker` varchar(45) DEFAULT NULL,
  `nationality_speaker` varchar(45) DEFAULT NULL,
  `linkedin_speaker` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_speaker`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `speakers`
--

LOCK TABLES `speakers` WRITE;
/*!40000 ALTER TABLE `speakers` DISABLE KEYS */;
INSERT INTO `speakers` VALUES (1,'Jesús Joseph','Flores Yance','Database Administrator','Universidad Nacional Jorge Basadre Grohmann',NULL,'931686610',NULL,NULL,'CMAC TACNA S.A.,',NULL,'https://www.linkedin.com/in/jesus-joseph-flores-yance/'),(2,'Cynthia','Valeriano Argandoña','Business Intelligence Developer','Universidad Nacional Jorge Basadre Grohmann',NULL,'952009581',NULL,NULL,'Defontana',NULL,'https://www.linkedin.com/in/cvalerianoarg/'),(3,'Ever Jorge','Coa Sandoval','Full Stack Developer','Universidad Nacional Jorge Basadre Grohmann',NULL,'956345101',NULL,NULL,'Ministerio de Educación',NULL,'https://www.linkedin.com/in/ever-jorge-coa-sandoval/'),(4,'Francisco Daniel','Urdanivia Herrera','Consultor de Soluciones Logísticas','Universidad Nacional Jorge Basadre Grohmann,',NULL,'935781989',NULL,NULL,'MQA Américas Corp.',NULL,'https://www.linkedin.com/in/danurd'),(5,'Jhair Rodrigo','Viveros Cordova','Senior Software Developer','Universidad Nacional Jorge Basadre Grohmann',NULL,'926229354',NULL,NULL,'Obvio Health USA, Inc.',NULL,'https://www.linkedin.com/in/rodrigo-viveros/'),(6,'Brenda Brigitte','López Valera','Business Intelligence Analyst','Universidad Nacional Jorge Basadre Grohmann',NULL,'935020985',NULL,NULL,'Gointegreat',NULL,'https://www.linkedin.com/in/brenda-l%C3%B3pez-valera/'),(7,'Herson Raúl','Urbina Cayo','Senior Data Engineer','Universidad Nacional Jorge Basadre Grohmann',NULL,'948451622',NULL,NULL,'Kueski',NULL,'https://www.linkedin.com/in/hersonurbina/'),(8,'Kevin Mike','Herrera Vega','Senior Software Engineer','Universidad Nacional Jorge Basadre Grohmann',NULL,'952314390',NULL,NULL,'McKinsey and Company',NULL,'https://www.linkedin.com/in/kevin-mike-herrera-vega/');
/*!40000 ALTER TABLE `speakers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_attendees`
--

DROP TABLE IF EXISTS `type_attendees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_attendees` (
  `id_type_attendee` int NOT NULL AUTO_INCREMENT,
  `name_attendee` varchar(100) NOT NULL,
  `isuniversity` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_type_attendee`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_attendees`
--

LOCK TABLES `type_attendees` WRITE;
/*!40000 ALTER TABLE `type_attendees` DISABLE KEYS */;
INSERT INTO `type_attendees` VALUES (1,'Universitario interno',1),(2,'Universitario externo',1),(3,'Público en general',0);
/*!40000 ALTER TABLE `type_attendees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_events`
--

DROP TABLE IF EXISTS `type_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_events` (
  `id_typeEvent` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `about` varchar(255) NOT NULL,
  PRIMARY KEY (`id_typeEvent`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_events`
--

LOCK TABLES `type_events` WRITE;
/*!40000 ALTER TABLE `type_events` DISABLE KEYS */;
INSERT INTO `type_events` VALUES (1,'CIIS','Congreso Internacional de Informática y Sistemas.'),(2,'POSTMASTER','Encuentro de egresados');
/*!40000 ALTER TABLE `type_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `email_user` varchar(255) NOT NULL,
  `name_user` varchar(255) NOT NULL,
  `lastname_user` varchar(255) NOT NULL,
  `phone_user` varchar(255) NOT NULL,
  `password_user` varchar(255) DEFAULT NULL,
  `code_user` varchar(255) NOT NULL,
  `role_id` int DEFAULT NULL,
  `university_career_user` varchar(255) NOT NULL,
  `study_center_user` varchar(255) NOT NULL,
  `dni_user` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email_user` (`email_user`),
  UNIQUE KEY `dni_user` (`dni_user`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id_role`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (86,'testtt@pruebdcghja.com','Alejandro','Rivera Ramirez','974521203',NULL,'-NOIiknJEu_hfgp',2,'Ingenieria en informatica y sistemas','UNJBG','0231564879'),(87,'alvarorivera2001@gmail.com','Alvaro Alejandro','Rivera Ramirez','986123540','$2b$10$vqXhnXsIYL/c/FzeEYiUSuOQkd9kEyT6L6CjRjOiMOXVR4Fo10u/.','NrIi-knJEu_hfgp',1,'ESIS','UNJBG',NULL),(88,'ghostprice096@gmail.com','Alvaro','Rivera Ramirez','974521203',NULL,'6vxS1chjMwxmxfz',2,'Ingenieria en informatica y sistemas','UNJBG','948133114'),(89,'example1@gmail.com','Diego','Ramos Vasquez','974521203',NULL,'968VuduFg9eyAb_',2,'Ingenieria en informatica y sistemas','UNJBG','00329424'),(90,'example2@gmail.com','Gerardo','Miranda Lopez','974521203',NULL,'XMc2aVfKzWWE96N',2,'Ingenieria en informatica y sistemas','UNJBG','00329443'),(91,'example3@gmail.com','Allison','Pinto Velásquez','974521203',NULL,'4tYIM_n1zwcha0B',2,'Ingenieria en informatica y sistemas','UNJBG','01695324'),(92,'example4@gmail.com','Carlos','Yufra Loza','974521203',NULL,'kr_q9fKgh_63VjN',2,'Ingenieria en informatica y sistemas','UNJBG','71203590'),(93,'example5@gmail.com','Enrique','Castro Gómez','974521203',NULL,'wzOrKwynteP9HYq',2,'Ingenieria en informatica y sistemas','UNJBG','73959412'),(94,'example6@gmail.com','Claudia','Miranda Castro','974521203',NULL,'zosfV8XID803RXi',2,'Ingenieria en informatica y sistemas','UNJBG','79891340'),(99,'ariverar@unjbg.edu.pe','tesst','testt testt','000123458',NULL,'IDapHpRUm3LK7m5',2,'Ingenieria en informatica y sistemas','UNJBG','04140000'),(105,'ariverarrrrr@unjbg.edu.pe','tesst','testt testt','000123458',NULL,'eQ9p1KnXsWB-ui7',2,'Ingenieria en informatica y sistemas','UNJBG','111111111'),(107,'examplee@unjbg.edu.pe','tesst','testt testt','000123458',NULL,'LSphgjcKx5nkGAg',2,'','','01233218'),(108,'exampleeee@unjbg.edu.pe','tesst','testt testt','000123458',NULL,'8y8SPRvW0DifTZ2',2,'','','971231100'),(109,'exampletest@gmail.com','tesst','testt testt','000123458',NULL,'7tqerXvDI4RlqBS',2,'','','91313249'),(111,'exampletesttt@gmail.com','tesst','testt testt','000123458',NULL,'rNwlBOPR6tfCm12',2,'','','04303249'),(134,'ex111ample@gmail.com','tesst','testt testt','000123458',NULL,'MRU_hyfK0iKhKq-',2,'','','9978451231'),(135,'exampl111e@gmail.com','tesst','testt testt','000123458',NULL,'VpMCCol0jwoxXH9',2,'','','822641123'),(136,'example125668@gmail.com','tesst','testt testt','000123458',NULL,'qhc3WFfrcm8LwFD',2,'','','19462623212'),(137,'example12566888@gmail.com','tesst','testt testt','000123458',NULL,'7eucmwxxIMJoI9l',2,'','','916144444444'),(138,'example1256688@gmail.com','tesst','testt testt','000123458',NULL,'tg99kvq2bMcheIU',2,'','','91644440444'),(139,'e11xample1256688@gmail.com','tesst','testt testt','000123458',NULL,'H4bnVRDrmAhbYW8',2,'','','4440444333'),(140,'e11xample125556688@gmail.com','tesst','testt testt','0001234528',NULL,'Lm46F3ZUNIKjOEl',2,'','','13995555555');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'app_ciis'
--
/*!50003 DROP PROCEDURE IF EXISTS `reportsReservationsByEvent` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`usuario`@`localhost` PROCEDURE `reportsReservationsByEvent`(IN idEvent int,IN statusList VARCHAR(10))
BEGIN

  -- Crear tabla temporal para almacenar los IDs
    CREATE TEMPORARY TABLE temp_ids (id INT);

    SET @insertQuery = CONCAT(
        'INSERT INTO temp_ids(id) VALUES ',
        '(', REPLACE(statusList, ',', '), ('), ');'
    );

    PREPARE stmt FROM @insertQuery;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

	SELECT 
    r.id_reservation,
    u.name_user,
    u.lastname_user,
    u.dni_user,
    u.phone_user,
    u.email_user,
	r.num_voucher,
    pta.price_attendee,
	CASE 
		WHEN enrollment_status=1 THEN 'Pendiente'
		WHEN enrollment_status=2 THEN 'Confirmado'
		WHEN enrollment_status=3 THEN 'Observado'
		ELSE 'Otros' END AS register_status,
	CASE 
		WHEN type_attendee_id=1 THEN 'Legado de ESIS'
		WHEN type_attendee_id=2 THEN 'Estudiante Externo'
		WHEN type_attendee_id=3 THEN 'Público en General'
		ELSE 'Otros'
	END AS type_attendee,
	r.created_at,
    r.updated_at,
	IF(au.responsible_user IS NULL, "Desconocido",au.responsible_user) AS responsible_user
	FROM reservations r
	INNER JOIN users u ON u.id_user=r.user_id
	INNER JOIN price_type_attendees pta ON r.price_type_attendee_id=pta.id_price_type_attendee
	LEFT JOIN (
		SELECT au.audit_id,au.record_id,au.action_date,CONCAT(name_user," ",lastname_user) AS responsible_user
		FROM (
			SELECT *
			FROM audit_logs
			WHERE audit_logs.table_name="reservation" AND (audit_logs.record_id,audit_logs.action_date) IN (
				SELECT record_id,MAX(action_date)
				FROM audit_logs
				GROUP BY record_id
			)
		) AS au 
		LEFT JOIN users u ON u.id_user = au.user_id
	) AS au ON r.id_reservation=au.record_id
WHERE r.event_id=idEvent AND r.enrollment_status IN(SELECT id FROM temp_ids);

 -- Eliminar la tabla temporal
    DROP TEMPORARY TABLE IF EXISTS temp_ids;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `reportsReservationsByEvent2` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`usuario`@`localhost` PROCEDURE `reportsReservationsByEvent2`(IN idEvent int,IN statusList VARCHAR(10))
BEGIN

  -- Crear tabla temporal para almacenar los IDs
    CREATE TEMPORARY TABLE temp_ids (id INT);

    SET @insertQuery = CONCAT(
        'INSERT INTO temp_ids(id) VALUES ',
        '(', REPLACE(statusList, ',', '), ('), ');'
    );

    PREPARE stmt FROM @insertQuery;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

	SELECT 
    r.id_reservation,
    u.name_user,
    u.lastname_user,
    u.dni_user,
    u.phone_user,
    u.email_user,
	r.num_voucher,
    pta.price_attendee,
	CASE 
		WHEN enrollment_status=1 THEN 'Pendiente'
		WHEN enrollment_status=2 THEN 'Confirmado'
		WHEN enrollment_status=3 THEN 'Observado'
		ELSE 'Otros' END AS register_status,
	CASE 
		WHEN type_attendee_id=1 THEN 'Legado de ESIS'
		WHEN type_attendee_id=2 THEN 'Estudiante Externo'
		WHEN type_attendee_id=3 THEN 'Público en General'
		ELSE 'Otros'
	END AS type_attendee,
	r.created_at,
    r.updated_at,
	IF(au.responsible_user IS NULL, "Desconocido",au.responsible_user) AS responsible_user
	FROM reservations r
	INNER JOIN users u ON u.id_user=r.user_id
	INNER JOIN price_type_attendees pta ON r.price_type_attendee_id=pta.id_price_type_attendee
	LEFT JOIN (
		SELECT au.audit_id,au.record_id,au.action_date,CONCAT(name_user," ",lastname_user) AS responsible_user
		FROM (
			SELECT *
			FROM audit_logs
			WHERE audit_logs.table_name="reservation" AND (audit_logs.record_id,audit_logs.action_date) IN (
				SELECT record_id,MAX(action_date)
				FROM audit_logs
				GROUP BY record_id
			)
		) AS au 
		LEFT JOIN users u ON u.id_user = au.user_id
	) AS au ON r.id_reservation=au.record_id
WHERE r.event_id=idEvent AND r.enrollment_status IN(SELECT id FROM temp_ids);

 -- Eliminar la tabla temporal
    DROP TEMPORARY TABLE IF EXISTS temp_ids;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-13 18:08:52
