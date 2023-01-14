const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { handleRegister, handleLogin, requireAuth } = require("./authHandler");
const {
  handleUpdate,
  handleCheckDB,
  handlePlaceOrder,
  handleShowHistory,
} = require("./handlers");

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

app.post("/users/register", handleRegister);

app.post("/users/login", handleLogin);

app.get("/", handleCheckDB);

app.post("/placeOrder", requireAuth, handlePlaceOrder);

app.post("/history", requireAuth, handleShowHistory);

app.put("/update/:id", handleUpdate);

app.listen(PORT, () => {
  console.log("Serwer działa na porcie " + PORT);
});
