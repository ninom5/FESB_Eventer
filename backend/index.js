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
        email: user.email,
      });
    });
  });
});

//Get user data endpoint
app.get("/user", (req, res) => {
  const email = req.query.email;

  const sql = `
    SELECT 
      kr.*,
      m.NAZIV AS mjesto_name
    FROM 
      KORISNICI_ROLE kr
    LEFT JOIN 
      MJESTA m ON kr.MJESTO_ID = m.MJESTO_ID
    WHERE 
      kr.email = $1
  `;
  client.query(sql, [email], (error, result) => {
    if (error) {
      console.error("Error fetching user data:", error);
      return res.status(500).send("Error fetching user data");
    }

    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json(result.rows[0]);
  });
});

// Update user data endpoint
app.put("/userUpdate", (req, res) => {
  const {
    email,
    ime,
    prezime,
    username,
    telefon,
    status_id,
    mjesto_name,
    ulica,
    picture_url,
  } = req.body;

  // Step 1: If the city is provided, check if it exists
  let cityId = null;
  if (mjesto_name) {
    const cityCheckQuery = `SELECT * FROM MJESTA WHERE Naziv = $1`;
    client.query(cityCheckQuery, [mjesto_name], (error, cityResult) => {
      if (error) {
        console.error("Error checking city:", error);
        return res.status(500).send("Error checking city");
      }

      if (cityResult.rows.length === 0) {
        return res.status(400).send("Invalid city name");
      }

      cityId = cityResult.rows[0].mjesto_id;

      // Step 2: Proceed with updating the user data if the city is valid
      updateUser();
    });
  } else {
    // If no city provided, proceed without updating the city field
    updateUser();
  }

  function updateUser() {
    const updateQuery = `
      UPDATE KORISNICI_ROLE
      SET ime = $1, prezime = $2, username = $3, telefon = $4, status_id = $5,
          mjesto_id = $6, ulica = $7, picture_url = $8, 
          modified_by = CURRENT_USER, date_modified = CURRENT_TIMESTAMP
      WHERE email = $9
    `;

    const values = [
      ime,
      prezime,
      username,
      telefon,
      status_id,
      cityId || null, // Use cityId if provided, else null
      ulica,
      picture_url,
      email,
    ];

    client.query(updateQuery, values, (error, result) => {
      if (error) {
        console.error("Error updating user:", error);
        return res.status(500).send("Error updating user data");
      }

      if (result.rowCount === 0) {
        return res.status(404).send("User not found");
      }

      res.send("User profile updated successfully");
    });
  }
});

// Endpoint to fetch cities
app.get("/cities", (req, res) => {
  const sql = "SELECT * FROM MJESTA";
  client.query(sql, (error, result) => {
    if (error) {
      console.error("Error fetching cities:", error);
      return res.status(500).send("Error fetching cities");
    }
    res.json(result.rows);
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
