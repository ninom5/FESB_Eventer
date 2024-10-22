require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "rootuser",
  database: "FESB_Eventer",
});

client.connect().then(() => console.log("Connected to database"));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const salt = 10;

//Register endpoint, check if email and username already exist
app.post("/register", (req, res) => {
  const checkEmailQuery = `SELECT * FROM korisnici_role WHERE email = $1`;
  const checkUsernameQuery = `SELECT * FROM korisnici_role WHERE username = $1`;

  client.query(checkEmailQuery, [req.body.email], (error, result) => {
    if (error) {
      return res.send("Error");
    }

    if (result.rows.length > 0) {
      return res.send("Email already exists");
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.json("Passwords do not match");
    }

    // If email does not exist, check the username
    client.query(checkUsernameQuery, [req.body.username], (error, result) => {
      if (error) {
        return res.send("Error");
      }

      if (result.rows.length > 0) {
        return res.send("Username already exists");
      }

      // Both email and username are available, register the user
      const sql =
        "INSERT INTO korisnici_role (ime, prezime, username, email, sifra) VALUES ($1, $2, $3, $4, $5)";

      bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) {
          return res.json("Error hashing password");
        }

        const registerValues = [
          req.body.ime,
          req.body.prezime,
          req.body.username,
          req.body.email,
          hash,
        ];

        client.query(sql, registerValues, (error, result) => {
          if (error) {
            return res.send("Error");
          }

          res.send("Successfully registered");
        });
      });
    });
  });
});


//Login endpoint, check if user exists and compare passwords
app.post("/login", (req, res) => {
  const checkUserQuery = "SELECT * FROM korisnici_role WHERE username = $1";

  // Check if the user exists in the database
  client.query(checkUserQuery, [req.body.username], (error, result) => {
    if (error) {
      return res.json("Error");
    }

    if (result.rows.length === 0) {
      return res.json("Invalid username or password");
    }

    const user = result.rows[0];

    // Compare password with hashed password in the database
    bcrypt.compare(req.body.password, user.sifra.toString(), (err, isMatch) => {
      if (err) {
        return res.json("Error comparing passwords");
      }

      if (!isMatch) {
        return res.json("Invalid username or password");
      }

      // Generate JWT token
      const Accesstoken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.json({
        accessToken: Accesstoken,
      });
    });
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
