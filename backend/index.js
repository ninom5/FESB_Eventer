const express = require("express");
const cors = require("cors");
const app = express();

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

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
