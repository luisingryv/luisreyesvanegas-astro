-- Solo en local (Docker): base aparte para las pruebas de integración.
CREATE DATABASE IF NOT EXISTS luisreyes_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON luisreyes_test.* TO 'luisreyes'@'%';
FLUSH PRIVILEGES;
