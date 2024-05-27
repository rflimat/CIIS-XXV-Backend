CREATE TABLE `sponsors`(
    `id_sponsor` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name_sponsor` VARCHAR(255) NOT NULL,
    `dir_img_sponsor` VARCHAR(255) NOT NULL,
    `event_id` int,
    FOREIGN KEY (`event_id`) REFERENCES `events`(`id_event`)
);