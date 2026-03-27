const express = require("express");
const db = require("./db");
const initSchema = require("./schema");

const app = express();
app.use(express.json());

initSchema();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.post("/users", (req, res) => {
  const { id, username, email } = req.body;

  db.run(
    "INSERT INTO users(id, username, email) VALUES (?, ?, ?)",
    [id, username, email],
    function (err) {
      if (err) {
        res.status(500).send(err.message);
        return;
      }

      res.json({ id });
    }
  );
});

app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }

    res.json(rows);
  });
});