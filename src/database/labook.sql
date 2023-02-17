-- Active: 1676295316858@@127.0.0.1@3306
DROP TABLE users;
DROP TABLE posts;
DROP TABLE likes_dislikes;

CREATE TABLE users(
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

CREATE TABLE posts(
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  creator_id TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT (0) NOT NULL,
  dislikes INTEGER DEFAULT (0) NOT NULL,
  created_at TEXT DEFAULT (DATETIME()) NOT NULL,
  updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE likes_dislikes(
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  like INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

INSERT INTO users (id, name, email, password,role)
VALUES 
("U001", "Gabriel", "gabi@labe.com", "Gg123456#", "ADMIN"),
("U002", "Larissa", "lala@labe.com", "Ll123456#", "NORMAL");
INSERT INTO posts (id, creator_id, content)
VALUES 
("P001", "U001", "bhbkb"),
("P002", "U002", "bhbkb");
INSERT INTO likes_dislikes (user_id, post_id, like)
VALUES
("U001", "P002", 1),
("U002", "P001", 1);
UPDATE posts
SET likes = 1
WHERE id = "P001";
UPDATE posts
SET likes = 1
WHERE id = "P002";
SELECT * FROM users;
SELECT * FROM posts;