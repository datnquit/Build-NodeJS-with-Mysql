CREATE TABLE IF NOT EXISTS `todo` (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  description varchar(255),
  published BOOLEAN DEFAULT false
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `users` (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  password varchar(255) NOT NULL,
  email varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;