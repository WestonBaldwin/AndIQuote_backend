const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());

const db = new sqlite3.Database("./database.db");

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);
});

app.post("/users", (req, res) => {
  const { username, email } = req.body;

  db.run(
    "INSERT INTO users(username,email) VALUES (?,?)",
    [username, email],
    function (err) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.json({ id: this.lastID });
    }
  );
});

app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.json(rows);
  });
});