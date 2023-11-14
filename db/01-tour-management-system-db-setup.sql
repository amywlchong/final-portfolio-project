DROP DATABASE IF EXISTS `tour_management_system`;
CREATE DATABASE `tour_management_system`;
USE `tour_management_system`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `tours`;
DROP TABLE IF EXISTS `tour_images`;
DROP TABLE IF EXISTS `start_dates`;
DROP TABLE IF EXISTS `tour_start_dates`;
DROP TABLE IF EXISTS `points_of_interest`;
DROP TABLE IF EXISTS `tour_points_of_interest`;
DROP TABLE IF EXISTS `tour_guide_schedules`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `reviews`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users(
  id INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash CHAR(60) NOT NULL,
  password_changed_date BIGINT NOT NULL,
  `active` BOOLEAN NOT NULL DEFAULT TRUE,
  role ENUM('ROLE_CUSTOMER', 'ROLE_GUIDE', 'ROLE_LEAD_GUIDE', 'ROLE_ADMIN') NOT NULL,
  signup_date DATE DEFAULT (CURRENT_DATE),
  PRIMARY KEY(id)
);

CREATE TABLE tours(
  id INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL UNIQUE,
  duration TINYINT NOT NULL,
  max_group_size TINYINT NOT NULL,
  difficulty ENUM('easy', 'medium', 'difficult') NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  summary VARCHAR(255) NOT NULL,
  `description` VARCHAR(4000),
  region VARCHAR(45) NOT NULL,
  start_address VARCHAR(255) NOT NULL,
  created_date DATE DEFAULT (CURRENT_DATE),
  ratings_count INT NOT NULL DEFAULT 0,
  ratings_average DECIMAL(3,2) DEFAULT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE tour_images(
  id INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  is_cover BOOLEAN DEFAULT FALSE,
  tour_id INT NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE start_dates(
id INT NOT NULL AUTO_INCREMENT, 
start_date_time DATETIME NOT NULL UNIQUE,
  PRIMARY KEY(id)
);

CREATE TABLE tour_start_dates(
tour_id INT NOT NULL, start_date_id INT NOT NULL,
  PRIMARY KEY(tour_id, start_date_id)
);

CREATE TABLE points_of_interest(
  id INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL UNIQUE,
  `description` VARCHAR(255) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE tour_points_of_interest(
  id INT NOT NULL AUTO_INCREMENT,
  `day` TINYINT,
  tour_id INT NOT NULL,
  point_of_interest_id INT NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE tour_guide_schedules(
  id INT NOT NULL AUTO_INCREMENT,
  tour_id INT NOT NULL,
  user_id INT NOT NULL,
  start_date_id INT NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE bookings(
  id INT NOT NULL AUTO_INCREMENT,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  paid BOOLEAN NOT NULL DEFAULT FALSE,
  `transaction_id` VARCHAR(255), 
  number_of_participants SMALLINT NOT NULL,
  created_date DATE NOT NULL DEFAULT (CURRENT_DATE),
  user_id INT NOT NULL,
  tour_id INT NOT NULL,
  start_date_id INT NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE reviews(
  id INT NOT NULL AUTO_INCREMENT,
  review VARCHAR(2000),
  rating TINYINT NOT NULL,
  created_date DATE NOT NULL DEFAULT (CURRENT_DATE),
  booking_id INT NOT NULL UNIQUE,
  PRIMARY KEY(id)
);

ALTER TABLE tour_images
ADD UNIQUE (tour_id, `name`);

ALTER TABLE tour_images
ADD cover_for_tour INT GENERATED ALWAYS AS (CASE WHEN is_cover THEN tour_id END),
ADD UNIQUE (cover_for_tour);

ALTER TABLE tour_images
  ADD CONSTRAINT tour_image
    FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE No action
      ON UPDATE No action;

ALTER TABLE tour_start_dates
  ADD CONSTRAINT tour_tour_start_date
    FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE No action
      ON UPDATE No action;

ALTER TABLE tour_start_dates
  ADD CONSTRAINT start_date_tour_start_date
    FOREIGN KEY (start_date_id) REFERENCES start_dates (id) ON DELETE No action
      ON UPDATE No action;

ALTER TABLE tour_points_of_interest
ADD UNIQUE (tour_id, point_of_interest_id);

ALTER TABLE tour_points_of_interest
  ADD CONSTRAINT tour_tour_point_of_interest
    FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE No action
      ON UPDATE No action;

ALTER TABLE tour_points_of_interest
  ADD CONSTRAINT point_of_interest_tour_point_of_interest
    FOREIGN KEY (point_of_interest_id) REFERENCES points_of_interest (id)
      ON DELETE No action ON UPDATE No action;

ALTER TABLE tour_guide_schedules
ADD UNIQUE (user_id, start_date_id);

ALTER TABLE tour_guide_schedules
  ADD CONSTRAINT tour_start_date_tour_guide_schedule
    FOREIGN KEY (tour_id, start_date_id)
      REFERENCES tour_start_dates (tour_id, start_date_id) ON DELETE No action
      ON UPDATE No action;

ALTER TABLE tour_guide_schedules
  ADD CONSTRAINT user_tour_guide_schedule
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE No action
      ON UPDATE No action;

ALTER TABLE bookings
ADD UNIQUE (user_id, start_date_id);

ALTER TABLE bookings
  ADD CONSTRAINT tour_start_date_booking
    FOREIGN KEY (tour_id, start_date_id)
      REFERENCES tour_start_dates (tour_id, start_date_id) ON DELETE No action
      ON UPDATE No action;

ALTER TABLE bookings
  ADD CONSTRAINT user_booking
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE No action
      ON UPDATE No action;

ALTER TABLE reviews
  ADD CONSTRAINT booking_review
    FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE No action
      ON UPDATE No action;
