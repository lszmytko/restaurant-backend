const { urlencoded } = require("express");
const express = require("express");
const app = express();
const cors = require("cors");
const { client } = require("./dbConfig");
const bcrypt = require("bcryptjs");
const {
  handleRegister,
  handleLogin,
  requireAuth,
  handlePlaceOrder,
} = require("./authHandler");
const cookieParser = require("cookie-parser");

const PORT = 4000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

app.post("/users/register", async (req, res) => {
  handleRegister(req, res);
});

app.post("/users/login", async (req, res) => {
  handleLogin(req, res);
});

app.get("/", async (req, res) => {
  try {
    const response = await client.query(query);
    console.log("response", response);
    return res.send({
      success: true,
    });
  } catch (error) {
    return res.send({
      success: false,
    });
  }
});

app.post("/placeOrder", requireAuth, (req, res) => {
  // console.log("body", req.body);
  // const { dishes, price, customer_id, date } = req.body;
  // const dishesToAdd = JSON.stringify(dishes);
  // const query = {
  //   text: "INSERT INTO orders (dishes, price, customer_id, date) VALUES($1, $2, $3, $4)",
  //   values: [dishesToAdd, price, customer_id, date],
  // };
  // try {
  //   client.query(query);
  //   return res.json({
  //     success: true,
  //   });
  // } catch (error) {
  //   return res.json({
  //     success: false,
  //   });
  // }
});

app.post("/history", requireAuth, async (req, res) => {
  const { id } = req.body;
  console.log("id", id);
  console.log("body", req.body);
  const query = {
    text: "SELECT * from orders where customer_id = $1",
    values: [id],
  };
  try {
    const response = await client.query(query);
    console.log("responseeee", response.rows);
    res.json({
      message: response.rows,
    });
  } catch (e) {
    console.log("b????d");
    res.json({
      details: "error",
    });
  }
});

app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  console.log("body", req.body);
  const { name, lastName, street, flatNumber, phone } = req.body;
  const query = {
    text: "UPDATE sklepusers SET name = $1, lastName = $2, street = $3, flatNumber = $4, phone = $5 where id = $6",
    values: [name, lastName, street, flatNumber, phone, id],
  };
  try {
    const userExisting = await client.query(query);
    res.json({
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
});

app.listen(process.env.PORT || PORT, () => {
  console.log("Serwer dzia??a");
});
