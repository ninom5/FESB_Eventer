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

app.post("/createEvent", (req, res) => {
  const eventData = req.body;

  try {
    const cityCheckQuery = `SELECT * FROM MJESTA WHERE Naziv = $1`;
    client.query(cityCheckQuery, [eventData.mjesto_name], (error, result) => {
      if (error) return res.status(500).send("Error checking city");

      if (result.rows.length === 0) return res.send("Cities not found");

      eventData.mjesto_id = result.rows[0].mjesto_id;

      eventData.Naziv = req.body.Naziv;

      eventData.vrijeme = parseDate(req.body.date, req.body.vrijeme);
      function parseDate(date, time) {
        return new Date(`${date}T${time}`).toISOString();
      }

      eventData.opis = req.body.opis;
      eventData.korisnik_id = req.body.korisnik_id;
      eventData.created_by = req.body.korisnik_id;
      eventData.date_created = Date.now();
    });

    const newEventQuery = `INSERT INTO dogadaji (naziv, vrijeme, opis, korisnik_id, mjesto_id, created_by, date_created) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;

    client.query(
      newEventQuery,
      [
        eventData.Naziv,
        eventData.vrijeme,
        eventData.opis,
        eventData.korisnik_id,
        eventData.mjesto_id,
        eventData.created_by,
        eventData.date_created,
      ],
      (error, result) => {
        if (error) return res.status(500).send("Error inserting event");

        return res.send("New event created successfully");
      }
    );
  } catch (error) {
    return res.status(500).send("Error inserting event");
  }
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

      // Proceed with updating the user data if the city is valid
      updateUser();
    });
  } else {
    // If no city provided, proceed without updating the city field
    updateUser();
  }

  if (telefon)
    //neradi spremanje u bazu bez leading spacesa
    validateAndUpdateUser();
  function validateAndUpdateUser() {
    const userTelephoneInput = telefon.trim();

    if (
      userTelephoneInput.replace(/\s/g, "").length < 9 ||
      userTelephoneInput.replace(/\s/g, "").length > 15 ||
      !/^\+?[\d\s]+$/.test(userTelephoneInput)
    ) {
      return res.status(400).send("Invalid telephone number");
    }

    req.body.telefon = userTelephoneInput;

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
      telefon || null,
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

app.post("/search", async (req, res) => {
  const searchValue =
    req.body.searchValue.trim() !== "" ? `%${req.body.searchValue}%` : "%";

  const sqlUsers = `SELECT KR.IME, KR.PREZIME, 
                        CASE 
                          WHEN KR.TKORISNIKA = 'Kreator' THEN M.NAZIV || ', ' || KR.ULICA 
                          ELSE NULL 
                        END AS ADRESA 
                    FROM KORISNICI_ROLE KR
                    LEFT JOIN MJESTA M ON M.MJESTO_ID = KR.MJESTO_ID
                    WHERE KR.IME ILIKE $1 OR KR.PREZIME ILIKE $1`;

  const sqlEvents = `SELECT KR.IME || ' ' ||KR.PREZIME IME, D.NAZIV, M.NAZIV || ', ' || U.NAZIV ADRESA 
                      FROM DOGADAJI D
                      LEFT JOIN KORISNICI_ROLE KR ON KR.KORISNIK_ID = D.KORISNIK_ID
                      LEFT JOIN MJESTA M ON M.MJESTO_ID = D.MJESTO_ID
                      LEFT JOIN ULICE U ON U.ULICA_ID = D.ULICA_ID
                      WHERE D.NAZIV ILIKE $1`;

  try {
    const [eventsResult, usersResult] = await Promise.all([
      client.query(sqlEvents, [searchValue]),
      client.query(sqlUsers, [searchValue]),
    ]);

    return res.json({
      events: eventsResult.rows,
      users: usersResult.rows,
    });
  } catch (err) {
    console.log(err);
  }
});
app.post("/mostActiveUsers", (req, res) => {
  const email = req.body.email;
  const sql = `SELECT KR.KORISNIK_ID, KR.IME, KR.PREZIME, 
                      KR.USERNAME, KR.EMAIL, KR.PICTURE_URL, KR.TKORISNIKA,
                      CASE 
                            WHEN KR.TKORISNIKA = 'Kreator' THEN 
                                (SELECT COUNT(DOG.DOGADAJ_ID) 
                                FROM DOGADAJI DOG
                                WHERE DOG.KORISNIK_ID = KR.KORISNIK_ID)
                            WHEN KR.TKORISNIKA = 'Korisnik' THEN 
                                (SELECT COUNT(VEKD.DOGADAJ_ID) 
                                FROM VEZE_KORISNICI_DOGADAJI VEKD
                                WHERE VEKD.KORISNIK_ID = KR.KORISNIK_ID)
                            ELSE 0
                        END AS BROJDOGADAJA,
                      (SELECT COALESCE(TO_CHAR(MIN(DOG.VRIJEME), 'DD.MM.YYYY HH24:MI'), 'No upcoming events') sljedeci
                        FROM DOGADAJI DOG
                        WHERE 
                            (EXISTS (
                                SELECT 1
                                FROM VEZE_KORISNICI_DOGADAJI VEKD
                                WHERE VEKD.KORISNIK_ID = KR.KORISNIK_ID AND VEKD.DOGADAJ_ID = DOG.DOGADAJ_ID
                            ) OR DOG.KORISNIK_ID = KR.KORISNIK_ID)  -- Provera ako postoji događaj za korisnika u DOGADAJI
                        AND DOG.VRIJEME >= CURRENT_DATE)
                    FROM korisnici_role KR
                    LEFT JOIN DOGADAJI D ON D.KORISNIK_ID = KR.KORISNIK_ID
                    WHERE KR.EMAIL != $1
                    GROUP BY KR.KORISNIK_ID, 
                        KR.IME, 
                        KR.PREZIME, 
                        KR.USERNAME, 
                        KR.EMAIL
                    ORDER BY COUNT(D.DOGADAJ_ID) DESC
                    LIMIT 5`;
  client.query(sql, [email], (error, result) => {
    if (error) {
      console.error("Error fetching most active users:", error);
      return res.status(500).send("Error fetching most active users");
    }
    return res.json(result.rows);
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
