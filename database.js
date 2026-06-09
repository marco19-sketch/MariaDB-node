import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

export const pool = mysql
  .createPool({
    host: process.env.MARIADB_HOST,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
  })
  .promise();

//destructuring(scompattando)
// const [rows, row2] = await pool.query("SELECT * FROM utenti");
// console.log(rows[0], row2);
//creating a function
export const getRecords = async () => {
  const [rows, metadata] = await pool.query("SELECT * FROM utenti"); //we get an array as response, so we destructure
  return rows;
};

//richiamare rows
// const records = await getRecords();
// console.log("getRecords:", records[0]);

//ottenere singolo utente
export const getRecord = async id => {
  //to prevent sql-injection we don't put the id variable in the sql request, but as a 2nd value separate value
  //  - , [id]- that will be handled by the database in a safer way
  const [row] = await pool.query(`SELECT * FROM utenti WHERE id = ?`, [id]);
  return row[0]; //returning a single item we get a single object and not an array when we call the function later
  //and if I put a non-existent id I get the first item as response
};

// const record = await getRecord(5);
// console.log("getRecord:", record);

export const createRecord = async (nome, cognome, dob, lavoro) => {
  const [result] = await pool.query(
    //result is the first destructured item of the array response we get from pool.query
    `INSERT INTO utenti(nome, cognome, dob, lavoro)
        VALUES(?, ?, ?, ?)`,
    [nome, cognome, dob, lavoro],
  );
  //to get the data just inserted in the console we can call the 'getRecord' function above, with the
  // just created 'insertId' that we get from the 'result' const
  const id = result.insertId; //since we extracted the result object from the array, we can get the insertId value
  console.log("id:", id);
  console.log("result object:", result);
  return getRecord(id);
  //   return result;
};

// const newRecord = await createRecord(
//   "Vanessa",
//   "Di Liberto",
//   "1999-10-10",
//   "estetista",
// );
// console.log("createRecord", newRecord);

//let's see the response array we get from pool.query
// const resArray = async (nome, cognome, dob, lavoro) => {
//   const array = await pool.query(
//     `INSERT INTO utenti(nome, cognome, dob, lavoro)
//         VALUES(?, ?, ?, ?)`,
//     [nome, cognome, dob, lavoro],
//   );
//   const [first, arraySecondItem] = array;
//   const id = first.insertId;
//   console.log(
//     "array:",
//     array,
//     "length:",
//     array.length,
//     "\nsecond array item",
//     arraySecondItem,
//     "\nid:",
//     id,
//   );
// };

// const arrayRes = await resArray("Giada", "Nasello", "2000-10-09", "studente");
