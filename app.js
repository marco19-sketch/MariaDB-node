import { getRecords, getRecord, createRecord, pool } from "./database.js";
import express from "express";

const app = express();

app.use(express.json());

app.get("/utenti", async (req, res) => {
  const utenti = await getRecords();
  res.send(utenti);
});

app.get("/utenti/:id", async (req, res) => {
  //const { id } = req.params; //with destructuring
  const id = req.params.id; //without destructuring
  const utente = await getRecord(Number(id));
  res.send(utente);
});

app.post("/utenti", async (req, res) => {
  // req.body contains the DATA sent by client in JSON format
  const { nome, cognome, dob, lavoro } = req.body;
  const utente = await createRecord(nome, cognome, dob, lavoro);

  // res.json() is a METHOD that sends a JSON response to the client
  // {} creates a new OBJECT with two properties: messaggio and utente
  // messaggio is a PROPERTY with string value "nuovo utente creato"
  // utente is a PROPERTY containing the original request body data
  res.status(201).json({ messaggio: "nuovo utente creato", utente: req.body });
  //res.send({ messaggio: "nuovo utente creato", utente: req.body }); //works as well
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
