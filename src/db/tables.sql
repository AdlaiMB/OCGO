DROP TABLE IF EXISTS Users, Locations, Comments, Hours, Votes;
DROP TYPE IF EXISTS day, vote, category, city;

CREATE TYPE day
AS
ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

CREATE TYPE vote
AS
ENUM('upvote', 'downvote');

CREATE TYPE category
AS
ENUM('fast food', 'restaurant', 'aquarium', 'zoo', 'museum', 'library', 'park', 'public', 'government');

CREATE TYPE city 
AS
ENUM('aliso viejo', 'anaheim', 'brea', 'buena park', 'costa mesa', 'cypress', 'dana point', 'fountain valley', 'garden grove', 'huntington beach', 'irvine', 'la habra', 'la palma', 'laguna beach', 'laguna hills', 'laguna niguel', 'laguna woods', 'lake forest', 'los alamitos', 'mission viejo', 'newport beach', 'orange', 'placentia', 'rancho santa margarita', 'san clemente', 'san juan capistrano', 'santa ana', 'seal beach', 'stanton', 'tustin', 'villa park', 'westminster','yorba linda');

CREATE TABLE IF NOT EXISTS Users (
  user_id   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name      VARCHAR(15) UNIQUE NOT NULL,
  password  VARCHAR NOT NULL,
  bio       VARCHAR
);

CREATE TABLE IF NOT EXISTS Locations (
  location_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        VARCHAR NOT NULL,
  city        city NOT NULL,
  category    category NOT NULL,
  address     VARCHAR NOT NULL,
  url         VARCHAR,
  user_id     bigint REFERENCES Users (user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Comments (
  comment_id  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  comment     VARCHAR NOT NULL,
  upvotes     bigint,
  downvotes   bigint,
  user_id     bigint,
  location_id bigint NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE SET NULL,
  FOREIGN KEY (location_id) REFERENCES Locations (location_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS Hours (
  day         day NOT NULL,
  open        TIME NOT NULL,
  close       TIME NOT NULL,
  location_id bigint NOT NULL,
  FOREIGN KEY (location_id) REFERENCES Locations (location_id) ON DELETE RESTRICT,
  PRIMARY KEY (location_id, day)
);

CREATE TABLE IF NOT EXISTS Votes (
  vote        vote NOT NULL, 
  user_id     bigint NOT NULL,
  comment_id  bigint NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES Comments (comment_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, comment_id)
);