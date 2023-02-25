-- Active: 1676295316858@@127.0.0.1@3306

DROP TABLE users;

DROP TABLE posts;

DROP TABLE likes_dislikes;

CREATE TABLE
    users(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL
    );

CREATE TABLE
    posts(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT (0) NOT NULL,
        dislikes INTEGER DEFAULT (0) NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    likes_dislikes(
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

INSERT INTO
    users (id, name, email, password, role)
VALUES (
        "c203ae44-5703-44b0-8197-1c0b6548f0db",
        "Gabriel",
        "gabi@labe.com",
        "Gg123456#",
        "ADMIN"
    ), (
        "85417967-ed8c-4ad8-8104-cc1448c49702",
        "Larissa",
        "lala@labe.com",
        "Ll123456#",
        "NORMAL"
    );

UPDATE users SET role = "ADMIN" WHERE id = ;

SELECT * FROM users;

SELECT * FROM posts;

SELECT * FROM likes_dislikes;