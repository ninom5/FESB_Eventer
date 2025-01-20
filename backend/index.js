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
      if (error) return res.send("Error");

      if (result.rows.length > 0) return res.send("Username already exists");

      if (req.body.username.toString().includes("@"))
        return res.send("username contains @");

      // Both email and username are available, register the user
      const sql = `
        INSERT INTO korisnici_role (ime, prezime, username, email, sifra, tkorisnika)
        VALUES ($1, $2, $3, $4, $5, 'user')
      `;

      bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json("Error hashing password");

        const registerValues = [
          req.body.ime,
          req.body.prezime,
          req.body.username,
          req.body.email,
          hash,
        ];

        client.query(sql, registerValues, (error, result) => {
          if (error) return res.send("Error");

          res.send("Successfully registered");
        });
      });
    });
  });
});

app.post("/login", (req, res) => {
  const { input, password } = req.body;

  const isEmail = input.includes("@");
  const checkUserQuery = `SELECT * FROM korisnici_role WHERE ${
    isEmail ? "email" : "username"
  } = $1`;

  client.query(checkUserQuery, [input], (error, result) => {
    if (error) return res.json("Error");

    if (result.rows.length === 0)
      return res.json("Invalid username or password");

    const user = result.rows[0];
    bcrypt.compare(req.body.password, user.sifra.toString(), (err, isMatch) => {
      if (err) return res.json("Error comparing passwords");

      if (!isMatch) return res.json("Invalid username or password");

      // Generate JWT token
      const Accesstoken = jwt.sign(
        {
          username: user.username,
          role: user.tkorisnika,
          userId: user.korisnik_id,
        },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.json({
        accessToken: Accesstoken,
        email: user.email,
        role: user.tkorisnika,
        userId: user.korisnik_id,
      });
    });
  });
});

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

    if (result.rows.length === 0) return res.status(404).send("User not found");

    res.json(result.rows[0]);
  });
});

app.post("/createEvent", async (req, res) => {
  try {
    const {
      eventName,
      city,
      date,
      startTime,
      description,
      userId,
      street,
      longitude,
      latitude,
    } = req.body;

    if (!eventName || !city || !date || !startTime || !description || !userId)
      return res.status(400).send("Missing required fields.");

    const eventDateTime = new Date(`${date}T${startTime}`);
    const now = new Date();
    if (eventDateTime <= now) {
      return res.status(400).send("Invalid date/time (cannot be in the past).");
    }

    const descriptionTrim = description.trim().replace(/\s+/g, "");
    if (descriptionTrim.length < 10) {
      return res
        .status(400)
        .send("Description is too short (min. 10 characters ignoring spaces).");
    }

    let mjesto_id;
    const findMjestoSQL = "SELECT mjesto_id FROM mjesta WHERE naziv = $1";
    let result = await client.query(findMjestoSQL, [city]);

    if (result.rows.length > 0) {
      mjesto_id = result.rows[0].mjesto_id;
    } else {
      const insertMjestoSQL = `
        INSERT INTO mjesta (naziv)
        VALUES ($1)
        RETURNING mjesto_id
      `;
      result = await client.query(insertMjestoSQL, [city]);
      mjesto_id = result.rows[0].mjesto_id;
    }

    const insertEventQuery = `
      INSERT INTO dogadaji (
        naziv,
        vrijeme,
        opis,
        korisnik_id,
        status_id,
        mjesto_id,
        ulica,
        longitude,
        latitude,
        created_by
      )
      VALUES ($1, $2, $3, $4, 1, $5, $6, $7, $8, $9)
    `;

    const eventValues = [
      eventName,
      eventDateTime.toISOString(),
      description,
      userId,
      mjesto_id,
      street,
      longitude,
      latitude,
      userId,
    ];

    await client.query(insertEventQuery, eventValues);

    return res.send("Event inserted successfully.");
  } catch (error) {
    console.error("Error in /createEvent:", error);
    return res.status(500).send("An error occurred while creating the event.");
  }
});

app.get("/checkUsername", async (req, res) => {
  const { username } = req.query;

  const checkUserNameSql = "SELECT * FROM korisnici_role WHERE username = $1";
  try {
    const responseResult = await client.query(checkUserNameSql, [username]);
    if (responseResult.rowCount > 0)
      return res.json("Username already exists.");

    return res.json("Valid username");
  } catch (error) {
    console.error(err);
    res.json("error checking username");
  }
});

app.put("/userUpdate", (req, res) => {
  const {
    email,
    ime,
    prezime,
    username,
    telefon,
    mjesto_name,
    ulica,
    picture_url,
  } = req.body;

  let cityId = null;
  let newTelefon = null;

  if (telefon) {
    const trimmedTelefon = telefon.trim().split(" ").join("");
    if (
      trimmedTelefon.length < 9 ||
      trimmedTelefon.length > 15 ||
      !/^\+?[\d\s]+$/.test(trimmedTelefon)
    ) {
      return res.status(400).send("Invalid telephone number");
    }
    newTelefon = trimmedTelefon;
  }

  if (mjesto_name) {
    const cityCheckQuery = `SELECT * FROM MJESTA WHERE Naziv = $1`;
    client.query(cityCheckQuery, [mjesto_name], (error, cityResult) => {
      if (error) {
        console.error("Error checking city:", error);
        return res.status(500).send("Error checking city");
      }

      if (cityResult.rows.length === 0)
        return res.status(400).send("Invalid city name");

      cityId = cityResult.rows[0].mjesto_id;
      updateUser();
    });
  } else {
    updateUser();
  }

  function updateUser() {
    const updateQuery = `
      UPDATE KORISNICI_ROLE
      SET ime = $1, prezime = $2, username = $3, telefon = $4,
          mjesto_id = $5, ulica = $6, picture_url = $7, 
          modified_by = CURRENT_USER, date_modified = CURRENT_TIMESTAMP
      WHERE email = $8
    `;
    const values = [
      ime,
      prezime,
      username,
      newTelefon || null,
      cityId || null,
      ulica,
      picture_url,
      email,
    ];

    client.query(updateQuery, values, (error, result) => {
      if (error) {
        console.error("Error updating user:", error);
        return res.status(500).send("Error updating user data");
      }

      if (result.rowCount === 0) return res.status(404).send("User not found");

      res.send("User profile updated successfully");
    });
  }
});

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

  const sqlUsers = `
    SELECT 
      TRIM(KR.IME) || ' ' || TRIM(KR.PREZIME) AS NAZIV, 
      CASE 
        WHEN KR.TKORISNIKA = 'user' THEN M.NAZIV || ', ' || KR.ULICA 
        ELSE NULL 
      END AS ADRESA,
      KR.EMAIL
    FROM KORISNICI_ROLE KR
    LEFT JOIN MJESTA M ON M.MJESTO_ID = KR.MJESTO_ID
    WHERE (TRIM(KR.IME) || ' ' || TRIM(KR.PREZIME)) ILIKE $1
  `;

  const sqlEvents = `
    SELECT  D.DOGADAJ_ID,
      D.NAZIV,
      TO_CHAR(D.VRIJEME, 'DD FMMonth, YYYY HH24:MI') as VRIJEME,
      D.BROJ_POSJETITELJA,
      D.OPIS,
      D.ULICA|| ', ' || M.NAZIV AS ADRESA,
      D.LATITUDE,        
      D.LONGITUDE,
      D.KORISNIK_ID,
	    K.IME || ' ' || K.PREZIME AS KORISNIK,
      K.ULICA|| ', ' || M1.NAZIV AS ADRESA_KORISNIKA,
      S.NAZIV AS STATUS
    FROM DOGADAJI D
    LEFT JOIN KORISNICI_ROLE KR ON KR.KORISNIK_ID = D.KORISNIK_ID
    LEFT JOIN MJESTA M ON M.MJESTO_ID = D.MJESTO_ID
    LEFT JOIN STATUSI S ON D.STATUS_ID = S.STATUS_ID
    LEFT JOIN KORISNICI_ROLE K ON D.KORISNIK_ID = K.KORISNIK_ID
    LEFT JOIN MJESTA M1 ON M1.MJESTO_ID = K.MJESTO_ID
    WHERE D.NAZIV ILIKE $1 OR (K.IME || ' ' || K.PREZIME) ILIKE $1
  `;

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
    return res.status(500).send("Error performing search");
  }
});

app.post("/mostActiveUsers", (req, res) => {
  const email = req.body.email;
  const sql = `
    SELECT KR.KORISNIK_ID,
           KR.IME,
           KR.PREZIME,
           KR.USERNAME,
           KR.EMAIL,
           KR.PICTURE_URL,
           KR.TKORISNIKA,
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
           (SELECT COALESCE(TO_CHAR(MIN(DOG.VRIJEME), 'DD.MM.YYYY HH24:MI'), 'No upcoming events')
            FROM DOGADAJI DOG
            WHERE 
              (EXISTS (
                SELECT 1
                FROM VEZE_KORISNICI_DOGADAJI VEKD
                WHERE VEKD.KORISNIK_ID = KR.KORISNIK_ID 
                  AND VEKD.DOGADAJ_ID = DOG.DOGADAJ_ID
              ) 
              OR DOG.KORISNIK_ID = KR.KORISNIK_ID)
              AND DOG.VRIJEME >= CURRENT_DATE
           ) AS sljedeci
    FROM korisnici_role KR
    LEFT JOIN DOGADAJI D ON D.KORISNIK_ID = KR.KORISNIK_ID
    WHERE KR.EMAIL != $1
    GROUP BY KR.KORISNIK_ID, 
             KR.IME, 
             KR.PREZIME, 
             KR.USERNAME, 
             KR.EMAIL
    ORDER BY COUNT(D.DOGADAJ_ID) DESC
LIMIT 3
  `;
  client.query(sql, [email], (error, result) => {
    if (error) {
      console.error("Error fetching most active users:", error);
      return res.status(500).send("Error fetching most active users");
    }

    return res.json(result.rows);
  });
});

app.get("/events", async (req, res) => {
  const korisnik_id = req.query.korisnik_id;

  if (!korisnik_id || isNaN(korisnik_id)) {
    return res.send("Invalid or missing user id");
  }

  const sql = `
    SELECT 
      D.DOGADAJ_ID,
      D.NAZIV,
      D.VRIJEME,
      D.OPIS,
      D.KORISNIK_ID,
      D.MJESTO_ID,
      D.ULICA,
      D.CREATED_BY,
      D.LATITUDE,        
      D.LONGITUDE,       
      M.NAZIV AS MJESTO_NAME
    FROM 
      DOGADAJI D
    LEFT JOIN 
      MJESTA M ON D.MJESTO_ID = M.MJESTO_ID
    WHERE 
      D.KORISNIK_ID = $1
  `;
  try {
    const result = await client.query(sql, [korisnik_id]);
    res.json(result.rows);
  } catch (error) {
    console.error("error fetching events: " + error);
  }
});

app.post("/allEvents", async (req, res) => {
  const email = req.body.email;

  try {
    const sqlUserId = "SELECT KORISNIK_ID FROM KORISNICI_ROLE WHERE EMAIL = $1";
    const resUserId = await client.query(sqlUserId, [email]);

    if (resUserId.rows.length === 0) {
      return res.status(404).send("User not found");
    }

    const korisnik_id = resUserId.rows[0].korisnik_id;

    const sql = `
    SELECT 
      D.DOGADAJ_ID,
      D.NAZIV,
      TO_CHAR(D.VRIJEME, 'DD FMMonth, YYYY HH24:MI') as VRIJEME,
      D.BROJ_POSJETITELJA,
      D.OPIS,
      D.ULICA|| ', ' || M.NAZIV AS ADRESA,
      D.LATITUDE,        
      D.LONGITUDE,
      D.KORISNIK_ID,
	    K.IME || ' ' || K.PREZIME AS KORISNIK,
      K.ULICA|| ', ' || M1.NAZIV AS ADRESA_KORISNIKA,
      S.NAZIV AS STATUS,
	  CASE 
        WHEN VKD.VKD_ID IS NULL THEN false
        ELSE true
    END AS DOLAZI
    FROM 
      DOGADAJI D
    LEFT JOIN 
      MJESTA M ON D.MJESTO_ID = M.MJESTO_ID
	  LEFT JOIN
	    KORISNICI_ROLE K ON D.KORISNIK_ID = K.KORISNIK_ID
    LEFT JOIN
      MJESTA M1 ON K.MJESTO_ID = M1.MJESTO_ID
    LEFT JOIN
      STATUSI S ON D.STATUS_ID = S.STATUS_ID
	  LEFT JOIN 
	  VEZE_KORISNICI_DOGADAJI VKD ON VKD.KORISNIK_ID = $1 AND VKD.DOGADAJ_ID = D.DOGADAJ_ID
	  WHERE VRIJEME > CURRENT_TIMESTAMP
	  ORDER BY VRIJEME DESC
  `;
    const resSelect = await client.query(sql, [korisnik_id]);

    res.json(resSelect.rows);
  } catch (err) {
    console.log(err);
  }
});

app.post("/upComingEvents", async (req, res) => {
  const email = req.body.email;

  try {
    const sqlUserId = "SELECT KORISNIK_ID FROM KORISNICI_ROLE WHERE EMAIL = $1";
    const resUserId = await client.query(sqlUserId, [email]);

    if (resUserId.rows.length === 0) {
      return res.status(404).send("User not found");
    }

    const korisnik_id = resUserId.rows[0].korisnik_id;
    const status1 = "Uskoro";
    const status2 = "U tijeku";

    const sql = `
    SELECT 
      D.DOGADAJ_ID,
      D.NAZIV,
      TO_CHAR(D.VRIJEME, 'DD FMMonth, YYYY HH24:MI') as VRIJEME,
      D.BROJ_POSJETITELJA,
      D.OPIS,
      D.ULICA|| ', ' || M.NAZIV AS ADRESA,
      D.LATITUDE,        
      D.LONGITUDE,
      D.KORISNIK_ID,
	    K.IME || ' ' || K.PREZIME AS KORISNIK,
      K.ULICA|| ', ' || M1.NAZIV AS ADRESA_KORISNIKA,
      S.NAZIV AS STATUS,
	  CASE 
        WHEN VKD.VKD_ID IS NULL THEN false
        ELSE true
    END AS DOLAZI
    FROM 
      DOGADAJI D
    LEFT JOIN 
      MJESTA M ON D.MJESTO_ID = M.MJESTO_ID
	  LEFT JOIN
	    KORISNICI_ROLE K ON D.KORISNIK_ID = K.KORISNIK_ID
    LEFT JOIN
      MJESTA M1 ON K.MJESTO_ID = M1.MJESTO_ID
    LEFT JOIN
      STATUSI S ON D.STATUS_ID = S.STATUS_ID
	  LEFT JOIN 
	  VEZE_KORISNICI_DOGADAJI VKD ON VKD.KORISNIK_ID = $1 AND VKD.DOGADAJ_ID = D.DOGADAJ_ID
	  WHERE 
		(S.Naziv = $2 OR S.Naziv = $3) AND
		VRIJEME > CURRENT_TIMESTAMP
	  ORDER BY VRIJEME ASC
    LIMIT 15
  `;
    const resSelect = await client.query(sql, [korisnik_id, status1, status2]);

    res.json(resSelect.rows);
  } catch (err) {
    console.log(err);
  }
});

app.post("/confirmAttendee", async (req, res) => {
  const { email, dogadaj_id } = req.body;

  try {
    const sqlUserId = "SELECT KORISNIK_ID FROM KORISNICI_ROLE WHERE EMAIL = $1";
    const result = await client.query(sqlUserId, [email]);

    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }

    const korisnik_id = result.rows[0].korisnik_id;

    const sql = `INSERT INTO VEZE_KORISNICI_DOGADAJI(KORISNIK_ID, DOGADAJ_ID) VALUES($1, $2)`;
    await client.query(sql, [korisnik_id, dogadaj_id]);

    res.status(200).send("Attendance confirmed");
  } catch (error) {
    console.error("Error during query execution:", error);
    res.status(500).send("Error processing request");
  }
});

app.post("/removeAttendee", async (req, res) => {
  const { email, dogadaj_id } = req.body;

  try {
    const sqlUserId = "SELECT KORISNIK_ID FROM KORISNICI_ROLE WHERE EMAIL = $1";
    const result = await client.query(sqlUserId, [email]);

    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }

    const korisnik_id = result.rows[0].korisnik_id;

    const sql = `DELETE FROM VEZE_KORISNICI_DOGADAJI WHERE KORISNIK_ID = $1 AND DOGADAJ_ID = $2`;
    await client.query(sql, [korisnik_id, dogadaj_id]);

    res.status(200).send("Attendance deleted");
  } catch (error) {
    console.error("Error during query execution:", error);
    res.status(500).send("Error processing request");
  }
});

app.post("/updateEvent", async (req, res) => {
  const { dogadaj_id, opis, ulica, datum, time, naziv, status_id } = req.body;

  eventDateTime = new Date(`${datum}T${time}`);

  const currentDate = new Date();

  if (eventDateTime < currentDate) {
    return res.json({ message: "Date cant be in past" });
  }

  let newStatus_id = status_id;

  if (!status_id) newStatus_id = parseInt("-1", 10);

  const sql = `
      UPDATE dogadaji
      SET naziv = $1, opis = $2, ulica = $3, vrijeme = $4, status_id = $5
      WHERE dogadaj_id = $6
    `;
  try {
    const result = await client.query(sql, [
      naziv,
      opis,
      ulica,
      eventDateTime,
      newStatus_id,
      dogadaj_id,
    ]);
    if (result.rowCount > 0) {
      return res.json({ message: "Event updated successfully" });
    } else {
      return res.status(404).json({ message: "Event not found" });
    }
  } catch (err) {
    console.error(err);
  }
});

app.get("/getOrganizer", async (req, res) => {
  const { dogadaj_id } = req.query;
  const getUserIdSql = "SELECT korisnik_id FROM dogadaji WHERE dogadaj_id = $1";
  const getUserNameSql =
    "SELECT ime FROM korisnici_role WHERE korisnik_id = $1";

  let userId;

  try {
    const result = await client.query(getUserIdSql, [dogadaj_id]);

    if (result.rowCount <= 0)
      return res.json({ message: "Error getting user id from event" });

    userId = result.rows[0].korisnik_id;
  } catch (err) {
    console.error(err);
  }

  try {
    const result = await client.query(getUserNameSql, [userId]);

    if (result.rowCount <= 0)
      return res.json({ message: "Error getting user by id from users" });

    return res.json(result.rows[0].ime);
  } catch (err) {
    console.error(err);
  }
});

app.get("/getEventStatusId", async (req, res) => {
  const { dogadaj_id } = req.query;

  const getStatusIdSql = "SELECT status_id FROM dogadaji WHERE dogadaj_id = $1";
  const getStatusByIdSql = "SELECT naziv FROM statusi WHERE status_id = $1";

  let statusId;

  try {
    const result = await client.query(getStatusIdSql, [dogadaj_id]);

    if (result.rowCount <= 0)
      return res.json({ message: "Error getting event status id from events" });

    statusId = result.rows[0].status_id;
  } catch (err) {
    console.error(err);
  }

  try {
    const statusResult = await client.query(getStatusByIdSql, [statusId]);

    if (statusResult.rowCount <= 0)
      return res.json({
        message: "Error getting event status from status table",
      });

    return res.json(statusResult.rows[0].naziv);
  } catch (err) {
    console.error(err);
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

const verifyRole = require("./verifyRole");

app.delete(
  "/admin/delete-user/:id",
  verifyRole(["admin"]),
  async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const loggedInUserId = req.user.userId;

    if (userId === loggedInUserId)
      return res.status(403).send("You cannot delete your own account.");

    try {
      await client.query(
        `DELETE FROM veze_korisnici_dogadaji
       WHERE dogadaj_id IN (SELECT dogadaj_id FROM dogadaji WHERE korisnik_id = $1)`,
        [userId]
      );

      await client.query("DELETE FROM dogadaji WHERE korisnik_id = $1", [
        userId,
      ]);

      const result = await client.query(
        "DELETE FROM korisnici_role WHERE korisnik_id = $1",
        [userId]
      );

      if (result.rowCount === 0) return res.status(404).send("User not found");

      res.send("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);

      res.status(500).send("Internal Server Error");
    }
  }
);

app.delete("/admin/delete-event/:id", verifyRole(["admin"]), (req, res) => {
  const eventId = req.params.id;

  const deleteEventQuery = "DELETE FROM dogadaji WHERE dogadaj_id = $1";

  client.query(deleteEventQuery, [eventId], (err, result) => {
    if (err) return res.status(500).send("Error deleting event");

    res.send("Event deleted successfully");
  });
});
