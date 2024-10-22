require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");

const { Client } = require("pg");
const { hash } = require("bcrypt");

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

<<<<<<< HEAD
//register endpoint, check if email and username already exist
app.post("/register", (req, res) => {
  const checkEmailQuery = "SELECT * FROM korisnici_role WHERE email = $1";
  const checkUsernameQuery = "SELECT * FROM korisnici_role WHERE username = $1";
=======
const salt = 10;

//register endpoint, check if email and username already exist
app.post("/register", (req, res) => {
  const checkEmailQuery = `SELECT * FROM korisnici_role WHERE email = $1`;
  const checkUsernameQuery = `SELECT * FROM korisnici_role WHERE username = $1`;
>>>>>>> f54658128835589359d2c3d569f2bc43af9308e4

  client.query(checkEmailQuery, [req.body.email], (error, result) => {
    if (error) {
      return res.send("Error");
    }

    if (result.rows.length > 0) {
      return res.send("Email already exists");
    }
<<<<<<< HEAD
    if (req.body.password !== req.body.confirmPassword) {
      return res.send("Passwords do not match");
    }
    //If email does not exist, check the username
=======

    if (req.body.password !== req.body.confirmPassword) {
      return res.json("Passwords do not match");
    }

    // If email does not exist, check the username
>>>>>>> f54658128835589359d2c3d569f2bc43af9308e4
    client.query(checkUsernameQuery, [req.body.username], (error, result) => {
      if (error) {
        return res.send("Error");
      }

      if (result.rows.length > 0) {
        return res.send("Username already exists");
      }
<<<<<<< HEAD
      const sql =
        "INSERT INTO korisnici_role (ime, prezime, username, email, sifra) VALUES ($1, $2, $3, $4, $5)";

      const salt = 10;
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) return res.json("error hashing password");
=======

      // Both email and username are available, register the user
      const sql =
        "INSERT INTO korisnici_role (ime, prezime, username, email, sifra) VALUES ($1, $2, $3, $4, $5)";

      bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) {
          return res.json("Error hashing password");
        }
>>>>>>> f54658128835589359d2c3d569f2bc43af9308e4

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
<<<<<<< HEAD
// bcrypt.genSalt(salt, function(err, salt){
//   bcrypt.hash(req.body.password, salt, function(err, hash){
//     if(err)
//       res.send("problem with hashing");
//   });
// });

//Both email and username are available, register the user
=======
>>>>>>> f54658128835589359d2c3d569f2bc43af9308e4

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
