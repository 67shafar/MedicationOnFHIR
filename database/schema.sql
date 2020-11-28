CREATE DATABASE IF NOT EXISTS data;

USE data;

CREATE TABLE IF NOT EXISTS question(
    loinc VARCHAR(255) PRIMARY KEY,
    display TEXT NOT NULL
);

INSERT INTO question VALUES
 ("69671-6", "Stomach pain"),
 ("69672-4", "Back pain"),
 ("69673-2", "Pain in your arms, legs, or joints (knees, hips, etc.)"),
 ("69674-0", "Menstrual cramps or other problems with your periods"),
 ("69717-7", "Pain or problems during sexual intercourse"),
 ("69675-7", "Headaches"),
 ("69676-5", "Chest pain"),
 ("69677-3", "Dizziness"),
 ("69678-1", "Fainting spells"),
 ("69679-9", "Feeling your heart pound or race"),
 ("69680-7", "Shortness of breath"),
 ("69681-5", "Constipation, loose bowels, or diarrhea"),
 ("69682-3", "Nausea, gas, or indigestion"),
 ("69731-8", "Feeling tired or having low energy"),
 ("69732-6", "Trouble sleeping");

CREATE TABLE IF NOT EXISTS answer(
    answer_id INT AUTO_INCREMENT PRIMARY KEY,
    loinc VARCHAR(255),
    display TEXT NOT NULL,
    display_order INT NOT NULL,
    quality ENUM('good', 'bad', 'neutral') NOT NULL DEFAULT "neutral"
);

INSERT INTO answer VALUES
    (1,"69671-6", "Not bothered", 10, 'good'),
    (2,"69672-4", "Not bothered", 10, 'good'),
    (3,"69673-2", "Not bothered", 10, 'good'),
    (4,"69674-0", "Not bothered", 10, 'good'),
    (5,"69717-7", "Not bothered", 10, 'good'),
    (6,"69675-7", "Not bothered", 10, 'good'),
    (7,"69676-5", "Not bothered", 10, 'good'),
    (8,"69677-3", "Not bothered", 10, 'good'),
    (9,"69678-1", "Not bothered", 10, 'good'),
    (10,"69679-9", "Not bothered", 10, 'good'),
    (11,"69680-7", "Not bothered", 10, 'good'),
    (12,"69681-5", "Not bothered", 10, 'good'),
    (13,"69682-3", "Not bothered", 10, 'good'),
    (14,"69731-8", "Not bothered", 10, 'good'),
    (15,"69732-6", "Not bothered", 10, 'good'),
    (16,"69671-6", "Bothered a little", 20, 'bad'),
    (17,"69672-4", "Bothered a little", 20, 'bad'),
    (18,"69673-2", "Bothered a little", 20, 'bad'),
    (19,"69674-0", "Bothered a little", 20, 'bad'),
    (20,"69717-7", "Bothered a little", 20, 'bad'),
    (21,"69675-7", "Bothered a little", 20, 'bad'),
    (22,"69676-5", "Bothered a little", 20, 'bad'),
    (23,"69677-3", "Bothered a little", 20, 'bad'),
    (24,"69678-1", "Bothered a little", 20, 'bad'),
    (25,"69679-9", "Bothered a little", 20, 'bad'),
    (26,"69680-7", "Bothered a little", 20, 'bad'),
    (27,"69681-5", "Bothered a little", 20, 'bad'),
    (28,"69682-3", "Bothered a little", 20, 'bad'),
    (29,"69731-8", "Bothered a little", 20, 'bad'),
    (30,"69732-6", "Bothered a little", 20, 'bad'),
    (31,"69671-6", "Bothered a lot", 30, 'bad'),
    (32,"69672-4", "Bothered a lot", 30, 'bad'),
    (33,"69673-2", "Bothered a lot", 30, 'bad'),
    (34,"69674-0", "Bothered a lot", 30, 'bad'),
    (35,"69717-7", "Bothered a lot", 30, 'bad'),
    (36,"69675-7", "Bothered a lot", 30, 'bad'),
    (37,"69676-5", "Bothered a lot", 30, 'bad'),
    (38,"69677-3", "Bothered a lot", 30, 'bad'),
    (39,"69678-1", "Bothered a lot", 30, 'bad'),
    (40,"69679-9", "Bothered a lot", 30, 'bad'),
    (41,"69680-7", "Bothered a lot", 30, 'bad'),
    (42,"69681-5", "Bothered a lot", 30, 'bad'),
    (43,"69682-3", "Bothered a lot", 30, 'bad'),
    (44,"69731-8", "Bothered a lot", 30, 'bad'),
    (45,"69732-6", "Bothered a lot", 30, 'bad');

CREATE TABLE IF NOT EXISTS patient_question(
    patient_id VARCHAR(255) NOT NULL,
    loinc VARCHAR(255) NOT NULL,
    PRIMARY KEY (patient_id, loinc)
);

INSERT INTO patient_question VALUES
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', '69671-6'),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', '69671-4');

CREATE TABLE IF NOT EXISTS patient_answer(
    patient_id VARCHAR(255) NOT NULL,
    answer_id INT NOT NULL,
    loinc VARCHAR(255) NOT NULL,
    answer_date VARCHAR(255) NOT NULL,
    PRIMARY KEY (patient_id, loinc, answer_id, answer_date)
);

INSERT INTO patient_answer VALUES
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 1, '69671-6', DATE_SUB(NOW(), INTERVAL 34 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 2, '69671-4', DATE_SUB(NOW(), INTERVAL 34 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 16, '69671-6', DATE_SUB(NOW(), INTERVAL 33 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 33 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 1, '69671-6', DATE_SUB(NOW(), INTERVAL 32 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 32 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 16, '69671-6', DATE_SUB(NOW(), INTERVAL 31 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 2, '69671-4', DATE_SUB(NOW(), INTERVAL 31 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 1, '69671-6', DATE_SUB(NOW(), INTERVAL 30 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 30 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 1, '69671-6', DATE_SUB(NOW(), INTERVAL 29 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 29 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 16, '69671-6', DATE_SUB(NOW(), INTERVAL 28 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 2, '69671-4', DATE_SUB(NOW(), INTERVAL 28 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 16, '69671-6', DATE_SUB(NOW(), INTERVAL 27 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 27 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 31, '69671-6', DATE_SUB(NOW(), INTERVAL 26 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 2, '69671-4', DATE_SUB(NOW(), INTERVAL 26 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 31, '69671-6', DATE_SUB(NOW(), INTERVAL 25 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 32, '69671-4', DATE_SUB(NOW(), INTERVAL 25 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 31, '69671-6', DATE_SUB(NOW(), INTERVAL 24 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 2, '69671-4', DATE_SUB(NOW(), INTERVAL 24 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 16, '69671-6', DATE_SUB(NOW(), INTERVAL 23 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 23 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 16, '69671-6', DATE_SUB(NOW(), INTERVAL 22 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 22 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 16, '69671-6', DATE_SUB(NOW(), INTERVAL 21 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 21 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 16, '69671-6', DATE_SUB(NOW(), INTERVAL 20 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 20 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 1, '69671-6', DATE_SUB(NOW(), INTERVAL 19 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 2, '69671-4', DATE_SUB(NOW(), INTERVAL 19 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 1, '69671-6', DATE_SUB(NOW(), INTERVAL 18 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 2, '69671-4', DATE_SUB(NOW(), INTERVAL 18 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 1, '69671-6', DATE_SUB(NOW(), INTERVAL 17 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 2, '69671-4', DATE_SUB(NOW(), INTERVAL 17 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 1, '69671-6', DATE_SUB(NOW(), INTERVAL 16 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 2, '69671-4', DATE_SUB(NOW(), INTERVAL 16 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 16, '69671-6', DATE_SUB(NOW(), INTERVAL 15 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 15 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 1, '69671-6',  DATE_SUB(NOW(), INTERVAL 14 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 14 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 16, '69671-6', DATE_SUB(NOW(), INTERVAL 13 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 2, '69671-4',  DATE_SUB(NOW(), INTERVAL 13 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 1, '69671-6',  DATE_SUB(NOW(), INTERVAL 12 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 12 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 1, '69671-6',  DATE_SUB(NOW(), INTERVAL 11 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 11 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 16, '69671-6', DATE_SUB(NOW(), INTERVAL 10 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 2, '69671-4',  DATE_SUB(NOW(), INTERVAL 10 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 16, '69671-6', DATE_SUB(NOW(), INTERVAL 9 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 9 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 31, '69671-6', DATE_SUB(NOW(), INTERVAL 8 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 2, '69671-4',  DATE_SUB(NOW(), INTERVAL 8 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 31, '69671-6', DATE_SUB(NOW(), INTERVAL 7 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 32, '69671-4', DATE_SUB(NOW(), INTERVAL 7 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 16, '69671-6', DATE_SUB(NOW(), INTERVAL 6 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 6 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 16, '69671-6', DATE_SUB(NOW(), INTERVAL 5 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 5 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 16, '69671-6', DATE_SUB(NOW(), INTERVAL 4 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 4 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 16, '69671-6', DATE_SUB(NOW(), INTERVAL 3 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 17, '69671-4', DATE_SUB(NOW(), INTERVAL 3 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 1, '69671-6', DATE_SUB(NOW(), INTERVAL 2 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 2, '69671-4', DATE_SUB(NOW(), INTERVAL 2 DAY)),

    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 1, '69671-6', DATE_SUB(NOW(), INTERVAL 1 DAY)),
    ('87a339d0-8cae-418e-89c7-8651e6aab3c6', 2, '69671-4', DATE_SUB(NOW(), INTERVAL 1 DAY));
