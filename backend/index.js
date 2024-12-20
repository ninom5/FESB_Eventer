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
      if (req.body.username.toString().includes("@")) {
        return res.send("username contains @");
      }
      if (req.body.password.toString().length < 8)
        return res.send("password < 8");
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
  const { input, password } = req.body;

  //checking is email entered or username
  const isEmail = input.includes("@");

  const checkUserQuery = `SELECT * FROM korisnici_role WHERE ${
    isEmail ? "email" : "username"
  } = $1`;

  // Check if the user exists in the database
  client.query(checkUserQuery, [input], (error, result) => {
    if (error) {
      return res.json("Error");
    }

    if (result.rows.length === 0) {
      return res.json("Invalid usernameemail or password");
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

app.post("/delete", async (req, res) => {
  //radi, triba frontend napravit
  const email = req.body.email;
  const password = req.body.password;

  const checkUserQuery = "SELECT * FROM korisnici_role WHERE email = $1";
  const getIdQuery = "SELECT korisnik_id FROM korisnici_role WHERE email = $1";

  try {
    const result = await client.query(checkUserQuery, [email]);
    const user = result.rows[0];
    if (!user) {
      return res.json("Invalid username or password");
    }

    const isMatch = await bcrypt.compare(password, user.sifra.toString());
    if (!isMatch) {
      return res.json("Invalid username or password");
    }

    const idRes = await client.query(getIdQuery, [email]);
    const korisnikId = idRes.rows[0]?.korisnik_id; //u slucaju da je null postavice ga na null umisto da throwa error

    if (!korisnikId) {
      return res.json("No id"); //napravit sta ce se dogodit za ovaj response
    }
    const deleteQuery = [
      {
        query:
          "DELETE FROM veze_korisnici_role WHERE korisnik_id = $1 OR korisnik_id1 = $1",
        values: [korisnikId],
      },
      {
        query: "DELETE FROM dogadaji WHERE korisnik_id = $1",
        values: [korisnikId],
      },
      {
        query: "DELETE FROM app_sesije WHERE korisnik_id = $1",
        values: [korisnikId],
      },
      {
        query: "DELETE FROM korisnici_role WHERE korisnik_id = $1",
        values: [korisnikId],
      },
    ]; //niz s upitima za izbrisat korisnika iz svake tablice

    await client.query("BEGIN"); //zapocinjemo sa slanjem upitima ovo nam sluzi kako se nebi brisali parcijalno podaci iz baze u slucaju greske

    for (const { query, values } of deleteQuery) {
      await client.query(query, values);
    }

    await client.query("COMMIT"); //zavrsavamo s upitima za brisanje

    return res.json("Account deleted successfully"); //response...
  } catch (error) {
    await client.query("ROLLBACK"); // ponistavamo ako smo izbrisali samo dio podataka
    console.error("Error", error);
    return res.json("Server error while deleting account");
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
